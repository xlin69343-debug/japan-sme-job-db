# 我的日本求职成长台

这是一个围绕个人成长和日本求职决策搭建的网站。它不是招聘网站，也不是公开社区，而是用来记录 C 语言学习、日语准备、企业研究、工签评估、能力差距、候选公司和投递进度的个人求职工作台。

## 功能

- 首页个人阶段与快速入口
- 企业搜索
- 多条件筛选
- 企业详情页
- 2-3 家企业对比
- 公司适配分层
- 个人准备度与能力差距
- 收藏、笔记与投递状态管理
- 每家公司一个 JSON 数据文件
- GitHub Pages 自动部署

## 技术栈

- Next.js
- TypeScript
- Tailwind CSS
- JSON 数据源

## 本地运行

```bash
pnpm install
pnpm run dev
```

## 数据位置

```text
data/companies/*.json
```

## 发布

推送到 `main` 分支后, GitHub Actions 会自动构建并发布到 GitHub Pages。
