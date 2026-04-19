import { LoginForm } from "@/components/admin/login-form";
import { SectionShell } from "@/components/site/section-shell";
import { hasPublicSupabaseEnv } from "@/lib/env";

export default function AdminLoginPage() {
  return (
    <SectionShell
      eyebrow="Admin Access"
      title="管理后台登录"
      description="配置好 Supabase 后，即可使用邮箱密码进入后台维护站点内容。"
    >
      <LoginForm enabled={hasPublicSupabaseEnv()} />
    </SectionShell>
  );
}
