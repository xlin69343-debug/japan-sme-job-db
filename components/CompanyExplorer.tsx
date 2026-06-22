"use client";

import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type { Company, Filters } from "@/lib/types";
import { sortCompanies } from "@/lib/recommendation";
import { CompanyCard } from "./CompanyCard";
import { EmptyState, Tag } from "./DecisionUi";

type Props = {
  companies: Company[];
  options: {
    industries: string[];
    regions: string[];
    employeeBands: string[];
    salaryBands: string[];
    japaneseLevels: string[];
    tags: string[];
  };
};

const initialFilters: Filters = {
  query: "",
  industry: "",
  region: "",
  employeeBand: "",
  salaryBand: "",
  japaneseLevel: "",
  visaSupport: "",
  acceptsForeigners: "",
  remoteAvailable: "",
  shiftWork: "",
  overtime: "",
  score: "",
  recommendation: "",
  suitableForNewGrad: "",
  suitableForCareerChange: "",
  suitableForLowJapanese: "",
  workStyle: "",
  tag: "",
  sort: "recommendation",
};

export function CompanyExplorer({ companies, options }: Props) {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [compare, setCompare] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const result = companies.filter((company) => {
      const text = [
        company.name,
        company.industry,
        company.location,
        company.region,
        company.mainBusiness,
        company.hiringPositions.join(" "),
        company.requiredSkills.join(" "),
        company.reviewSummary.keywords.join(" "),
        company.matchTags.join(" "),
        company.riskTags.join(" "),
      ].join(" ").toLowerCase();
      if (query && !text.includes(query)) return false;
      if (filters.industry && company.industry !== filters.industry) return false;
      if (filters.region && company.region !== filters.region) return false;
      if (filters.employeeBand && company.employeeBand !== filters.employeeBand) return false;
      if (filters.salaryBand && company.salaryBand !== filters.salaryBand) return false;
      if (filters.japaneseLevel && company.japaneseLevel !== filters.japaneseLevel) return false;
      if (filters.visaSupport && String(company.visaSupport) !== filters.visaSupport) return false;
      if (filters.acceptsForeigners && String(company.acceptsForeigners) !== filters.acceptsForeigners) return false;
      if (filters.remoteAvailable && String(company.remoteAvailable) !== filters.remoteAvailable) return false;
      if (filters.shiftWork && String(company.shiftWork) !== filters.shiftWork) return false;
      if (filters.suitableForNewGrad && String(company.suitableForNewGrad) !== filters.suitableForNewGrad) return false;
      if (filters.suitableForCareerChange && String(company.suitableForCareerChange) !== filters.suitableForCareerChange) return false;
      if (filters.suitableForLowJapanese && String(company.suitableForLowJapanese) !== filters.suitableForLowJapanese) return false;
      if (filters.workStyle === "remote" && !company.remoteAvailable) return false;
      if (filters.workStyle === "hybrid" && !company.hybridWork) return false;
      if (filters.workStyle === "onsite" && company.remoteAvailable) return false;
      if (filters.tag && !company.matchTags.includes(filters.tag) && !company.riskTags.includes(filters.tag)) return false;
      if (filters.overtime === "low" && company.overtimeHours > 20) return false;
      if (filters.overtime === "mid" && (company.overtimeHours <= 20 || company.overtimeHours > 35)) return false;
      if (filters.overtime === "high" && company.overtimeHours <= 35) return false;
      if (filters.score && company.openworkScore < Number(filters.score)) return false;
      if (filters.recommendation && company.recommendationScore < Number(filters.recommendation)) return false;
      return true;
    });
    return sortCompanies(result, filters.sort);
  }, [companies, filters]);

  const compareCompanies = compare.map((slug) => companies.find((company) => company.slug === slug)).filter(Boolean) as Company[];
  const setFilter = (key: keyof Filters, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  const toggleCompare = (slug: string) => {
    setCompare((current) => {
      const next = current.includes(slug) ? current.filter((item) => item !== slug) : current.length >= 3 ? current : [...current, slug];
      localStorage.setItem("compareCompanies", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)_260px]">
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
          <SlidersHorizontal size={16} />
          决策筛选
        </div>
        <div className="mt-4 grid gap-3">
          <label className="grid gap-1 text-xs font-medium text-slate-500">
            搜索
            <input className="focus-ring h-10 rounded-md border border-slate-200 bg-slate-50 px-3" placeholder="公司、岗位、技能、风险" value={filters.query} onInput={(event) => setFilter("query", event.currentTarget.value)} />
          </label>
          <Select label="行业" value={filters.industry} options={options.industries} onChange={(value) => setFilter("industry", value)} />
          <Select label="地区" value={filters.region} options={options.regions} onChange={(value) => setFilter("region", value)} />
          <Select label="公司规模" value={filters.employeeBand} options={options.employeeBands} onChange={(value) => setFilter("employeeBand", value)} />
          <Select label="工资区间" value={filters.salaryBand} options={options.salaryBands} onChange={(value) => setFilter("salaryBand", value)} />
          <Select label="日语要求" value={filters.japaneseLevel} options={options.japaneseLevels} onChange={(value) => setFilter("japaneseLevel", value)} />
          <BoolSelect label="支持签证" value={filters.visaSupport} onChange={(value) => setFilter("visaSupport", value)} />
          <BoolSelect label="接受外国人" value={filters.acceptsForeigners} onChange={(value) => setFilter("acceptsForeigners", value)} />
          <BoolSelect label="适合新卒" value={filters.suitableForNewGrad} onChange={(value) => setFilter("suitableForNewGrad", value)} />
          <BoolSelect label="适合转职" value={filters.suitableForCareerChange} onChange={(value) => setFilter("suitableForCareerChange", value)} />
          <BoolSelect label="低日语可挑战" value={filters.suitableForLowJapanese} onChange={(value) => setFilter("suitableForLowJapanese", value)} />
          <BoolSelect label="轮班" value={filters.shiftWork} onChange={(value) => setFilter("shiftWork", value)} />
          <Select label="标签" value={filters.tag} options={options.tags} onChange={(value) => setFilter("tag", value)} />
          <Select label="加班" value={filters.overtime} options={["low", "mid", "high"]} labels={{ low: "20小时以内", mid: "21-35小时", high: "35小时以上" }} onChange={(value) => setFilter("overtime", value)} />
          <Select label="工作方式" value={filters.workStyle} options={["remote", "hybrid", "onsite"]} labels={{ remote: "远程可", hybrid: "混合办公", onsite: "到岗为主" }} onChange={(value) => setFilter("workStyle", value)} />
          <Select label="排序" value={filters.sort} options={["recommendation", "foreigner", "salary", "overtime", "growth", "stability", "newGrad", "career"]} labels={{ recommendation: "综合评分", foreigner: "外国人友好", salary: "工资", overtime: "加班少", growth: "成长性", stability: "稳定性", newGrad: "新卒推荐", career: "转职推荐" }} onChange={(value) => setFilter("sort", value || "recommendation")} />
          <button className="h-10 rounded-md border border-slate-200 text-sm font-semibold text-slate-700" onClick={() => setFilters(initialFilters)}>
            清空筛选
          </button>
        </div>
      </aside>

      <section className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-950">企业决策列表</h1>
            <p className="mt-1 text-sm text-slate-500">当前显示 {filtered.length} 家。重点看签证、日语、加班、工资、风险和适合人群。</p>
          </div>
          <Link href="/profile-test" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            做适合度测试
          </Link>
        </div>
        {filtered.length === 0 ? (
          <EmptyState title="没有匹配企业" body="尝试降低日语、地区、工资或签证筛选条件。求职决策里，完全匹配通常很少，候选池可以先放宽。" />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {filtered.map((company) => (
              <CompanyCard
                key={company.slug}
                company={company}
                compareSelected={compare.includes(company.slug)}
                compareDisabled={!compare.includes(company.slug) && compare.length >= 3}
                onCompare={() => toggleCompare(company.slug)}
              />
            ))}
          </div>
        )}
      </section>

      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-4">
        <h2 className="font-semibold text-slate-950">当前决策视角</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.visaSupport === "true" && <Tag tone="blue">需要签证</Tag>}
          {filters.acceptsForeigners === "true" && <Tag tone="green">外国人友好</Tag>}
          {filters.suitableForLowJapanese === "true" && <Tag tone="green">低日语</Tag>}
          {filters.overtime === "low" && <Tag tone="green">低加班</Tag>}
          {filters.tag && <Tag tone="blue">{filters.tag}</Tag>}
          {!filters.visaSupport && !filters.acceptsForeigners && !filters.tag && <span className="text-sm text-slate-500">选择筛选后，这里会显示你的判断条件。</span>}
        </div>

        <div className="mt-5 border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-950">企业对比</h2>
            <span className="text-xs text-slate-500">{compare.length}/3</span>
          </div>
          <div className="mt-3 grid gap-2">
            {compareCompanies.length === 0 && <p className="text-sm leading-6 text-slate-500">在卡片上点“对比”，选择 2-3 家公司后查看差异。</p>}
            {compareCompanies.map((company) => (
              <div key={company.slug} className="rounded-md bg-slate-50 p-3 text-sm">
                <div className="font-semibold text-slate-950">{company.name}</div>
                <div className="mt-1 text-xs text-slate-500">综合 {company.recommendationScore} · 加班 {company.overtimeHours}h</div>
              </div>
            ))}
            {compareCompanies.length > 0 && (
              <Link href="/compare" className="mt-1 rounded-md bg-slate-950 px-3 py-2 text-center text-sm font-semibold text-white">
                打开对比页
              </Link>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

function Select({ label, value, options, labels = {}, onChange }: { label: string; value: string; options: string[]; labels?: Record<string, string>; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-xs font-medium text-slate-500">
      {label}
      <select className="focus-ring h-10 rounded-md border border-slate-200 bg-slate-50 px-3" value={value} onInput={(event) => onChange(event.currentTarget.value)}>
        <option value="">全部</option>
        {options.map((option) => (
          <option key={option} value={option}>{labels[option] ?? option}</option>
        ))}
      </select>
    </label>
  );
}

function BoolSelect({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-xs font-medium text-slate-500">
      {label}
      <select className="focus-ring h-10 rounded-md border border-slate-200 bg-slate-50 px-3" value={value} onInput={(event) => onChange(event.currentTarget.value)}>
        <option value="">全部</option>
        <option value="true">是</option>
        <option value="false">否</option>
      </select>
    </label>
  );
}
