import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { DisputeForm } from "@/components/site/dispute-form";
import { getPublicFormOptions } from "@/lib/data-service";

export const metadata = { title: "记录指正" };

export default async function DisputePage() {
  const { characters, stages } = await getPublicFormOptions();

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Card>
        <CardTitle className="text-2xl">记录指正</CardTitle>
        <CardDescription className="mt-2">
          如果你对某条已公开的通关记录有疑义（如视频金数错误、链接失效、角色搭配有争议等），可以在这里提交指正。
        </CardDescription>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-white/70">
          <li>· 请选择你要指正的 <span className="font-semibold text-cyan-200">主C + 王棋期数</span> 组合。</li>
          <li>· 指正原因需清晰说明问题，字数上限 500 字。</li>
          <li>· 管理员收到后会核实处理，必要时会更新或下架对应记录。</li>
        </ul>
      </Card>

      <Card>
        <DisputeForm
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
