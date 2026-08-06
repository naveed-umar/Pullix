"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function scanRepository(repositoryId: string) {
  const supabase = await createClient();
  const cookieStore = await cookies();
  const token = cookieStore.get('github_access_token')?.value;

  if (!token) {
    throw new Error("GitHub account not connected. Please reconnect.");
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // 1. Fetch Repository Info from our DB
  const { data: repo, error: repoError } = await supabase
    .from('repositories')
    .select('*')
    .eq('id', repositoryId)
    .single();

  if (repoError || !repo) throw new Error("Repository not found in database.");

  try {
    // 2. Fetch the default branch from GitHub
    const repoInfoRes = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.name}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!repoInfoRes.ok) throw new Error("Failed to access GitHub repository.");
    const repoInfo = await repoInfoRes.json();
    const defaultBranch = repoInfo.default_branch;

    // 3. Fetch the repository tree
    const treeRes = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.name}/git/trees/${defaultBranch}?recursive=1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!treeRes.ok) throw new Error("Failed to fetch repository tree.");
    const treeData = await treeRes.json();

    // 4. Filter for relevant files and folders
    const excludePatterns = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage'];
    
    let fileCount = 0;
    let folderCount = 0;
    const topLevelFolders = new Set<string>();
    
    // We'll also look for package.json or pubspec.yaml to get dependencies
    let packageJsonPath: string | null = null;
    let pubspecPath: string | null = null;

    treeData.tree.forEach((item: any) => {
      // Check if it should be excluded
      if (excludePatterns.some(pattern => item.path.includes(`/${pattern}/`) || item.path.startsWith(`${pattern}/`) || item.path === pattern)) return;

      if (item.type === 'blob') {
        fileCount++;
        if (item.path === 'package.json') packageJsonPath = item.path;
        if (item.path === 'pubspec.yaml') pubspecPath = item.path;
      } else if (item.type === 'tree') {
        folderCount++;
        // If it's a top-level folder (no slashes in path)
        if (!item.path.includes('/')) {
          topLevelFolders.add(item.path);
        }
      }
    });

    // 5. Fetch and parse dependencies to determine framework/language
    let framework = "Unknown";
    let languages = new Set<string>();
    let dependencies: string[] = [];

    // Simple language detection based on extensions in the tree
    const hasTs = treeData.tree.some((item: any) => item.path.endsWith('.ts') || item.path.endsWith('.tsx'));
    if (hasTs) languages.add("TypeScript");
    
    const hasJs = treeData.tree.some((item: any) => item.path.endsWith('.js') || item.path.endsWith('.jsx'));
    if (hasJs && !hasTs) languages.add("JavaScript");
    if (hasJs && hasTs) languages.add("JavaScript");

    const hasDart = treeData.tree.some((item: any) => item.path.endsWith('.dart'));
    if (hasDart) languages.add("Dart");

    const hasPython = treeData.tree.some((item: any) => item.path.endsWith('.py'));
    if (hasPython) languages.add("Python");

    if (packageJsonPath) {
      const pkgRes = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.name}/contents/${packageJsonPath}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3.raw'
        }
      });
      
      if (pkgRes.ok) {
        try {
          const pkgText = await pkgRes.text();
          const pkg = JSON.parse(pkgText);
          
          const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
          dependencies = Object.keys(deps);
          
          if (deps['next']) framework = "Next.js";
          else if (deps['react']) framework = "React";
          else if (deps['vue']) framework = "Vue";
          else if (deps['@angular/core']) framework = "Angular";
          else if (deps['svelte']) framework = "Svelte";
        } catch (e) {
          console.error("Failed to parse package.json");
        }
      }
    } else if (pubspecPath) {
      framework = "Flutter";
    }

    // 6. Insert into ai_analyses table instead of repository_scans
    const scanData = {
      repository_id: repositoryId,
      user_id: user.id,
      analysis_type: 'repository_scan',
      result: {
        scan_status: 'completed',
        framework: framework,
        languages: Array.from(languages),
        file_count: fileCount,
        folder_count: folderCount,
        folders: Array.from(topLevelFolders),
        dependencies: dependencies
      }
    };

    const { error: scanError } = await supabase.from('ai_analyses').insert(scanData);
    if (scanError) throw new Error("Failed to save scan results: " + scanError.message);

    // 7. Update repository status
    await supabase.from('repositories')
      .update({
        status: 'Healthy', // For now, since we aren't scanning for issues
        updated_at: new Date().toISOString()
      })
      .eq('id', repositoryId);

    revalidatePath(`/dashboard/repositories/${repositoryId}`);
    return { success: true };
    
  } catch (error: any) {
    console.error("Scan Error:", error);
    
    // Attempt to log failed status
    try {
      await supabase.from('ai_analyses').insert({
        repository_id: repositoryId,
        user_id: user.id,
        analysis_type: 'repository_scan',
        result: { scan_status: 'failed' }
      });
    } catch (e) {
      // Ignore
    }

    throw new Error(error.message || "An error occurred during the scan.");
  }
}
