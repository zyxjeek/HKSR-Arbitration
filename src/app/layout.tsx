import type { Metadata } from "next";
import { Noto_Sans_SC, Orbitron, Space_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { siteConfig } from "@/lib/constants";

const bodyFont = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const displayFont = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const monoFont = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hksr-arbitration.vercel.app"),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "崩坏星穹铁道",
    "异相仲裁",
    "王棋",
    "0T",
    "低金统计",
    "粉丝站",
  ],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
