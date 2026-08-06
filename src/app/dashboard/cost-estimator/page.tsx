import { MetricCard } from "@/components/shared/metric-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CostChart } from "@/components/features/cost-chart";
import { Cloud, Database, Server, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CostEstimatorPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cost Estimator</h1>
          <p className="text-muted-foreground mt-1">Cloud infrastructure cost analysis based on repository architectures.</p>
        </div>
        <Button>Generate Report</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="AWS Estimated"
          value={`$0`}
          icon={Cloud}
          trend={{ value: 0, label: "no data", positive: false }}
        />
        <MetricCard
          title="Azure Estimated"
          value={`$0`}
          icon={Server}
          trend={{ value: 0, label: "no data", positive: true }}
        />
        <MetricCard
          title="GCP Estimated"
          value={`$0`}
          icon={HardDrive}
          trend={{ value: 0, label: "no data", positive: false }}
        />
        <MetricCard
          title="Supabase Estimated"
          value={`$0`}
          icon={Database}
          trend={{ value: 0, label: "no data", positive: true }}
        />
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Cost Breakdown Comparison</CardTitle>
          <CardDescription>Monthly estimated costs grouped by service category across major providers.</CardDescription>
        </CardHeader>
        <CardContent>
          <CostChart />
        </CardContent>
      </Card>
    </div>
  );
}
