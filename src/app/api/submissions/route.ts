import { NextResponse } from "next/server";
import { insertGuestSubmission, parseJsonBody } from "@/lib/admin-service";
import { notifyAdminOfGuestSubmission } from "@/lib/email";

/**
 * Public endpoint for guest submissions. No auth required.
 * Insert into pending_records, then (best-effort) email the admin.
 */
export async function POST(request: Request) {
  try {
    const result = await insertGuestSubmission(await parseJsonBody(request));

    if (!result.ok) {
      return result.response;
    }

    const origin = new URL(request.url).origin;
    // Fire-and-forget; email failures must not block the success response.
    notifyAdminOfGuestSubmission({
      characterName: result.data.characterName,
      stageVersionLabel: result.data.stageVersionLabel,
      stageBossName: result.data.stageBossName,
      goldCost: result.data.goldCost,
      videoUrl: result.data.videoUrl,
      reviewUrl: `${origin}/admin`,
    }).catch((cause) => console.error("[submissions] email error:", cause));

    return NextResponse.json({ ok: true });
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "提交失败。" },
      { status: 400 },
    );
  }
}
