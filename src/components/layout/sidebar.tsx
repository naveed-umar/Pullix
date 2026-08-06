"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderGit2,
  Network,
  Wand2,
  ShieldAlert,
  CircleDollarSign,
  FileCode2,
  Wrench,
  Settings,

  Moon,
  Sun,
  GitPullRequest,
  LogOut
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { logout } from "@/app/auth/actions";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Repositories", href: "/dashboard/repositories", icon: FolderGit2 },
  { name: "Architecture", href: "/dashboard/architecture", icon: Network },
  { name: "AI Reviews", href: "/dashboard/ai-review", icon: Wand2 },
  { name: "PR Reviews", href: "/dashboard/pr-review", icon: GitPullRequest },
  { name: "Security", href: "/dashboard/security", icon: ShieldAlert },
  { name: "Cost Estimator", href: "/dashboard/cost-estimator", icon: CircleDollarSign },
  { name: "Code Explain", href: "/dashboard/code-explain", icon: FileCode2 },
  { name: "Refactoring", href: "/dashboard/refactoring", icon: Wrench },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ userEmail, userName, userAvatar }: { userEmail?: string, userName?: string, userAvatar?: string }) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      setIsDark(true);
    }
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      {/* Logo Area */}
      <div className="flex h-16 items-center px-6 border-b border-border/50">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wand2 className="h-5 w-5" />
          </div>
          PulliX
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Bottom Area */}
      <div className="border-t border-border/50 p-4 space-y-4">


        {/* User Profile */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden mr-2">
            <Avatar className="h-8 w-8">
              {userAvatar && <AvatarImage src={userAvatar} alt={userName || "User avatar"} />}
              <AvatarFallback>{userName?.substring(0, 2).toUpperCase() || "US"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium leading-none truncate">{userName || "User"}</span>
              <span className="text-xs text-muted-foreground truncate" title={userEmail}>{userEmail}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={toggleTheme} className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors" title="Toggle Theme">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <form action={logout}>
              <button type="submit" className="p-2 text-muted-foreground hover:text-destructive rounded-md hover:bg-muted transition-colors" title="Log out">
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
