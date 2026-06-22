"use client";

import Link from "next/link";
import { Bookmark, GitCompare, SearchCheck } from "lucide-react";
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
    <article className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
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

      <p className="text-sm leading-6 text-slate-700">{company.recommendationReason}</p>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <Metric label="工作方式" value={company.remoteAvailable ? "远程/混合" : "到岗为主"} />
        <Metric label="平均加班" value={`${company.overtimeHours}小时/月`} />
        <Metric label="日语要求" value={company.japaneseLevel} />
        <Metric label="签证支持" value={company.visaSupport ? "可期待" : "需确认"} />
        <Metric label="工资区间" value={company.salaryRange} />
        <Metric label="外国人友好" value={`${company.foreignerFriendlyScore}/10`} />
      </div>

      <div className="grid gap-2">
        <ScoreBar label="工作生活平衡" value={company.scoreBreakdown.workLifeBalance} />
        <ScoreBar label="外国人适配" value={company.scoreBreakdown.foreignerFriendliness} />
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
          className="inline-flex h-10 items-center justify-center gap-1 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={compareDisabled}
          onClick={onCompare}
          title="加入企业对比"
        >
          <GitCompare size={16} />
          {compareSelected ? "取消" : "对比"}
        </button>
        <button
          className="inline-flex h-10 items-center justify-center gap-1 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700"
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-2">
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="mt-1 line-clamp-2 font-semibold text-slate-900">{value}</div>
    </div>
  );
}
