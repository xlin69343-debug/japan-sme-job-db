import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "我的日本求职成长台",
  description: "围绕C语言学习、日语准备、企业研究、工签评估、能力差距和投递管理的个人成长求职网站。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
          <nav className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-8">
            <Link href="/" className="font-semibold text-slate-950">
              我的求职成长台
            </Link>
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-600">
              {[
                ["今日任务", "/"],
                ["公司分层", "/student-fit"],
                ["主线候选", "/companies"],
                ["投递记录", "/favorites"],
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
