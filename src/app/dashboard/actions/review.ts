"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const reviewSchema = z.object({
  reviews: z.array(z.object({
    file_path: z.string(),
    category: z.enum(["Security", "Performance", "Code Quality", "Architecture", "Accessibility"]),
    severity: z.enum(["Critical", "High", "Medium", "Low"]),
    title: z.string(),
    description: z.string(),
    recommendation: z.string(),
    suggested_fix: z.string()
  }))
});

export async function reviewBatch(repositoryId: string, filesToReview: string[]) {
  const supabase = await createClient();
  const cookieStore = await cookies();
  const token = cookieStore.get('github_access_token')?.value;

  if (!token) throw new Error("GitHub account not connected.");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Fetch repository
  const { data: repo, error: repoError } = await supabase
    .from('repositories')
    .select('*')
    .eq('id', repositoryId)
    .single();

  if (repoError || !repo) throw new Error("Repository not found.");

  // Fetch metadata from ai_analyses for context
  const { data: scan } = await supabase
    .from('ai_analyses')
    .select('result')
    .eq('repository_id', repositoryId)
    .eq('analysis_type', 'repository_scan')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const framework = scan?.result?.framework || "Unknown";
  const languages = scan?.result?.languages ? scan.result.languages.join(", ") : "Unknown";

  // Fetch file contents
  const fileContents = await Promise.all(filesToReview.map(async (filePath) => {
    try {
      const res = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.name}/contents/${filePath}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3.raw'
        }
      });
      if (res.ok) {
        const content = await res.text();
        return { path: filePath, content };
      }
    } catch (e) {
      console.error(`Failed to fetch ${filePath}`);
    }
    return null;
  }));

  const validFiles = fileContents.filter(f => f !== null && f.content.trim() !== "");
  if (validFiles.length === 0) return { success: true, count: 0 };

  // Prepare prompt
  let prompt = `Analyze the following files for Security, Performance, Code Quality, Architecture, and Accessibility issues.\n`;
  prompt += `Repository Context:\nFramework: ${framework}\nLanguages: ${languages}\n\n`;
  prompt += `For each issue found, provide a detailed review matching the schema.\n\n`;
  
  validFiles.forEach(f => {
    prompt += `\n--- File: ${f!.path} ---\n${f!.content}\n`;
  });

  // Call Gemini
  const { object } = await generateObject({
    model: google('gemini-3.5-flash'),
    schema: reviewSchema,
    prompt: prompt,
    system: "You are an expert Principal Software Engineer and Security Auditor. Provide strict, actionable code reviews."
  });

  // Save to DB
  if (object.reviews.length > 0) {
    const inserts = object.reviews.map(review => ({
      repository_id: repositoryId,
      user_id: user.id,
      analysis_type: 'ai_review',
      result: {
        file_path: review.file_path,
        category: review.category,
        severity: review.severity,
        title: review.title,
        description: review.description,
        recommendation: review.recommendation,
        suggested_fix: review.suggested_fix,
        status: 'Open'
      }
    }));

    const { error: dbError } = await supabase.from('ai_analyses').insert(inserts);
    if (dbError) throw new Error("Failed to save reviews to database: " + dbError.message);
  }

  revalidatePath('/dashboard/ai-review');
  return { success: true, count: object.reviews.length };
}

export async function getReviewableFiles(repositoryId: string) {
  const supabase = await createClient();
  const cookieStore = await cookies();
  const token = cookieStore.get('github_access_token')?.value;

  if (!token) throw new Error("GitHub account not connected.");

  const { data: repo } = await supabase
    .from('repositories')
    .select('*')
    .eq('id', repositoryId)
    .single();

  if (!repo) throw new Error("Repository not found.");

  const repoInfoRes = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.name}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!repoInfoRes.ok) throw new Error("Failed to fetch repo info");
  const repoInfo = await repoInfoRes.json();

  const treeRes = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.name}/git/trees/${repoInfo.default_branch}?recursive=1`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!treeRes.ok) throw new Error("Failed to fetch tree");
  const treeData = await treeRes.json();

  const excludePatterns = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage', '.png', '.jpg', '.ico', '.svg', '.json', '.md'];
  
  const files = treeData.tree
    .filter((f: any) => f.type === 'blob')
    .filter((f: any) => !excludePatterns.some(pattern => f.path.includes(pattern)))
    .map((f: any) => f.path);

  // Return a subset of files to avoid burning through limits (e.g. up to 15 files)
  return files.slice(0, 15);
}

export async function markReviewFixed(reviewId: string) {
  const supabase = await createClient();
  
  // First get the review to update its result JSON
  const { data: review } = await supabase.from('ai_analyses').select('result').eq('id', reviewId).single();
  
  if (review && review.result) {
    const updatedResult = { ...review.result, status: 'Fixed' };
    await supabase.from('ai_analyses').update({ result: updatedResult }).eq('id', reviewId);
  }
  
  revalidatePath('/dashboard/ai-review');
}
