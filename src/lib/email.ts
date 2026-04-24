import { hasEmailEnv } from "@/lib/env";

interface SubmissionMailPayload {
  characterName: string;
  stageVersionLabel: string;
  stageBossName: string;
  goldCost: number;
  videoUrl: string;
  reviewUrl: string;
}

/**
 * Send an admin notification email when a guest submits a new record.
 * Fails silently (logs only) so a flaky mail provider never blocks a submission.
 */
export async function notifyAdminOfGuestSubmission(payload: SubmissionMailPayload) {
  if (!hasEmailEnv()) {
    console.warn("[email] RESEND_API_KEY or ADMIN_EMAIL not configured, skipping notification.");
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL || "HKSR Arbitration <onboarding@resend.dev>";
  const to = process.env.ADMIN_EMAIL!;

  const subject = `[HKSR 0T] 新游客投稿：${payload.characterName} · Ver.${payload.stageVersionLabel}`;
  const html = `
    <div style="font-family: -apple-system, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color: #0b5cad;">收到一条新的游客投稿</h2>
      <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
        <tr><td style="padding: 8px; background: #f3f6fa;"><strong>主C</strong></td><td style="padding: 8px;">${escapeHtml(payload.characterName)}</td></tr>
        <tr><td style="padding: 8px; background: #f3f6fa;"><strong>王棋期数</strong></td><td style="padding: 8px;">Ver.${escapeHtml(payload.stageVersionLabel)} · ${escapeHtml(payload.stageBossName)}</td></tr>
        <tr><td style="padding: 8px; background: #f3f6fa;"><strong>金数</strong></td><td style="padding: 8px;">${payload.goldCost}</td></tr>
        <tr><td style="padding: 8px; background: #f3f6fa;"><strong>视频链接</strong></td><td style="padding: 8px;"><a href="${encodeURI(payload.videoUrl)}">${escapeHtml(payload.videoUrl)}</a></td></tr>
      </table>
      <p>请到<a href="${encodeURI(payload.reviewUrl)}">管理后台</a>审批。</p>
    </div>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error(`[email] Resend API failed (${response.status}): ${text}`);
    }
  } catch (cause) {
    console.error("[email] Failed to send notification:", cause);
  }
}

interface DisputeMailPayload {
  characterName: string;
  stageVersionLabel: string;
  stageBossName: string;
  reason: string;
  reviewUrl: string;
}

/**
 * Send an admin notification email when a guest submits a new dispute (指正).
 * Fails silently (logs only) so a flaky mail provider never blocks a submission.
 */
export async function notifyAdminOfGuestDispute(payload: DisputeMailPayload) {
  if (!hasEmailEnv()) {
    console.warn("[email] RESEND_API_KEY or ADMIN_EMAIL not configured, skipping dispute notification.");
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL || "HKSR Arbitration <onboarding@resend.dev>";
  const to = process.env.ADMIN_EMAIL!;

  const subject = `[HKSR 0T] 新指正：${payload.characterName} · Ver.${payload.stageVersionLabel}`;
  const html = `
    <div style="font-family: -apple-system, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color: #b8540b;">收到一条新的记录指正</h2>
      <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
        <tr><td style="padding: 8px; background: #f3f6fa;"><strong>主C</strong></td><td style="padding: 8px;">${escapeHtml(payload.characterName)}</td></tr>
        <tr><td style="padding: 8px; background: #f3f6fa;"><strong>王棋期数</strong></td><td style="padding: 8px;">Ver.${escapeHtml(payload.stageVersionLabel)} · ${escapeHtml(payload.stageBossName)}</td></tr>
        <tr><td style="padding: 8px; background: #f3f6fa; vertical-align: top;"><strong>指正原因</strong></td><td style="padding: 8px; white-space: pre-wrap;">${escapeHtml(payload.reason)}</td></tr>
      </table>
      <p>请到<a href="${encodeURI(payload.reviewUrl)}">管理后台</a>处理。</p>
    </div>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error(`[email] Resend API failed (${response.status}): ${text}`);
    }
  } catch (cause) {
    console.error("[email] Failed to send dispute notification:", cause);
  }
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
