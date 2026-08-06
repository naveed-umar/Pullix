"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitPullRequest, GitCommit, User, AlertTriangle, CheckCircle2, MessageSquare, Loader2, PlayCircle, Plus, Minus, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { analyzePullRequest } from "@/app/dashboard/actions/pull-requests";

export function PRReviewClient({ repository, pullRequests }: { repository: any, pullRequests: any[] }) {
  const [selectedPR, setSelectedPR] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  const handleSelectPR = async (pr: any) => {
    setSelectedPR(pr);
    setAnalysisResult(null);
    setIsAnalyzing(true);
    try {
      const result = await analyzePullRequest(repository.owner, repository.name, pr.number);
      setAnalysisResult(result);
    } catch (e: any) {
      alert("Failed to analyze PR: " + e.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!repository) {
    return (
      <div className="flex flex-col gap-8 h-[calc(100vh-8rem)] items-center justify-center text-center">
        <GitPullRequest className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
        <h1 className="text-2xl font-bold tracking-tight">No Repository Connected</h1>
        <p className="text-muted-foreground mt-1 max-w-sm">Connect a repository in the dashboard to review its Pull Requests.</p>
      </div>
    );
  }

  if (pullRequests.length === 0) {
    return (
      <div className="flex flex-col gap-8 h-[calc(100vh-8rem)] items-center justify-center text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-500 opacity-50 mb-4" />
        <h1 className="text-2xl font-bold tracking-tight">All Caught Up!</h1>
        <p className="text-muted-foreground mt-1 max-w-sm">There are no open Pull Requests in {repository.owner}/{repository.name}.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pull Request Reviews</h1>
        <p className="text-muted-foreground mt-1">Select an open PR from {repository.owner}/{repository.name} to generate an AI review.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar: PR List */}
        <div className="space-y-4 lg:col-span-1 border-r border-border/50 pr-6">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <GitPullRequest className="h-4 w-4" /> Open PRs ({pullRequests.length})
          </h3>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
            {pullRequests.map(pr => (
              <button
                key={pr.number}
                onClick={() => handleSelectPR(pr)}
                className={`w-full text-left p-3 rounded-md transition-colors border ${
                  selectedPR?.number === pr.number
                    ? "bg-primary/10 border-primary/30"
                    : "bg-card/50 border-border/50 hover:bg-muted/50"
                }`}
              >
                <div className="text-sm font-medium leading-tight mb-1 truncate">{pr.title}</div>
                <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                  <span>#{pr.number}</span>
                  <span className="flex items-center gap-1"><User className="h-3 w-3" /> {pr.user}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {!selectedPR ? (
            <div className="h-full flex flex-col items-center justify-center border border-dashed border-border/50 rounded-xl bg-card/20 p-12 text-center min-h-[400px]">
              <GitPullRequest className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold">Select a Pull Request</h3>
              <p className="text-muted-foreground text-sm max-w-sm mt-2">Choose a PR from the sidebar to instantly analyze its diff and generate a review.</p>
            </div>
          ) : isAnalyzing ? (
            <div className="h-full flex flex-col items-center justify-center border border-border/50 rounded-xl bg-card/50 p-12 text-center min-h-[400px]">
              <Loader2 className="h-10 w-10 text-primary mb-4 animate-spin" />
              <h3 className="text-lg font-semibold animate-pulse">Analyzing PR #{selectedPR.number}...</h3>
              <p className="text-muted-foreground text-sm max-w-sm mt-2">Fetching diff, evaluating architecture impact, and scanning for security issues.</p>
            </div>
          ) : analysisResult ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold tracking-tight">PR #{selectedPR.number}: {selectedPR.title}</h2>
                  <Badge className="bg-emerald-500">Open</Badge>
                </div>
                <a href={selectedPR.html_url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
                  View on GitHub &rarr;
                </a>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GitPullRequest className="h-5 w-5 text-primary" /> AI Pull Request Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-sm leading-relaxed space-y-4">
                        <p>{analysisResult.review.summary}</p>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-border/50">
                        <h4 className="font-semibold text-sm">Key Changes</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                          {analysisResult.review.keyChanges.map((change: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {analysisResult.review.potentialIssues.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-border/50">
                          <h4 className="font-semibold text-sm text-destructive flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" /> Potential Issues Found
                          </h4>
                          <ul className="space-y-3 text-sm text-muted-foreground">
                            {analysisResult.review.potentialIssues.map((issue: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                                <span>{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardHeader>
                      <CardTitle>Deployment Risk</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex flex-col items-center justify-center py-4">
                        <div className={`h-16 w-16 rounded-full flex items-center justify-center border-4 font-bold text-xl mb-2
                          ${analysisResult.review.riskLevel === 'High' ? 'bg-destructive/10 border-destructive/20 text-destructive' : 
                            analysisResult.review.riskLevel === 'Medium' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' : 
                            'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}
                        `}>
                          {analysisResult.review.riskLevel === 'High' ? 'High' : 
                           analysisResult.review.riskLevel === 'Medium' ? 'Med' : 'Low'}
                        </div>
                        <p className="text-sm text-center text-muted-foreground mt-2">
                          {analysisResult.review.riskReasoning}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardHeader>
                      <CardTitle>Changed Files ({analysisResult.changedFilesCount})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
                      {analysisResult.changedFiles.map((file: any, idx: number) => (
                        <div key={idx} className="flex flex-col text-sm border-b border-border/20 last:border-0 pb-2 mb-2 last:mb-0 last:pb-0">
                          <span className="font-mono text-xs text-muted-foreground break-all">{file.filename}</span>
                          <div className="flex gap-3 text-xs mt-1">
                            {file.additions > 0 && <span className="text-emerald-500 flex items-center"><Plus className="h-3 w-3 mr-0.5"/>{file.additions}</span>}
                            {file.deletions > 0 && <span className="text-destructive flex items-center"><Minus className="h-3 w-3 mr-0.5"/>{file.deletions}</span>}
                            {file.status === 'added' && <Badge variant="outline" className="text-[10px] h-4 ml-auto">New</Badge>}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
