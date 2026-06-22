"use client";

import Link from "next/link";
import { Bookmark, GitCompare, SearchCheck, Sparkles, TriangleAlert, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import type { Company } from "@/lib/types";
import { ScoreBar, Tag } from "./DecisionUi";

type Props = {
  company: Company;
  compareSelected?: boolean;
  compareDisabled?: boolean;
  onCompare?: () => void;
};

export function CompanyCard({ company, compareSelected = false, compareDisabled = false, onCompare }: Props) {
  const [saved, setSaved] = useState(false);
  const reasons = buildReasons(company);
  const suitable = buildSuitable(company);
  const cautions = buildCautions(company);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favoriteCompanies") || "[]") as string[];
    setSaved(favorites.includes(company.slug));
  }, [company.slug]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favoriteCompanies") || "[]") as string[];
    const next = favorites.includes(company.slug) ? favorites.filter((slug) => slug !== company.slug) : [...favorites, company.slug];
    localStorage.setItem("favoriteCompanies", JSON.stringify(next));
    setSaved(next.includes(company.slug));
  };

  return (
    <article className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={`/companies/${company.slug}`} className="text-lg font-semibold text-slate-950 hover:text-blue-700">
            {company.name}
          </Link>
          <p className="mt-1 text-sm text-slate-500">{company.industry} · {company.region} · {company.employees}</p>
        </div>
        <div className="rounded-md bg-blue-600 px-2.5 py-2 text-center text-white">
          <div className="text-[10px]">综合</div>
          <div className="text-lg font-semibold">{company.recommendationScore}</div>
        </div>
      </div>

      <div className="rounded-md bg-blue-50 p-3">
        <div className="text-xs font-semibold text-blue-700">一句话总结</div>
        <p className="mt-1 text-sm leading-6 text-slate-800">{oneLineSummary(company)}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <Metric label="工作方式" value={company.remoteAvailable ? "远程/混合" : "到岗为主"} />
        <Metric label="平均加班" value={`${company.overtimeHours}小时/月`} />
        <Metric label="日语要求" value={company.japaneseLevel} />
        <Metric label="签证支持" value={company.visaSupport ? "可期待" : "需确认"} />
        <Metric label="工资区间" value={company.salaryRange} />
        <Metric label="外国人友好" value={`${company.foreignerFriendlyScore}/10`} />
      </div>

      <div className="grid gap-3">
        <MiniList icon={<Sparkles size={15} />} title="推荐理由" items={reasons} tone="green" />
        <MiniList icon={<UserCheck size={15} />} title="适合" items={suitable} tone="blue" />
        <MiniList icon={<TriangleAlert size={15} />} title="注意" items={cautions} tone="amber" />
      </div>

      <div className="grid gap-2 rounded-md border border-slate-100 p-3">
        <ScoreBar label="工作环境" value={company.scoreBreakdown.workLifeBalance} />
        <ScoreBar label="外国人友好度" value={company.scoreBreakdown.foreignerFriendliness} />
      </div>

      <div className="flex flex-wrap gap-2">
        {company.matchTags.slice(0, 5).map((tag) => (
          <Tag key={tag} tone={tag.includes("低") || tag.includes("友好") || tag.includes("适合") ? "green" : "slate"}>{tag}</Tag>
        ))}
        {company.riskTags.slice(0, 2).map((tag) => (
          <Tag key={tag} tone="amber">{tag}</Tag>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Link href={`/companies/${company.slug}`} className="inline-flex h-10 items-center justify-center gap-1 rounded-md bg-slate-950 px-3 text-sm font-semibold text-white">
          <SearchCheck size={16} />
          详情
        </Link>
        <button
          className={`inline-flex h-10 items-center justify-center gap-1 rounded-md border px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${compareSelected ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50"}`}
          disabled={compareDisabled}
          onClick={onCompare}
          title="加入企业对比"
        >
          <GitCompare size={16} />
          {compareSelected ? "取消" : "对比"}
        </button>
        <button
          className={`inline-flex h-10 items-center justify-center gap-1 rounded-md border px-3 text-sm font-semibold transition active:scale-95 ${saved ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50"}`}
          onClick={toggleFavorite}
          title="收藏企业"
        >
          <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
          {saved ? "已藏" : "收藏"}
        </button>
      </div>
    </article>
  );
}

function oneLineSummary(company: Company) {
  if (company.industry.includes("IT") || company.industry.includes("AI")) return `${company.name}适合希望在日本积累技术、SaaS 或 AI 经验的求职者。`;
  if (company.industry.includes("制造")) return `${company.name}适合理工背景、想进入日本制造现场或技术岗位的人。`;
  if (company.visaSupport && company.acceptsForeigners) return `${company.name}适合需要签证支持、希望先获得日本实务经验的外国人。`;
  return `${company.name}适合想在${company.industry}积累日本中小企业经验的人。`;
}

function buildReasons(company: Company) {
  return [
    company.acceptsForeigners ? "外国人录用可能性较高" : "可作为挑战候选",
    company.visaSupport ? "工签支持可期待" : "适合先确认签证后投递",
    company.overtimeHours <= 20 ? "加班控制较好" : company.scoreBreakdown.growth >= 8 ? "成长空间较大" : "业务经验积累快",
  ].slice(0, 3);
}

function buildSuitable(company: Company) {
  return [
    company.suitableForLowJapanese ? "N3-N2可尝试" : company.japaneseLevel,
    company.suitableForNewGrad ? "新卒/第二新卒" : "经验者",
    company.suitableForCareerChange ? "转职候选" : company.hiringPositions[0],
  ];
}

function buildCautions(company: Company) {
  const risks = company.riskTags.length > 0 ? company.riskTags : ["制度需面试确认"];
  return [
    ...risks.slice(0, 2),
    company.japaneseLevel.includes("N1") ? "面试偏重日语" : "客户沟通需确认",
  ].slice(0, 3);
}

function MiniList({ icon, title, items, tone }: { icon: React.ReactNode; title: string; items: string[]; tone: "green" | "blue" | "amber" }) {
  const color = tone === "green" ? "text-emerald-700" : tone === "blue" ? "text-blue-700" : "text-amber-700";
  return (
    <div>
      <div className={`flex items-center gap-1 text-xs font-semibold ${color}`}>
        {icon}
        {title}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <Tag key={item} tone={tone}>{item}</Tag>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-2">
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="mt-1 line-clamp-2 font-semibold text-slate-900">{value}</div>
    </div>
  );
}
