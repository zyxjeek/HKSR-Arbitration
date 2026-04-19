"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBrowserSupabaseClient } from "@/lib/supabase-browser";

export function LoginForm({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!enabled) {
      setError("请先配置 Supabase 环境变量，再启用管理员登录。");
      return;
    }

    startTransition(async () => {
      const supabase = getBrowserSupabaseClient();

      if (!supabase) {
        setError("Supabase 浏览器客户端初始化失败。");
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push("/admin");
      router.refresh();
    });
  }

  return (
    <Card className="mx-auto w-full max-w-lg">
      <div className="space-y-2">
        <CardTitle className="text-2xl">管理员登录</CardTitle>
        <CardDescription>
          使用 Supabase Auth 的邮箱和密码登录。首版默认仅维护单管理员账号。
        </CardDescription>
      </div>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email">邮箱</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">密码</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="请输入密码"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error ? (
          <div className="flex items-start gap-2 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-100">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}
        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
          登录后台
        </Button>
      </form>
    </Card>
  );
}
