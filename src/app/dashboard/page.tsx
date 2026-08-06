import { MetricCard } from "@/components/shared/metric-card";
import { Activity, GitBranch, ShieldAlert, Zap, ArrowRight, Network, Wand2, GitPullRequest, CircleDollarSign, FileCode2, Wrench, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your engineering health and metrics.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Security Score"
          value="A-"
          icon={ShieldAlert}
          trend={{ value: 2, label: "from last week", positive: true }}
        />
        <MetricCard
          title="Architecture Health"
          value="84/100"
          icon={Activity}
          trend={{ value: 5, label: "from last week", positive: true }}
        />
        <MetricCard
          title="Deployment Risk"
          value="Low"
          icon={Zap}
          className="border-emerald-500/20 bg-emerald-500/5"
        />
        <MetricCard
          title="Recent Scans"
          value="1,248"
          icon={GitBranch}
          trend={{ value: 12, label: "from yesterday", positive: true }}
        />
      </div>

      {/* Available Features Grid */}
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">Available Features</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          
          <FeatureOverviewCard 
            title="Architecture" 
            description="Interactive dependency graph of your application." 
            icon={Network} 
            href="/dashboard/architecture" 
          />
          <FeatureOverviewCard 
            title="AI Code Review" 
            description="Automated AI reviews for your entire codebase." 
            icon={Wand2} 
            href="/dashboard/ai-review" 
          />
          <FeatureOverviewCard 
            title="PR Reviews" 
            description="Automated pull request analysis and feedback." 
            icon={GitPullRequest} 
            href="/dashboard/pr-review" 
          />
          <FeatureOverviewCard 
            title="Security" 
            description="Vulnerability scanning and risk assessment." 
            icon={ShieldAlert} 
            href="/dashboard/security" 
          />
          <FeatureOverviewCard 
            title="Cost Estimator" 
            description="Predict cloud costs based on architecture." 
            icon={CircleDollarSign} 
            href="/dashboard/cost-estimator" 
          />
          <FeatureOverviewCard 
            title="Code Explain" 
            description="AI-generated explanations for complex code." 
            icon={FileCode2} 
            href="/dashboard/code-explain" 
          />
          <FeatureOverviewCard 
            title="Refactoring" 
            description="AI suggestions for refactoring legacy code." 
            icon={Wrench} 
            href="/dashboard/refactoring" 
          />
          <FeatureOverviewCard 
            title="Settings" 
            description="Manage your account and preferences." 
            icon={Settings} 
            href="/dashboard/settings" 
          />

        </div>
      </div>
    </div>
  );
}

function FeatureOverviewCard({ title, description, icon: Icon, href }: { title: string, description: string, icon: any, href: string }) {
  return (
    <Link href={href}>
      <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:bg-muted/50 transition-colors cursor-pointer group">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Icon className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm mt-1">{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
