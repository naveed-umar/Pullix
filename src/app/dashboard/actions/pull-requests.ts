"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"

export async function fetchOpenPullRequests() {
  const supabase = await createClient();
  const cookieStore = await cookies();
  const token = cookieStore.get('github_access_token')?.value;

  if (!token) throw new Error("GitHub account not connected.");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: repo } = await supabase
    .from('repositories')
    .select('*')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  if (!repo) throw new Error("No repository connected.");

  const res = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.name}/pulls?state=open`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error("Failed to fetch pull requests.");
  const prs = await res.json();
  
  return {
    repository: repo,
    pullRequests: prs.map((pr: any) => ({
      number: pr.number,
      title: pr.title,
      user: pr.user.login,
      created_at: pr.created_at,
      html_url: pr.html_url
    }))
  };
}

const prReviewSchema = z.object({
  summary: z.string(),
  keyChanges: z.array(z.string()),
  riskLevel: z.enum(["High", "Medium", "Low"]),
  riskReasoning: z.string(),
  potentialIssues: z.array(z.string())
});

export async function analyzePullRequest(repoOwner: string, repoName: string, prNumber: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get('github_access_token')?.value;

  if (!token) throw new Error("GitHub account not connected.");

  // Fetch PR Diff
  const diffRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${prNumber}`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3.diff'
    }
  });

  if (!diffRes.ok) throw new Error("Failed to fetch PR diff.");
  const diffContent = await diffRes.text();

  // Fetch PR Files for metrics
  const filesRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${prNumber}/files`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const filesData = await filesRes.json();

  let prompt = `Analyze the following Pull Request diff and file changes.\n\n`;
  prompt += `Files Changed:\n`;
  filesData.forEach((f: any) => {
    prompt += `- ${f.filename} (+${f.additions} -${f.deletions})\n`;
  });
  
  prompt += `\nDiff:\n${diffContent.substring(0, 30000)}\n\n`; 

  const { object } = await generateObject({
    model: google('gemini-3.5-flash'),
    schema: prReviewSchema,
    prompt: prompt,
    system: "You are an expert Principal Software Engineer. Provide a concise, structured review of this Pull Request."
  });

  return {
    review: object,
    changedFiles: filesData.map((f: any) => ({
      filename: f.filename,
      status: f.status,
      additions: f.additions,
      deletions: f.deletions,
      changes: f.changes
    })),
    changedFilesCount: filesData.length
  };
}
