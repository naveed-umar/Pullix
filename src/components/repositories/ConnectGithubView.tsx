"use client";

import { Button } from "@/components/ui/button";
import { GitBranch, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export function ConnectGithubView() {
  const [isConnecting, setIsConnecting] = useState(false);
  const supabase = createClient();

  const handleConnectGithub = async () => {
    setIsConnecting(true);
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/repositories`,
        scopes: "repo read:user",
        queryParams: {
          prompt: 'consent',
        }
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
      <div className="bg-muted p-4 rounded-full">
        <GitBranch className="w-10 h-10 text-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Connect GitHub</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Connect your GitHub account to securely browse and analyze your private and public repositories.
        </p>
      </div>
      <Button onClick={handleConnectGithub} disabled={isConnecting} className="w-full max-w-xs">
        {isConnecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GitBranch className="mr-2 h-4 w-4" />}
        Connect GitHub
      </Button>
    </div>
  );
}
