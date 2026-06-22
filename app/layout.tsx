import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "日本求职职业决策平台",
  description: "面向外国人的日本企业研究、职业规划、工签评估、能力差距分析、求职准备和投递管理工作台。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
          <nav className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-8">
            <Link href="/" className="font-semibold text-slate-950">
              日本求职决策库
            </Link>
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-600">
              {[
                ["工作台", "/dashboard"],
                ["找企业", "/companies"],
                ["适合度测试", "/profile-test"],
                ["职业路线", "/career-path"],
                ["企业对比", "/compare"],
                ["收藏", "/favorites"],
                ["地图", "/map"],
              ].map(([label, href]) => (
                <Link key={href} href={href} className="rounded-md px-3 py-2 hover:bg-slate-100 hover:text-slate-950">
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
