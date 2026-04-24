import { NextResponse } from "next/server";
import { insertGuestDispute, parseJsonBody } from "@/lib/admin-service";
import { notifyAdminOfGuestDispute } from "@/lib/email";

/**
 * Public endpoint for guest disputes (指正). No auth required.
 * Insert into record_disputes, then (best-effort) email the admin.
 */
export async function POST(request: Request) {
  try {
    const result = await insertGuestDispute(await parseJsonBody(request));

    if (!result.ok) {
      return result.response;
    }

    const origin = new URL(request.url).origin;
    // Fire-and-forget; email failures must not block the success response.
    notifyAdminOfGuestDispute({
      characterName: result.data.characterName,
      stageVersionLabel: result.data.stageVersionLabel,
      stageBossName: result.data.stageBossName,
      reason: result.data.reason,
      reviewUrl: `${origin}/admin`,
    }).catch((cause) => console.error("[disputes] email error:", cause));

    return NextResponse.json({ ok: true });
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "提交失败。" },
      { status: 400 },
    );
  }
}
