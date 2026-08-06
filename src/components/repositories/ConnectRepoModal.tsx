"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ConnectGithubView } from "./ConnectGithubView";
import { RepositoryPickerView } from "./RepositoryPickerView";
import { PublicRepoView } from "./PublicRepoView";
import { saveRepository } from "@/app/dashboard/actions/repositories";

export function ConnectRepoModal({ onRepoAdded }: { onRepoAdded: (repo: any) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGithubConnected, setIsGithubConnected] = useState<boolean | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsGithubConnected(null);
      // Ping the GitHub repos API route. If 401, GitHub is not connected or token expired.
      fetch('/api/github/repos')
        .then(res => {
          if (res.ok) setIsGithubConnected(true);
          else setIsGithubConnected(false);
        })
        .catch(() => setIsGithubConnected(false));
    }
  }, [isOpen]);

  const handleConnectGithubRepo = async (repo: any) => {
    setIsConnecting(true);
    try {
      const savedRepo = await saveRepository(repo);
      
      const formattedRepo = {
        id: savedRepo.id,
        name: savedRepo.name,
        language: savedRepo.language || "Unknown",
        framework: "React", // Defaulting for MVP
        status: "Healthy",
        healthScore: 100,
        issues: 0,
        stars: repo.stargazers_count || 0,
        lastScan: "Just now",
      };
      
      onRepoAdded(formattedRepo);
      setIsOpen(false);
    } catch (error: any) {
      console.error("Failed to save repo:", error);
      alert("Failed to connect repository. Please ensure you have created the 'repositories' table in Supabase. Error: " + error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectPublicRepo = async (url: string) => {
    setIsConnecting(true);
    // TODO: Actually save this to Supabase `repositories` table via Server Action
    await new Promise(r => setTimeout(r, 1000));
    
    const repoName = url.replace(/\/$/, '').split("/").pop() || "public-repo";
    const newRepo = {
      id: Math.random().toString(36).substr(2, 9),
      name: repoName,
      language: "Unknown",
      framework: "Unknown",
      status: "Healthy",
      healthScore: 100,
      issues: 0,
      stars: 0,
      lastScan: "Just now",
    };
    onRepoAdded(newRepo);
    setIsConnecting(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className={buttonVariants({ variant: "default" })}>
        <Plus className="mr-2 h-4 w-4" /> Connect Repository
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden bg-card border-border/50">
        <DialogHeader className="px-6 py-4 border-b border-border/50 bg-muted/20">
          <DialogTitle>Connect Repository</DialogTitle>
        </DialogHeader>
        
        {isGithubConnected === null ? (
          <div className="p-12 flex justify-center items-center">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isGithubConnected ? (
          <RepositoryPickerView 
            onConnect={handleConnectGithubRepo} 
            isConnecting={isConnecting}
            onUnauthorized={() => setIsGithubConnected(false)}
          />
        ) : (
          <ConnectGithubView />
        )}

        <PublicRepoView onConnect={handleConnectPublicRepo} isConnecting={isConnecting} />
      </DialogContent>
    </Dialog>
  );
}
