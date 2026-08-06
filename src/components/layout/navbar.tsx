"use client";

import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Navbar({ userName }: { userName?: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Search */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search repositories, issues, or code..."
            className="w-full bg-muted/50 pl-9 border-none focus-visible:ring-1 focus-visible:ring-primary h-9"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Repository Selector */}
        <button className="hidden md:flex items-center gap-2 rounded-md border border-border/50 bg-muted/20 px-3 py-1.5 text-sm font-medium hover:bg-muted/50 transition-colors">
          <span className="text-muted-foreground">Repo:</span>
          <span>{userName ? `${userName}/pullix` : 'pullix/pullix'}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground ml-1" />
        </button>
      </div>
    </header>
  );
}
