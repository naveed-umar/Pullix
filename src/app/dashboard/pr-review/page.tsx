import { fetchOpenPullRequests } from "@/app/dashboard/actions/pull-requests";
import { PRReviewClient } from "@/components/features/pr-review-client";

export default async function PRReviewPage() {
  let pullRequests = [];
  let repository = null;
  let error = null;

  try {
    const data = await fetchOpenPullRequests();
    pullRequests = data.pullRequests;
    repository = data.repository;
  } catch (e: any) {
    error = e.message;
  }

  return (
    <PRReviewClient 
      repository={repository} 
      pullRequests={pullRequests} 
    />
  );
}
