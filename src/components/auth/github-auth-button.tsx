"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GitBranch, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface GithubAuthButtonProps {
  label?: string;
}

export function GithubAuthButton({ label = "Continue with GitHub" }: GithubAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: "repo read:user",
        },
      });
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full h-11 relative"
      onClick={handleGithubLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-5 w-5 absolute left-4 animate-spin" />
      ) : (
        <GitBranch className="mr-2 h-5 w-5 absolute left-4" />
      )}
      {label}
    </Button>
  );
}
