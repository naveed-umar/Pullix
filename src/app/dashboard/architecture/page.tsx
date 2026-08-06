import { ArchitectureGraph } from "@/components/features/architecture-graph";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function ArchitecturePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let graphData = null;
  
  if (user) {
    const { data: analysis } = await supabase
      .from('ai_analyses')
      .select('result')
      .eq('user_id', user.id)
      .eq('analysis_type', 'architecture_graph')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (analysis) {
      graphData = analysis.result;
    }
  }

  return (
    <div className="flex flex-col gap-8 h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Architecture</h1>
          <p className="text-muted-foreground mt-1">Interactive dependency graph generated via static analysis.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ArchitectureGraph initialData={graphData} />
      </div>
    </div>
  );
}
