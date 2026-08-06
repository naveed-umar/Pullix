"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Star, GitBranch, Clock } from "lucide-react";
import Link from "next/link";
import { ConnectRepoModal } from "@/components/repositories/ConnectRepoModal";

export default function RepositoriesPage() {
  const [repos, setRepos] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchRepos = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('repositories').select('*').order('created_at', { ascending: false });
      if (data) {
        const formatted = data.map(repo => ({
          id: repo.id,
          name: repo.name,
          language: repo.language || "Unknown",
          framework: "Unknown",
          status: "Healthy",
          healthScore: 100,
          issues: 0,
          stars: 0,
          lastScan: "Just now"
        }));
        setRepos(formatted);
      }
    };
    fetchRepos();
  }, []);

  const handleRepoAdded = (repo: any) => {
    // Check if repo already exists to prevent dupes locally
    if (!repos.find(r => r.id === repo.id)) {
      setRepos([repo, ...repos]);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
          <p className="text-muted-foreground mt-1">Manage and scan your connected codebases.</p>
        </div>
        <ConnectRepoModal onRepoAdded={handleRepoAdded} />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search repositories..."
            className="w-full bg-background pl-9 h-9"
          />
        </div>
        <Button variant="outline" size="sm" className="h-9">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>

      {/* Repositories Grid */}
      {repos.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => (
            <Link key={repo.id} href={`/dashboard/repositories/${repo.id}`}>
              <div className="group flex flex-col justify-between h-full p-5 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-muted/50 hover:border-border transition-all cursor-pointer">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg leading-none group-hover:text-primary transition-colors">
                        {repo.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><GitBranch className="h-3 w-3" /> main</span>
                        <span>•</span>
                        <span>{repo.language}</span>
                      </div>
                    </div>
                    <Badge variant={repo.status === "Healthy" ? "default" : repo.status === "Warning" ? "secondary" : "destructive"}>
                      {repo.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">Health Score</span>
                      <span className="font-medium text-lg">{repo.healthScore}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">Active Issues</span>
                      <span className="font-medium text-lg">{repo.issues}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {repo.stars.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last scanned {repo.lastScan}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card/50 backdrop-blur-sm">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No repositories found</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">We couldn't find any repositories matching your criteria. Try adjusting your filters or connect a new repository.</p>
          <Button className="mt-6" variant="outline">Clear Filters</Button>
        </div>
      )}
    </div>
  );
}
