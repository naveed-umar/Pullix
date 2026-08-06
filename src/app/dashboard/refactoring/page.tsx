import { RefactoringMetric } from "@/components/features/refactoring-metric";
import { Layers, Scissors, FolderTree, Copy, Zap } from "lucide-react";
import { AIRefactorCard } from "@/components/features/ai-refactor-card";

export default function RefactoringPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Refactoring Suggestions</h1>
        <p className="text-muted-foreground mt-1">AI-driven opportunities to improve code maintainability and structure.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        <RefactoringMetric
          title="Components"
          value="12"
          icon={<Layers className="h-4 w-4 text-muted-foreground" />}
          details={[
            "src/components/UserList.tsx",
            "src/components/AdminPanel.tsx",
            "src/components/Dashboard.tsx",
            "src/components/Sidebar.tsx",
            "src/components/Navbar.tsx",
            "src/components/ProfileDropdown.tsx",
            "src/components/BillingCard.tsx",
            "src/components/InvoiceList.tsx",
            "src/components/SettingsForm.tsx",
            "src/components/NotificationSettings.tsx",
            "src/components/ApiKeyManager.tsx",
            "src/components/WebhooksList.tsx"
          ]}
        />
        <RefactoringMetric
          title="Split Functions"
          value="8"
          icon={<Scissors className="h-4 w-4 text-muted-foreground" />}
          details={[
            "calculateMonthlyInvoice() in src/services/billing.ts",
            "handleWebhook() in src/app/api/webhook/route.ts",
            "processUserData() in src/lib/user.ts",
            "generateReport() in src/lib/analytics.ts",
            "syncDatabase() in src/services/sync.ts",
            "validatePayment() in src/lib/payment.ts",
            "sendEmailNotification() in src/services/email.ts",
            "updateUserPreferences() in src/app/api/user/route.ts"
          ]}
        />
        <RefactoringMetric
          title="Folder Structure"
          value="3"
          icon={<FolderTree className="h-4 w-4 text-muted-foreground" />}
          details={[
            "src/components/* - Group by feature domain (e.g., auth/, billing/, ui/)",
            "src/lib/* - Separate database utilities from formatting logic",
            "src/services/* - Migrate to app router server actions where possible"
          ]}
        />
        <RefactoringMetric
          title="Duplicate Logic"
          value="5"
          icon={<Copy className="h-4 w-4 text-muted-foreground" />}
          details={[
            "Pagination logic duplicated in UserList, AdminPanel, Dashboard",
            "Error toast handling duplicated across 14 components",
            "Supabase client initialization duplicated in 5 actions",
            "User avatar rendering duplicated in Sidebar and Navbar",
            "Date formatting logic duplicated in InvoiceList and WebhooksList"
          ]}
        />
        <RefactoringMetric
          title="Code Smells"
          value="14"
          icon={<Zap className="h-4 w-4 text-muted-foreground" />}
          details={[
            "src/services/billing.ts (Line 142) - High cyclomatic complexity",
            "src/components/Dashboard.tsx (Line 25) - Too many dependencies in useEffect",
            "src/lib/analytics.ts (Line 89) - Magic string 'v2_beta_launch'",
            "src/app/api/webhook/route.ts (Line 15) - Unnecessary async wrapper",
            "+ 10 other minor issues"
          ]}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AIRefactorCard
          title="Duplicate Logic Detected"
          description="Found identical logic in 3 different files."
          icon={<Copy className="h-5 w-5 text-primary" />}
          files={["src/components/UserList.tsx", "src/components/AdminPanel.tsx", "src/components/Dashboard.tsx"]}
          issueDescription={
            <>
              The data fetching and pagination logic is duplicated across these components. Consider creating a reusable <code>usePagination</code> hook.
            </>
          }
        />

        <AIRefactorCard
          title="Complex Function"
          description="Function exceeds recommended complexity score."
          icon={<Scissors className="h-5 w-5 text-primary" />}
          files={["src/services/billing.ts (Line 142)"]}
          issueDescription={
            <>
              <code>calculateMonthlyInvoice</code> handles tax calculation, discount application, and PDF generation. Split this into separate single-responsibility functions.
            </>
          }
        />

        <AIRefactorCard
          title="Extract Component"
          description="Opportunity to create a reusable UI component."
          icon={<Layers className="h-5 w-5 text-primary" />}
          files={["src/app/settings/page.tsx"]}
          issueDescription={
            <>
              The layout for the "Notification Preferences" block is quite large. Extract it into a <code>NotificationSettingsCard</code> component to improve readability of the main page.
            </>
          }
        />

        <AIRefactorCard
          title="Folder Structure"
          description="Architectural improvement."
          icon={<FolderTree className="h-5 w-5 text-primary" />}
          files={["src/components/*"]}
          issueDescription={
            <>
              You have 45 files in the root components directory. Consider grouping them by feature domain (e.g., <code>auth/</code>, <code>billing/</code>, <code>ui/</code>).
            </>
          }
        />
      </div>
    </div>
  );
}
