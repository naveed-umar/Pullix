"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Lock, Globe, Loader2, GitBranch } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  description: string;
  language: string;
  updated_at: string;
  default_branch: string;
  owner: {
    login: string;
  };
}

interface RepositoryPickerViewProps {
  onConnect: (repo: GithubRepo) => void;
  isConnecting: boolean;
  onUnauthorized?: () => void;
}

export function RepositoryPickerView({ onConnect, isConnecting, onUnauthorized }: RepositoryPickerViewProps) {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRepos() {
      try {
        const res = await fetch('/api/github/repos');
        if (res.status === 401) {
          if (onUnauthorized) onUnauthorized();
          return;
        }
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to fetch repositories');
        }
        const data = await res.json();
        
        if (!Array.isArray(data)) {
          console.error("Invalid GitHub data:", data);
          throw new Error('Invalid response from GitHub. Please try again.');
        }
        
        setRepos(data);
      } catch (err: any) {
        console.error("Repo fetch error:", err);
        setError(err.message || 'Could not load repositories. Please reconnect GitHub.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchRepos();
  }, []);

  const filteredRepos = repos.filter(repo => 
    repo.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full max-h-[60vh]">
      <div className="px-6 py-4 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search repositories..."
            className="pl-9 bg-muted/50 border-0 focus-visible:ring-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-muted/30 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 text-destructive text-sm">{error}</div>
        ) : filteredRepos.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground text-sm">
            No repositories found.
          </div>
        ) : (
          filteredRepos.map(repo => (
            <div key={repo.id} className="group flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-muted/50 transition-colors">
              <div className="flex flex-col gap-2 overflow-hidden pr-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base truncate">{repo.name}</span>
                  <Badge variant="secondary" className="text-[10px] uppercase font-semibold h-5 px-1.5 flex items-center gap-1">
                    {repo.private ? <Lock className="h-2.5 w-2.5" /> : <Globe className="h-2.5 w-2.5" />}
                    {repo.private ? "Private" : "Public"}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground truncate">
                  <span>{repo.owner.login}</span>
                  {repo.language && (
                    <>
                      <span>•</span>
                      <span>{repo.language}</span>
                    </>
                  )}
                  <span>•</span>
                  <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => onConnect(repo)}
                disabled={isConnecting}
                className="shrink-0"
              >
                {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Connect"}
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
