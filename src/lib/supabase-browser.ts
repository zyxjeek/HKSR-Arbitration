import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { hasPublicSupabaseEnv } from "@/lib/env";

type SupabaseClientLike = ReturnType<typeof createClient>;

let browserClient: SupabaseClientLike | null = null;

export function getBrowserSupabaseClient() {
  if (!hasPublicSupabaseEnv()) {
    return null;
  }

  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }

  return browserClient;
}
