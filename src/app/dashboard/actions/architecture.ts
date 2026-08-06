"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import fs from 'fs/promises'
import path from 'path'
import os from 'os'
import AdmZip from 'adm-zip'
import crypto from 'crypto'
import { revalidatePath } from "next/cache"

export async function generateArchitecture(repositoryId: string) {
  const supabase = await createClient();
  const cookieStore = await cookies();
  const token = cookieStore.get('github_access_token')?.value;

  if (!token) throw new Error("GitHub account not connected. Please reconnect.");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: repo, error: repoError } = await supabase
    .from('repositories')
    .select('*')
    .eq('id', repositoryId)
    .single();

  if (repoError || !repo) throw new Error("Repository not found.");

  // Download zipball
  const repoInfoRes = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.name}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!repoInfoRes.ok) throw new Error("Failed to get repo info.");
  const repoInfo = await repoInfoRes.json();

  const zipUrl = `https://api.github.com/repos/${repo.owner}/${repo.name}/zipball/${repoInfo.default_branch}`;
  const zipRes = await fetch(zipUrl, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!zipRes.ok) throw new Error("Failed to download repository.");
  const arrayBuffer = await zipRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const tmpDir = path.join(os.tmpdir(), `pullix_${crypto.randomUUID()}`);
  const zipPath = `${tmpDir}.zip`;

  await fs.writeFile(zipPath, buffer);
  
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(tmpDir, true);

  // Read extracted folder (Github zips wrap contents in a root folder)
  const extractedFolders = await fs.readdir(tmpDir);
  const rootFolder = path.join(tmpDir, extractedFolders[0]);

  // Static Analysis
  const excludeDirs = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage'];
  
  const files: { path: string, content: string, type: string }[] = [];

  async function walk(dir: string, base: string = '') {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (excludeDirs.includes(entry.name)) continue;
      
      const res = path.resolve(dir, entry.name);
      const relPath = path.join(base, entry.name).replace(/\\/g, '/');
      
      if (entry.isDirectory()) {
        await walk(res, relPath);
      } else {
        if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) {
          const content = await fs.readFile(res, 'utf-8');
          
          let type = 'Utility';
          if (relPath.includes('/components/') || content.includes('from "react"') || content.includes('from \'react\'') || relPath.endsWith('tsx') || relPath.endsWith('jsx')) {
            type = 'Component';
          }
          if (relPath.includes('/api/') || relPath.endsWith('route.ts') || relPath.endsWith('route.js')) {
            type = 'API Route';
          }
          if (relPath.includes('/db/') || relPath.includes('prisma')) {
            type = 'Database';
          }
          if (relPath.includes('/services/') || relPath.includes('/actions/')) {
            type = 'Service';
          }
          if (relPath.includes('/hooks/') || entry.name.startsWith('use')) {
            type = 'Hook';
          }

          files.push({
            path: relPath,
            content,
            type
          });
        }
      }
    }
  }

  await walk(rootFolder);

  const nodes: any[] = [];
  const edges: any[] = [];
  const importRegex = /import\s+(?:(?:[\w*\s{},]*)\s+from\s+)?['"]([^'"]+)['"]/g;

  // Track to check circular dependencies
  const dependenciesMap: Record<string, string[]> = {};

  // Build Nodes & Dependency Map
  files.forEach((file, index) => {
    nodes.push({
      id: file.path,
      type: 'default',
      data: { 
        label: file.path.split('/').pop(), 
        fullPath: file.path, 
        nodeType: file.type,
        imports: 0,
        dependents: 0
      },
    });

    const imports: string[] = [];
    let match;
    while ((match = importRegex.exec(file.content)) !== null) {
      imports.push(match[1]);
    }
    
    dependenciesMap[file.path] = imports;
    nodes[index].data.imports = imports.length;
  });

  // Resolve edges and dependents
  files.forEach(file => {
    const fileDir = path.dirname(file.path);
    const imports = dependenciesMap[file.path];
    
    imports.forEach(imp => {
      // Very basic resolution for relative and alias paths (assuming alias @/ points to src/)
      let targetPath = imp;
      
      if (imp.startsWith('.')) {
        targetPath = path.join(fileDir, imp).replace(/\\/g, '/');
      } else if (imp.startsWith('@/')) {
        targetPath = imp.replace('@/', 'src/');
      }

      // Try to find the exact file being imported, trying extensions
      const possibleTargets = [
        targetPath,
        `${targetPath}.ts`,
        `${targetPath}.tsx`,
        `${targetPath}.js`,
        `${targetPath}.jsx`,
        `${targetPath}/index.ts`,
        `${targetPath}/index.js`,
      ];

      const targetFile = files.find(f => possibleTargets.includes(f.path));
      
      if (targetFile) {
        edges.push({
          id: `e-${file.path}-${targetFile.path}`,
          source: file.path,
          target: targetFile.path,
          animated: true,
        });

        // Update dependents count
        const targetNode = nodes.find(n => n.id === targetFile.path);
        if (targetNode) targetNode.data.dependents += 1;
      }
    });
  });

  // Basic Circular Dependency Check
  const circulars = [];
  for (const file of files) {
    const deps = edges.filter(e => e.source === file.path).map(e => e.target);
    for (const dep of deps) {
      if (edges.some(e => e.source === dep && e.target === file.path)) {
        circulars.push(`${file.path} <-> ${dep}`);
      }
    }
  }

  // Cleanup temp files
  try {
    await fs.rm(tmpDir, { recursive: true, force: true });
    await fs.rm(zipPath, { force: true });
  } catch (e) {}

  const resultData = {
    nodes,
    edges,
    circulars: Array.from(new Set(circulars)), // Deduplicate
    totalFiles: files.length
  };

  // Save to DB
  const { error: dbError } = await supabase.from('ai_analyses').insert({
    repository_id: repositoryId,
    user_id: user.id,
    analysis_type: 'architecture_graph',
    result: resultData
  });

  if (dbError) throw new Error("Failed to save architecture graph: " + dbError.message);

  revalidatePath(`/dashboard/architecture`);
  return { success: true };
}
