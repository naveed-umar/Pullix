"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveRepository(repoData: any) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Unauthorized")
  }

  // Format the data to match our schema
  const dbPayload = {
    user_id: user.id,
    github_id: repoData.id.toString(),
    name: repoData.name,
    owner: repoData.owner?.login || "unknown",
    language: repoData.language || "Unknown",
    is_private: repoData.private || false,
    url: repoData.html_url || `https://github.com/${repoData.full_name}`
  }

  const { data, error } = await supabase
    .from('repositories')
    .insert(dbPayload)
    .select()
    .single()

  if (error) {
    console.error("Database insert error:", error)
    throw new Error(error.message)
  }

  // Automatically trigger the repository scan and architecture generation in the background
  // We don't await this so the user isn't blocked waiting for the scan to finish
  import('@/app/dashboard/actions/scan').then(({ scanRepository }) => {
    scanRepository(data.id).then(() => {
      import('@/app/dashboard/actions/architecture').then(({ generateArchitecture }) => {
        generateArchitecture(data.id).catch(err => console.error("Auto-arch failed:", err));
      });
    }).catch(err => console.error("Auto-scan failed:", err));
  });

  revalidatePath("/dashboard/repositories")
  return data
}
