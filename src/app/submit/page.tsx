import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SubmissionForm } from "@/components/site/submission-form";
import { getPublicFormOptions } from "@/lib/data-service";

export const metadata = { title: "游客投稿" };

export default async function SubmitPage() {
  const { characters, stages } = await getPublicFormOptions();

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Card>
        <CardTitle className="text-2xl">游客投稿</CardTitle>
        <CardDescription className="mt-2">
          欢迎提交 0T 通关记录。提交后进入待审批队列，管理员审核通过后会显示到公开榜单。
        </CardDescription>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-white/70">
          <li>· 游客投稿的金数上限为 <span className="font-semibold text-cyan-200">20 金</span>，超过这个数值请联系管理员。</li>
          <li>· 视频链接需为公开可访问的 http/https 地址（B站、YouTube 等）。</li>
          <li>· 同角色同一期只保留最低金记录，重复提交同金数会被合并。</li>
        </ul>
      </Card>

      <Card>
        <SubmissionForm
          characters={characters.map((c) => ({ id: c.id, name: c.name }))}
          stages={stages.map((s) => ({
            id: s.id,
            versionLabel: s.versionLabel,
            bossName: s.bossName,
          }))}
        />
      </Card>
    </div>
  );
}
