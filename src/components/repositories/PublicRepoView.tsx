"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PublicRepoViewProps {
  onConnect: (url: string) => void;
  isConnecting: boolean;
}

export function PublicRepoView({ onConnect, isConnecting }: PublicRepoViewProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      onConnect(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-6 py-6 border-t border-border/50 bg-muted/10 space-y-4">
      <div className="flex items-center gap-4 before:h-px before:flex-1 before:bg-border/50 after:h-px after:flex-1 after:bg-border/50">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">OR</span>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="public-repo-url" className="text-sm font-medium">Analyze Public Repository</Label>
        <div className="flex gap-2">
          <Input
            id="public-repo-url"
            placeholder="https://github.com/username/repo"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isConnecting}
            className="flex-1 bg-background"
            required
          />
          <Button type="submit" variant="secondary" disabled={isConnecting || !url}>
            {isConnecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Analyze
          </Button>
        </div>
      </div>
    </form>
  );
}
