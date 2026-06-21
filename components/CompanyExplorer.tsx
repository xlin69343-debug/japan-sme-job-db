"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Company, Filters } from "@/lib/types";

type Props = {
  companies: Company[];
  options: {
    industries: string[];
    regions: string[];
    employeeBands: string[];
    salaryBands: string[];
    japaneseLevels: string[];
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
};

export function CompanyExplorer({ companies, options }: Props) {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [compare, setCompare] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return companies.filter((company) => {
      const text = [
        company.name,
        company.industry,
        company.location,
        company.region,
        company.mainBusiness,
        company.hiringPositions.join(" "),
        company.requiredSkills.join(" "),
        company.reviewSummary.keywords.join(" "),
      ]
        .join(" ")
        .toLowerCase();
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
      if (filters.overtime === "low" && company.overtimeHours > 20) return false;
      if (filters.overtime === "mid" && (company.overtimeHours <= 20 || company.overtimeHours > 35)) return false;
      if (filters.overtime === "high" && company.overtimeHours <= 35) return false;
      if (filters.score && company.openworkScore < Number(filters.score)) return false;
      if (filters.recommendation && company.recommendationScore < Number(filters.recommendation)) return false;
      return true;
    });
  }, [companies, filters]);

  const hotCompanies = companies.slice(0, 6);
  const latestCompanies = [...companies].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6);
  const compareCompanies = compare.map((slug) => companies.find((company) => company.slug === slug)).filter(Boolean) as Company[];

  const setFilter = (key: keyof Filters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const toggleCompare = (slug: string) => {
    setCompare((current) => {
      if (current.includes(slug)) return current.filter((item) => item !== slug);
      if (current.length >= 3) return current;
      return [...current, slug];
    });
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-lg border border-line bg-white p-7 shadow-soft">
          <p className="text-sm font-semibold text-rust">日本全行业中小企业求职数据库 · MVP</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            给外国人求职者看的日本中小企业地图
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            覆盖 IT、AI、制造、商社、物流、酒店、餐饮、介护、教育、不动产、零售、金融、广告、游戏内容等行业。
            当前版本收录 100 家企业，支持搜索、筛选、详情页和 2-3 家对比。
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              className="focus-ring h-12 rounded-md border border-line bg-paper px-4"
              placeholder="搜索公司、行业、地区、技能、岗位"
              value={filters.query}
              onInput={(event) => setFilter("query", event.currentTarget.value)}
            />
            <button
              className="h-12 rounded-md bg-ink px-5 text-sm font-semibold text-white"
              onClick={() => setFilters(initialFilters)}
            >
              清空筛选
            </button>
          </div>
        </div>
        <div className="grid gap-3 rounded-lg border border-line bg-white p-5 shadow-soft">
          {[
            ["企业数量", `${companies.length} 家`],
            ["行业覆盖", `${options.industries.length} 类`],
            ["可远程", `${companies.filter((item) => item.remoteAvailable).length} 家`],
            ["支持签证", `${companies.filter((item) => item.visaSupport).length} 家`],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between border-b border-line pb-3 last:border-b-0 last:pb-0">
              <span className="text-sm text-muted">{label}</span>
              <strong className="text-xl text-ink">{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <MiniPanel title="热门企业" companies={hotCompanies} />
        <MiniPanel title="最新更新企业" companies={latestCompanies} />
      </section>

      <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">企业列表</h2>
            <p className="text-sm text-muted">当前显示 {filtered.length} 家。选择 2-3 家可在下方对比。</p>
          </div>
          <div className="text-sm text-muted">已选择对比：{compare.length}/3</div>
        </div>

        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
          <Select label="行业" value={filters.industry} options={options.industries} onChange={(value) => setFilter("industry", value)} />
          <Select label="地区" value={filters.region} options={options.regions} onChange={(value) => setFilter("region", value)} />
          <Select label="员工人数" value={filters.employeeBand} options={options.employeeBands} onChange={(value) => setFilter("employeeBand", value)} />
          <Select label="年收范围" value={filters.salaryBand} options={options.salaryBands} onChange={(value) => setFilter("salaryBand", value)} />
          <Select label="日语等级" value={filters.japaneseLevel} options={options.japaneseLevels} onChange={(value) => setFilter("japaneseLevel", value)} />
          <BoolSelect label="支持签证" value={filters.visaSupport} onChange={(value) => setFilter("visaSupport", value)} />
          <BoolSelect label="接受外国人" value={filters.acceptsForeigners} onChange={(value) => setFilter("acceptsForeigners", value)} />
          <BoolSelect label="远程办公" value={filters.remoteAvailable} onChange={(value) => setFilter("remoteAvailable", value)} />
          <BoolSelect label="轮班" value={filters.shiftWork} onChange={(value) => setFilter("shiftWork", value)} />
          <label className="grid gap-1 text-xs font-medium text-muted">
            加班多少
            <select className="focus-ring h-10 rounded-md border border-line bg-paper px-3" value={filters.overtime} onInput={(event) => setFilter("overtime", event.currentTarget.value)}>
              <option value="">全部</option>
              <option value="low">20小时以内</option>
              <option value="mid">21-35小时</option>
              <option value="high">35小时以上</option>
            </select>
          </label>
          <Select label="员工评价分数" value={filters.score} options={["3", "3.3", "3.5", "3.8"]} onChange={(value) => setFilter("score", value)} prefix="OpenWork ≥ " />
          <Select label="推荐指数" value={filters.recommendation} options={["6", "7", "8", "9"]} onChange={(value) => setFilter("recommendation", value)} prefix="推荐 ≥ " />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((company) => (
            <CompanyCard
              key={company.slug}
              company={company}
              selected={compare.includes(company.slug)}
              disabled={!compare.includes(company.slug) && compare.length >= 3}
              onCompare={() => toggleCompare(company.slug)}
            />
          ))}
        </div>
      </section>

      {compareCompanies.length > 0 && (
        <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">企业对比</h2>
              <p className="text-sm text-muted">可比较年收、加班、远程、日语要求、评价分数和外国人友好度。</p>
            </div>
            <button className="rounded-md border border-line px-3 py-2 text-sm" onClick={() => setCompare([])}>
              清空对比
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <tbody>
                {[
                  ["公司", "name"],
                  ["年收", "salaryRange"],
                  ["加班", "overtime"],
                  ["远程", "remoteWork"],
                  ["日语要求", "japaneseLevel"],
                  ["评价分数", "openworkScore"],
                  ["外国人友好度", "foreignerFriendlyScore"],
                  ["推荐指数", "recommendationScore"],
                ].map(([label, key]) => (
                  <tr key={key} className="border-b border-line">
                    <th className="w-32 bg-paper p-3 text-left font-semibold">{label}</th>
                    {compareCompanies.map((company) => (
                      <td key={company.slug} className="p-3 align-top">
                        {String(company[key as keyof Company])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function MiniPanel({ title, companies }: { title: string; companies: Company[] }) {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4 grid gap-3">
        {companies.map((company) => (
          <Link key={company.slug} href={`/companies/${company.slug}`} className="flex items-center justify-between rounded-md border border-line bg-paper px-4 py-3 hover:border-moss">
            <div>
              <div className="font-semibold">{company.name}</div>
              <div className="text-xs text-muted">{company.industry} · {company.region}</div>
            </div>
            <span className="text-sm font-semibold text-moss">{company.recommendationScore}/10</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function CompanyCard({ company, selected, disabled, onCompare }: { company: Company; selected: boolean; disabled: boolean; onCompare: () => void }) {
  return (
    <article className="rounded-lg border border-line bg-paper p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link href={`/companies/${company.slug}`} className="text-lg font-semibold text-ink hover:text-moss">
            {company.name}
          </Link>
          <p className="mt-1 text-sm text-muted">{company.industry} · {company.location}</p>
        </div>
        <span className="rounded-full bg-white px-2 py-1 text-sm font-semibold text-rust">{company.recommendationScore}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <Info label="员工人数" value={company.employees} />
        <Info label="平均年收" value={company.salaryRange} />
        <Info label="工作时间" value={company.workHours} />
        <Info label="远程" value={company.remoteWork} />
        <Info label="加班" value={company.overtime} />
        <Info label="OpenWork" value={`${company.openworkScore}`} />
        <Info label="外国人友好" value={`${company.foreignerFriendlyScore}/10`} />
        <Info label="日语" value={company.japaneseLevel} />
      </div>
      <div className="mt-4 flex gap-2">
        <Link href={`/companies/${company.slug}`} className="flex-1 rounded-md bg-ink px-3 py-2 text-center text-sm font-semibold text-white">
          详情
        </Link>
        <button
          className="rounded-md border border-line px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
          disabled={disabled}
          onClick={onCompare}
        >
          {selected ? "取消对比" : "加入对比"}
        </button>
      </div>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white p-2">
      <div className="text-[11px] text-muted">{label}</div>
      <div className="mt-1 line-clamp-2 text-xs font-medium text-ink">{value}</div>
    </div>
  );
}

function Select({ label, value, options, prefix = "", onChange }: { label: string; value: string; options: string[]; prefix?: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-xs font-medium text-muted">
      {label}
      <select className="focus-ring h-10 rounded-md border border-line bg-paper px-3" value={value} onInput={(event) => onChange(event.currentTarget.value)}>
        <option value="">全部</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {prefix}{option}
          </option>
        ))}
      </select>
    </label>
  );
}

function BoolSelect({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-xs font-medium text-muted">
      {label}
      <select className="focus-ring h-10 rounded-md border border-line bg-paper px-3" value={value} onInput={(event) => onChange(event.currentTarget.value)}>
        <option value="">全部</option>
        <option value="true">是</option>
        <option value="false">否</option>
      </select>
    </label>
  );
}
