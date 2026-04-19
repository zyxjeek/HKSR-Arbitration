import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center py-16">
      <Card className="max-w-xl text-center">
        <CardTitle className="text-2xl">页面未找到</CardTitle>
        <CardDescription className="mt-4">
          这个页面可能还没收录，或者链接已经失效。你可以先回到首页继续浏览其他期数和角色数据。
        </CardDescription>
        <div className="mt-6">
          <Button asChild>
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
