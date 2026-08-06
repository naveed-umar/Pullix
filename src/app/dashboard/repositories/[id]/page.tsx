import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Code2, ShieldAlert } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { ScanControls } from "@/components/repositories/ScanControls";

export default async function RepositoryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  
  const { data: repo, error } = await supabase
    .from('repositories')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  const { data: aiAnalyses } = await supabase
    .from('ai_analyses')
    .select('*')
    .eq('repository_id', resolvedParams.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const { data: securityFindings } = await supabase
    .from('security_findings')
    .select('*')
    .eq('repository_id', resolvedParams.id);

  const aiData = aiAnalyses?.result || null;
  const issuesCount = securityFindings?.length || 0;

  if (error || !repo) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-center">
        <h2 className="text-2xl font-bold mb-2">Repository Not Found</h2>
        <p className="text-muted-foreground">The repository you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{repo.name}</h1>
            <Badge variant={repo.is_private ? "secondary" : "outline"}>
              {repo.is_private ? "Private" : "Public"}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{repo.language}</span>
            <span>•</span>
            <span>{repo.owner}</span>
            <span>•</span>
            <span>Added {new Date(repo.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <ScanControls repositoryId={repo.id} />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none p-0 h-auto">
          {["Overview", "Architecture", "Security", "Reviews", "Pull Requests", "Settings"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab.toLowerCase()}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 font-medium"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Health Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${aiData ? (aiData.health_score > 80 ? 'text-emerald-500' : 'text-yellow-500') : 'text-muted-foreground'}`}>
                  {aiData ? `${aiData.health_score}/100` : '--'}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium text-muted-foreground line-clamp-2" title={aiData?.architecture_summary}>
                  {aiData ? aiData.architecture_summary : '--'}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Security Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${issuesCount > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {aiData ? issuesCount : '--'}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Dependencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-muted-foreground">
                  {aiData ? aiData.total_dependencies : '--'}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Security Findings</CardTitle>
                <CardDescription>{aiData ? `Found ${issuesCount} issues during last scan.` : 'Awaiting first scan.'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {issuesCount > 0 ? (
                  securityFindings?.slice(0, 3).map((finding: any) => (
                    <div key={finding.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-background/50">
                      <ShieldAlert className={`h-5 w-5 ${finding.severity === 'Critical' ? 'text-destructive' : 'text-orange-500'}`} />
                      <div>
                        <p className="text-sm font-medium">{finding.category}</p>
                        <p className="text-xs text-muted-foreground">{finding.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                    {aiData ? 'No security issues found!' : 'Run a scan to view security status.'}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {["architecture", "security", "reviews", "pull requests", "settings"].map(tab => (
          <TabsContent key={tab} value={tab.replace(" ", "")}>
            <Card className="bg-card/50 border-border/50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Code2 className="h-8 w-8 mb-4 opacity-20" />
                <p>This section is available in the dedicated side-menu items for a deeper dive.</p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
