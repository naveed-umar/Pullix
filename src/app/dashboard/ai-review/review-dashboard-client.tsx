"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldAlert, Zap, Box, Activity, Search, CheckCircle2, PlayCircle, Loader2 } from "lucide-react";
import { getReviewableFiles, reviewBatch, markReviewFixed } from "../actions/review";

export default function ReviewDashboardClient({ repositoryId, initialReviews }: { repositoryId: string, initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  const totalIssues = reviews.length;
  const critical = reviews.filter(r => r.severity === 'Critical' && r.status === 'Open').length;
  const high = reviews.filter(r => r.severity === 'High' && r.status === 'Open').length;
  const medium = reviews.filter(r => r.severity === 'Medium' && r.status === 'Open').length;
  const low = reviews.filter(r => r.severity === 'Low' && r.status === 'Open').length;

  const score = Math.max(0, 100 - (critical * 10) - (high * 5) - (medium * 2) - (low * 1));

  const filteredReviews = reviews.filter(r => {
    if (filterSeverity !== "All" && r.severity !== filterSeverity) return false;
    if (filterCategory !== "All" && r.category !== filterCategory) return false;
    if (search && !r.file_path.toLowerCase().includes(search.toLowerCase()) && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleRunReview = async () => {
    if (!repositoryId) return alert("No repository connected.");
    setIsScanning(true);
    setProgress(0);
    try {
      const files = await getReviewableFiles(repositoryId);
      const batchSize = 3;
      
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        await reviewBatch(repositoryId, batch);
        setProgress(Math.round(((i + batchSize) / files.length) * 100));
      }
      
      // Reload page to get new reviews
      window.location.reload();
    } catch (e: any) {
      alert("Scan failed: " + e.message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleMarkFixed = async (id: string) => {
    await markReviewFixed(id);
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'Fixed' } : r));
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Code Reviews</h1>
          <p className="text-muted-foreground mt-1">Automated static analysis and code reviews for your repository.</p>
        </div>
        <Button onClick={handleRunReview} disabled={isScanning}>
          {isScanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlayCircle className="mr-2 h-4 w-4" />}
          {isScanning ? `Scanning (${Math.min(progress, 100)}%)` : "Run Full Review"}
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Code Score</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${score < 70 ? 'text-destructive' : score < 90 ? 'text-yellow-500' : 'text-emerald-500'}`}>
              {score}/100
            </div>
            <p className="text-xs text-muted-foreground mt-1">Based on open issues.</p>
          </CardContent>
        </Card>

        <Card className="bg-destructive/10 border-destructive/20 text-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <ShieldAlert className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{critical}</div>
          </CardContent>
        </Card>

        <Card className="bg-orange-500/10 border-orange-500/20 text-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High</CardTitle>
            <Zap className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{high}</div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-500/10 border-yellow-500/20 text-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium</CardTitle>
            <Box className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medium}</div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 border-border/50 text-muted-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low</CardTitle>
            <Activity className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{low}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files or issues..."
            className="pl-9 bg-card/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="flex h-10 w-48 items-center justify-between rounded-md border border-input bg-card/50 px-3 py-2 text-sm ring-offset-background"
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
        >
          <option value="All">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select 
          className="flex h-10 w-48 items-center justify-between rounded-md border border-input bg-card/50 px-3 py-2 text-sm ring-offset-background"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Security">Security</option>
          <option value="Performance">Performance</option>
          <option value="Code Quality">Code Quality</option>
          <option value="Architecture">Architecture</option>
          <option value="Accessibility">Accessibility</option>
        </select>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 border border-dashed border-border/50 rounded-xl bg-card/20">
            No issues found. Run a full review to analyze your codebase!
          </div>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id} className={`bg-card/50 backdrop-blur-sm border-border/50 ${review.status === 'Fixed' ? 'opacity-50' : ''}`}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{review.category}</Badge>
                    <Badge className={
                      review.severity === 'Critical' ? 'bg-destructive text-destructive-foreground' :
                      review.severity === 'High' ? 'bg-orange-500 text-white' :
                      review.severity === 'Medium' ? 'bg-yellow-500 text-white' :
                      'bg-muted text-muted-foreground'
                    }>{review.severity}</Badge>
                    {review.status === 'Fixed' && <Badge className="bg-emerald-500 text-white"><CheckCircle2 className="mr-1 h-3 w-3"/> Fixed</Badge>}
                  </div>
                  <CardTitle className="text-xl">{review.title}</CardTitle>
                  <CardDescription className="font-mono mt-1 text-primary">{review.file_path}</CardDescription>
                </div>
                {review.status !== 'Fixed' && (
                  <Button variant="outline" size="sm" onClick={() => handleMarkFixed(review.id)}>
                    Mark Fixed
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">{review.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Recommendation</h4>
                  <p className="text-sm text-emerald-500/90">{review.recommendation}</p>
                </div>
                {review.suggested_fix && (
                  <div className="mt-4 p-4 rounded-md bg-muted/30 border border-border/50">
                    <h4 className="font-semibold text-sm mb-2 text-primary">Suggested Fix</h4>
                    <pre className="text-xs font-mono whitespace-pre-wrap">{review.suggested_fix}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
