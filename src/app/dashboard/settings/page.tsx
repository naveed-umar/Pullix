import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GitBranch, Key, Bell, User, PaintRoller, AlertTriangle, Moon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account, workspace, and integrations.</p>
      </div>

      <div className="space-y-6">
        
        {/* Profile Settings */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Profile
            </CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" defaultValue="john@acmecorp.com" disabled />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" /> Notifications
            </CardTitle>
            <CardDescription>Configure how and when you receive alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-background/50">
              <div className="space-y-1">
                <p className="font-medium">Security Alerts</p>
                <p className="text-sm text-muted-foreground">Receive emails when critical vulnerabilities are found.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-background/50">
              <div className="space-y-1">
                <p className="font-medium">Weekly Digest</p>
                <p className="text-sm text-muted-foreground">A summary of repository health and AI reviews.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-primary" /> Appearance
            </CardTitle>
            <CardDescription>Customize the look and feel of your workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-background/50">
              <div className="space-y-1">
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Toggle between dark and light themes.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* GitHub Integration */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" /> GitHub Integration
            </CardTitle>
            <CardDescription>Manage your connected GitHub accounts and permissions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-background/50">
              <div className="flex items-center gap-3">
                <GitBranch className="h-6 w-6" />
                <div>
                  <p className="font-medium">AcmeCorp GitHub</p>
                  <p className="text-sm text-muted-foreground">Connected as @johndoe</p>
                </div>
              </div>
              <Button variant="outline">Manage Access</Button>
            </div>
          </CardContent>
        </Card>


        {/* Danger Zone */}
        <Card className="border-destructive/50 bg-destructive/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" /> Danger Zone
            </CardTitle>
            <CardDescription>Irreversible and destructive actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete Workspace</p>
                <p className="text-sm text-muted-foreground">Once you delete a workspace, there is no going back.</p>
              </div>
              <Button variant="destructive">Delete Workspace</Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
