import { SectionShell } from "@/components/site/section-shell";
import { Card } from "@/components/ui/card";
import { disclaimerFull } from "@/lib/constants";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <SectionShell
        eyebrow="About"
        title="项目说明"
        description="统计口径、项目边界与免责声明都集中在这里，便于后续维护。"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-white/4">
            <h2 className="mb-4 text-xl font-semibold text-white">统计口径</h2>
            <ul className="space-y-3 text-sm leading-7 text-white/72">
              <li>方式一：选择某一期王棋，按主C聚合并展示最低金数条形图。</li>
              <li>方式二：选择某个主C，展示其跨不同期王棋的最低金折线图。</li>
              <li>首页角色榜单按“每期最低金数的平均值”排序，不把更高金重复记录计入平均。</li>
              <li>同一角色同一期若存在多条同最低金视频，详情弹窗会全部展示。</li>
            </ul>
          </Card>
          <Card className="bg-white/4">
            <h2 className="mb-4 text-xl font-semibold text-white">项目边界</h2>
            <ul className="space-y-3 text-sm leading-7 text-white/72">
              <li>首版仅收录管理员维护的数据，不开放用户投稿、评论与点赞。</li>
              <li>视频仅保存外链，不在站内托管媒体文件。</li>
              <li>一条王棋期数当前只记录一个敌方名称；未来如需多怪组合，再扩展结构。</li>
            </ul>
          </Card>
        </div>
      </SectionShell>

      <SectionShell eyebrow="Disclaimer" title="完整免责声明">
        <Card className="bg-white/4">
          <div className="prose-notice">{disclaimerFull}</div>
        </Card>
      </SectionShell>
    </div>
  );
}
