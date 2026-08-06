import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MetricCard } from "@/components/shared/metric-card";
import { ShieldAlert, ShieldX, Shield, ShieldCheck } from "lucide-react";

export default function SecurityCenterPage() {
  const critical = 0;
  const high = 0;
  const medium = 0;
  const low = 0;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Center</h1>
        <p className="text-muted-foreground mt-1">Monitor and resolve security vulnerabilities.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Critical Risk"
          value={critical}
          icon={ShieldAlert}
          className="border-destructive/30 bg-destructive/5"
        />
        <MetricCard
          title="High Risk"
          value={high}
          icon={ShieldX}
          className="border-orange-500/30 bg-orange-500/5"
        />
        <MetricCard
          title="Medium Risk"
          value={medium}
          icon={Shield}
          className="border-yellow-500/30 bg-yellow-500/5"
        />
        <MetricCard
          title="Low Risk"
          value={low}
          icon={ShieldCheck}
          className="border-emerald-500/30 bg-emerald-500/5"
        />
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Active Vulnerabilities</CardTitle>
          <CardDescription>All identified security issues across connected repositories.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[100px]">Severity</TableHead>
                  <TableHead className="w-[150px]">Vulnerability</TableHead>
                  <TableHead className="w-[200px]">Location</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No active vulnerabilities found.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
