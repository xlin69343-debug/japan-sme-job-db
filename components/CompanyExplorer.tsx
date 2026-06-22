"use client";

import Link from "next/link";
import { ArrowRight, GitCompare, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
  const [advancedOpen, setAdvancedOpen] = useState(false);

  useEffect(() => {
    const savedCompare = JSON.parse(localStorage.getItem("compareCompanies") || "[]") as string[];
    setCompare(savedCompare.filter((slug) => companies.some((company) => company.slug === slug)).slice(0, 3));

    const search = new URLSearchParams(window.location.search);
    const preset = search.get("s");
    const query = search.get("q");
    const region = search.get("region");
    if (query) setFilters((current) => ({ ...current, query }));
    if (region) setFilters((current) => ({ ...current, region }));
    if (preset === "newgrad") setFilters((current) => ({ ...current, suitableForNewGrad: "true", sort: "newGrad" }));
    if (preset === "career") setFilters((current) => ({ ...current, suitableForCareerChange: "true", sort: "career" }));
    if (preset === "small") setFilters((current) => ({ ...current, employeeBand: "100人以下", tag: "超小团队" }));
    if (preset === "visa") setFilters((current) => ({ ...current, visaSupport: "true", acceptsForeigners: "true", sort: "foreigner" }));
    if (preset === "lowjp") setFilters((current) => ({ ...current, suitableForLowJapanese: "true", visaSupport: "true" }));
    if (preset === "foreigner") setFilters((current) => ({ ...current, acceptsForeigners: "true", sort: "foreigner" }));
    if (preset === "growth") setFilters((current) => ({ ...current, sort: "growth" }));
  }, [companies]);

  const filtered = useMemo(() => {
    const query = expandQuery(filters.query);
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
      if (query.length > 0 && !query.some((keyword) => text.includes(keyword))) return false;
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
  const activeFilters = getActiveFilters(filters);
  const setPreset = (patch: Partial<Filters>) => setFilters((current) => ({ ...current, ...patch }));
  const clearFilter = (key: keyof Filters) => setFilters((current) => ({ ...current, [key]: key === "sort" ? "recommendation" : "" }));
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
            智能搜索
            <input className="focus-ring h-10 rounded-md border border-slate-200 bg-slate-50 px-3" placeholder="AI、外国人、工签、N3、低加班" value={filters.query} onInput={(event) => setFilter("query", event.currentTarget.value)} />
          </label>
          <Select label="行业" value={filters.industry} options={options.industries} onChange={(value) => setFilter("industry", value)} />
          <Select label="地区" value={filters.region} options={options.regions} onChange={(value) => setFilter("region", value)} />
          <Select label="日语要求" value={filters.japaneseLevel} options={options.japaneseLevels} onChange={(value) => setFilter("japaneseLevel", value)} />
          <BoolSelect label="支持签证" value={filters.visaSupport} onChange={(value) => setFilter("visaSupport", value)} />
          <button
            className="flex h-10 items-center justify-between rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700"
            onClick={() => setAdvancedOpen((value) => !value)}
          >
            高级筛选
            <span className="text-xs text-slate-400">{advancedOpen ? "收起" : "展开"}</span>
          </button>
          {advancedOpen && (
            <div className="grid gap-3 rounded-md border border-slate-100 bg-slate-50 p-3">
              <Select label="公司规模" value={filters.employeeBand} options={options.employeeBands} onChange={(value) => setFilter("employeeBand", value)} />
              <Select label="工资区间" value={filters.salaryBand} options={options.salaryBands} onChange={(value) => setFilter("salaryBand", value)} />
              <BoolSelect label="接受外国人" value={filters.acceptsForeigners} onChange={(value) => setFilter("acceptsForeigners", value)} />
              <BoolSelect label="适合新卒" value={filters.suitableForNewGrad} onChange={(value) => setFilter("suitableForNewGrad", value)} />
              <BoolSelect label="适合转职" value={filters.suitableForCareerChange} onChange={(value) => setFilter("suitableForCareerChange", value)} />
              <BoolSelect label="N3可挑战" value={filters.suitableForLowJapanese} onChange={(value) => setFilter("suitableForLowJapanese", value)} />
              <BoolSelect label="轮班" value={filters.shiftWork} onChange={(value) => setFilter("shiftWork", value)} />
              <Select label="标签" value={filters.tag} options={options.tags} onChange={(value) => setFilter("tag", value)} />
              <Select label="加班" value={filters.overtime} options={["low", "mid", "high"]} labels={{ low: "20小时以内", mid: "21-35小时", high: "35小时以上" }} onChange={(value) => setFilter("overtime", value)} />
              <Select label="工作方式" value={filters.workStyle} options={["remote", "hybrid", "onsite"]} labels={{ remote: "远程可", hybrid: "混合办公", onsite: "到岗为主" }} onChange={(value) => setFilter("workStyle", value)} />
            </div>
          )}
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
        <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm font-semibold text-slate-700">快速标签</span>
            <QuickButton active={filters.acceptsForeigners === "true"} onClick={() => setPreset({ acceptsForeigners: filters.acceptsForeigners === "true" ? "" : "true", sort: "foreigner" })}>#外国人友好</QuickButton>
            <QuickButton active={filters.visaSupport === "true"} onClick={() => setPreset({ visaSupport: filters.visaSupport === "true" ? "" : "true" })}>#支持工签</QuickButton>
            <QuickButton active={filters.remoteAvailable === "true"} onClick={() => setPreset({ remoteAvailable: filters.remoteAvailable === "true" ? "" : "true", workStyle: filters.remoteAvailable === "true" ? "" : "hybrid" })}>#远程办公</QuickButton>
            <QuickButton active={filters.overtime === "low"} onClick={() => setPreset({ overtime: filters.overtime === "low" ? "" : "low", sort: "overtime" })}>#加班少</QuickButton>
            <QuickButton active={filters.sort === "growth"} onClick={() => setPreset({ sort: filters.sort === "growth" ? "recommendation" : "growth" })}>#成长快</QuickButton>
            <QuickButton active={filters.suitableForNewGrad === "true"} onClick={() => setPreset({ suitableForNewGrad: filters.suitableForNewGrad === "true" ? "" : "true", sort: "newGrad" })}>#新卒可</QuickButton>
            <QuickButton active={filters.tag === "小企业" || filters.tag === "超小团队"} onClick={() => setPreset({ employeeBand: "100-300人", tag: filters.tag ? "" : "小企业" })}>#文理不限</QuickButton>
          </div>
          {activeFilters.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
              {activeFilters.map((item) => (
                <button key={item.key} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700" onClick={() => clearFilter(item.key)}>
                  {item.label} ×
                </button>
              ))}
            </div>
          )}
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
      {compareCompanies.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-lg border border-slate-200 bg-white p-4 shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 font-semibold text-slate-950">
                <GitCompare size={17} />
                企业对比
              </div>
              <p className="mt-1 text-sm text-slate-500">已选择 {compareCompanies.length} 家公司</p>
            </div>
            <button className="rounded-md p-1 text-slate-400 hover:bg-slate-100" onClick={() => { setCompare([]); localStorage.removeItem("compareCompanies"); }} title="清空对比">
              <X size={17} />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {compareCompanies.map((company) => (
              <span key={company.slug} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{company.name}</span>
            ))}
          </div>
          {compareCompanies.length < 2 ? (
            <div className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">再选择 1 家即可对比</div>
          ) : (
            <Link href="/compare" className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-blue-600 text-sm font-semibold text-white">
              立即对比
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function QuickButton({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick: () => void }) {
  return (
    <button className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${active ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"}`} onClick={onClick}>
      {children}
    </button>
  );
}

function expandQuery(raw: string) {
  const value = raw.trim().toLowerCase();
  if (!value) return [];
  const dictionary: Record<string, string[]> = {
    ai: ["ai", "人工智能", "机器学习", "数据", "算法"],
    外国人: ["外国人", "外国人友好", "签证", "在留", "n3", "n2"],
    工签: ["签证", "visa", "在留资格", "工签"],
    签证: ["签证", "visa", "在留资格", "工签"],
    低日语: ["n3", "低日语", "低日语可挑战"],
    轻松: ["低加班", "工作生活平衡", "远程"],
    远程: ["远程", "混合", "remote"],
    制造: ["制造", "生产技术", "品质", "cad"],
    it: ["it", "软件", "saas", "后端", "typescript", "python"],
  };
  return [value, ...(dictionary[value] ?? [])].map((item) => item.toLowerCase());
}

function getActiveFilters(filters: Filters) {
  const labels: Partial<Record<keyof Filters, string>> = {
    query: `搜索：${filters.query}`,
    industry: `行业：${filters.industry}`,
    region: `地区：${filters.region}`,
    employeeBand: `规模：${filters.employeeBand}`,
    salaryBand: `工资：${filters.salaryBand}`,
    japaneseLevel: `日语：${filters.japaneseLevel}`,
    visaSupport: filters.visaSupport === "true" ? "支持签证" : "不支持签证",
    acceptsForeigners: filters.acceptsForeigners === "true" ? "接受外国人" : "外国人案例少",
    remoteAvailable: filters.remoteAvailable === "true" ? "远程可" : "远程少",
    shiftWork: filters.shiftWork === "true" ? "有轮班" : "无轮班",
    overtime: filters.overtime === "low" ? "低加班" : filters.overtime === "mid" ? "中等加班" : filters.overtime === "high" ? "高加班" : "",
    suitableForNewGrad: filters.suitableForNewGrad === "true" ? "适合新卒" : "不适合新卒",
    suitableForCareerChange: filters.suitableForCareerChange === "true" ? "适合转职" : "不适合转职",
    suitableForLowJapanese: filters.suitableForLowJapanese === "true" ? "低日语可挑战" : "日语压力高",
    workStyle: filters.workStyle === "remote" ? "远程" : filters.workStyle === "hybrid" ? "混合" : filters.workStyle === "onsite" ? "到岗" : "",
    tag: `标签：${filters.tag}`,
  };
  return (Object.keys(labels) as (keyof Filters)[])
    .filter((key) => key !== "sort" && Boolean(filters[key]) && Boolean(labels[key]))
    .map((key) => ({ key, label: labels[key] ?? "" }));
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
