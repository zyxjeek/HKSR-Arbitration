import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { SectionShell } from "@/components/site/section-shell";
import { Card } from "@/components/ui/card";
import { getAdminBootstrapData } from "@/lib/data-service";
import { hasPublicSupabaseEnv, hasServiceSupabaseEnv } from "@/lib/env";
import { getServerSupabaseClient } from "@/lib/supabase-server";

export default async function AdminPage() {
  if (!hasPublicSupabaseEnv()) {
    return (
      <SectionShell eyebrow="Admin Setup" title="后台未启用">
        <Card className="bg-white/4 text-sm leading-7 text-white/72">
          请先配置 `NEXT_PUBLIC_SUPABASE_URL` 与 `NEXT_PUBLIC_SUPABASE_ANON_KEY`，再创建管理员账号。
        </Card>
      </SectionShell>
    );
  }

  const supabase = await getServerSupabaseClient();
  const {
    data: { session },
  } = await supabase!.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const initialData = await getAdminBootstrapData();

  return (
    <AdminDashboard initialData={initialData} mutationsEnabled={hasServiceSupabaseEnv()} />
  );
}
