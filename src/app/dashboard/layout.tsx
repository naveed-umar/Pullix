import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar 
        userEmail={user.email} 
        userName={user.user_metadata?.full_name || user.user_metadata?.name} 
        userAvatar={user.user_metadata?.avatar_url}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar userName={user.user_metadata?.preferred_username || user.user_metadata?.user_name || "user"} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
