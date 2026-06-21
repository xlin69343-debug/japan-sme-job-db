import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "日本全行业中小企业求职数据库",
  description: "面向外国人求职者的日本中小企业浏览、搜索、筛选、对比网站。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

