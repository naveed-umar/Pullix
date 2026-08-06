import { createClient } from "@/utils/supabase/server";
import ReviewDashboardClient from "./review-dashboard-client";

export default async function AIReviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let repositoryId = null;
  let reviews = [];

  if (user) {
    // For demo purposes, fetch the user's first repository
    const { data: repo } = await supabase
      .from('repositories')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    if (repo) {
      repositoryId = repo.id;
      const { data: dbReviews } = await supabase
        .from('ai_analyses')
        .select('id, result')
        .eq('repository_id', repositoryId)
        .eq('analysis_type', 'ai_review')
        .order('created_at', { ascending: false });
        
      reviews = dbReviews?.map((r: any) => ({ id: r.id, ...r.result })) || [];
    }
  }

  return (
    <ReviewDashboardClient 
      repositoryId={repositoryId!} 
      initialReviews={reviews} 
    />
  );
}
