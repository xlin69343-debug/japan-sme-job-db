# 日本全行业中小企业求职数据库

面向在日本求职的人, 尤其是外国人求职者的中小企业求职信息网站。

## 功能

- 首页项目介绍
- 企业搜索
- 多条件筛选
- 企业详情页
- 2-3 家企业对比
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

