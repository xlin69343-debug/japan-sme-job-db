"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Company } from "@/lib/types";
import { EmptyState, Tag } from "./DecisionUi";

export function CompareBoard({ companies }: { companies: Company[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setSelected(JSON.parse(localStorage.getItem("compareCompanies") || "[]").slice(0, 3));
  }, []);

  const selectedCompanies = selected.map((slug) => companies.find((company) => company.slug === slug)).filter(Boolean) as Company[];
  const candidates = useMemo(() => {
    const value = query.trim().toLowerCase();
    return companies
      .filter((company) => !selected.includes(company.slug))
      .filter((company) => !value || [company.name, company.industry, company.region, company.matchTags.join(" ")].join(" ").toLowerCase().includes(value))
      .slice(0, 8);
  }, [companies, query, selected]);

  const addCompany = (slug: string) => {
    setSelected((current) => {
      const next = current.includes(slug) ? current : current.length >= 3 ? current : [...current, slug];
      localStorage.setItem("compareCompanies", JSON.stringify(next));
      return next;
    });
    setQuery("");
  };

  const removeCompany = (slug: string) => {
    const next = selected.filter((item) => item !== slug);
    localStorage.setItem("compareCompanies", JSON.stringify(next));
    setSelected(next);
  };

  const clear = () => {
    localStorage.removeItem("compareCompanies");
    setSelected([]);
  };

  const conclusions = selectedCompanies.length > 0 ? [
    ["工资更强", bestBy(selectedCompanies, (company) => company.scoreBreakdown.salary, "max")],
    ["加班更少", bestBy(selectedCompanies, (company) => company.overtimeHours, "min")],
    ["外国人友好", bestBy(selectedCompanies, (company) => company.foreignerFriendlyScore, "max")],
    ["成长更快", bestBy(selectedCompanies, (company) => company.scoreBreakdown.growth, "max")],
  ] as const : [];

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-950">企业对比</h1>
            <p className="mt-2 text-sm text-slate-500">选择 2-3 家公司，横向比较工资、加班、远程、日语、签证、外国人友好度和风险。不同项会自动高亮。</p>
          </div>
          <button className="h-10 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700" onClick={clear}>
            清空对比
          </button>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_1fr]">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
            <input className="focus-ring h-11 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3" placeholder="搜索公司名、行业、标签后添加" value={query} onChange={(event) => setQuery(event.currentTarget.value)} />
            {query && (
              <div className="absolute z-20 mt-2 max-h-80 w-full overflow-auto rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
                {candidates.map((company) => (
                  <button key={company.slug} className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-blue-50" disabled={selected.length >= 3} onClick={() => addCompany(company.slug)}>
                    <span>
                      <span className="font-semibold text-slate-950">{company.name}</span>
                      <span className="ml-2 text-xs text-slate-500">{company.industry} · {company.region}</span>
                    </span>
                    <span className="text-xs text-blue-700">{selected.length >= 3 ? "最多3家" : "添加"}</span>
                  </button>
                ))}
                {candidates.length === 0 && <div className="px-3 py-2 text-sm text-slate-500">没有匹配企业</div>}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedCompanies.length === 0 ? <span className="text-sm text-slate-500">还没有选择企业</span> : selectedCompanies.map((company) => (
              <span key={company.slug} className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
                {company.name}
                <button onClick={() => removeCompany(company.slug)} title="移除"><X size={14} /></button>
              </span>
            ))}
          </div>
        </div>
      </section>

      {selectedCompanies.length < 2 ? (
        <EmptyState title="请选择至少2家公司" body="可以从企业列表卡片点“对比”，也可以在上方搜索添加。选择2-3家后会出现横向差异表。" />
      ) : (
        <>
          <section className="grid gap-3 md:grid-cols-4">
            {conclusions.map(([title, company]) => <Conclusion key={title} title={title} company={company} />)}
          </section>
          <section className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[980px] border-collapse text-sm">
              <tbody>
                {rows.map((row) => {
                  const values = selectedCompanies.map((company) => row.value(company));
                  const allSame = new Set(values.map(String)).size === 1;
                  return (
                    <tr key={row.label} className="border-b border-slate-200 last:border-b-0">
                      <th className="w-44 bg-slate-50 p-4 text-left font-semibold text-slate-700">{row.label}</th>
                      {selectedCompanies.map((company) => {
                        const highlight = !allSame && row.highlight?.(company, selectedCompanies);
                        return (
                          <td key={company.slug} className={`p-4 align-top text-slate-700 ${allSame ? "opacity-60" : ""} ${highlight ? "bg-blue-50 text-blue-900" : ""}`}>
                            {row.render(company, removeCompany)}
                            {!allSame && highlight && <div className="mt-2 text-xs font-semibold text-blue-700">差异优势</div>}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}

type Row = {
  label: string;
  value: (company: Company) => string | number;
  render: (company: Company, remove: (slug: string) => void) => React.ReactNode;
  highlight?: (company: Company, companies: Company[]) => boolean;
};

const rows: Row[] = [
  { label: "公司", value: (company) => company.name, render: (company, remove) => <div><Link href={`/companies/${company.slug}`} className="font-semibold text-blue-700">{company.name}</Link><button className="ml-3 text-xs text-slate-400 hover:text-red-600" onClick={() => remove(company.slug)}>移除</button></div> },
  { label: "综合评分", value: (company) => company.recommendationScore, render: (company) => `${company.recommendationScore}/10`, highlight: maxHighlight((company) => company.recommendationScore) },
  { label: "工资", value: (company) => company.scoreBreakdown.salary, render: (company) => `${company.salaryRange}；工资分 ${company.scoreBreakdown.salary}/10`, highlight: maxHighlight((company) => company.scoreBreakdown.salary) },
  { label: "加班", value: (company) => company.overtimeHours, render: (company) => company.overtime, highlight: minHighlight((company) => company.overtimeHours) },
  { label: "工作方式", value: (company) => company.remoteWork, render: (company) => company.remoteWork, highlight: (company) => company.remoteAvailable },
  { label: "日语要求", value: (company) => company.japaneseLevel, render: (company) => <div>{company.japaneseLevel}<div className="mt-2 text-xs text-slate-500">{company.languageProofRisk}</div></div>, highlight: (company) => company.japaneseLevel.includes("N3") },
  { label: "签证支持", value: (company) => String(company.visaSupport), render: (company) => company.visaSupport ? "支持或可期待" : "需确认", highlight: (company) => company.visaSupport },
  { label: "外国人友好度", value: (company) => company.foreignerFriendlyScore, render: (company) => `${company.foreignerFriendlyScore}/10`, highlight: maxHighlight((company) => company.foreignerFriendlyScore) },
  { label: "成长空间", value: (company) => company.scoreBreakdown.growth, render: (company) => `${company.scoreBreakdown.growth}/10`, highlight: maxHighlight((company) => company.scoreBreakdown.growth) },
  { label: "面试/风险", value: (company) => `${company.interviewInfo.difficulty}-${company.riskTags.join("/")}`, render: (company) => <div className="flex flex-wrap gap-2"><Tag tone={company.interviewInfo.difficulty === "高" ? "red" : "amber"}>面试{company.interviewInfo.difficulty}</Tag>{company.riskTags.slice(0, 3).map((tag) => <Tag key={tag} tone="amber">{tag}</Tag>)}</div> },
  { label: "适合人群", value: (company) => company.suitedFor.join("、"), render: (company) => company.suitedFor.join("、") },
  { label: "不适合人群", value: (company) => company.notSuitedFor.join("、"), render: (company) => company.notSuitedFor.join("、") },
];

function Conclusion({ title, company }: { title: string; company: Company }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold text-slate-500">{title}</div>
      <Link href={`/companies/${company.slug}`} className="mt-2 block font-semibold text-slate-950 hover:text-blue-700">{company.name}</Link>
      <p className="mt-1 line-clamp-3 text-xs leading-5 text-slate-500">{company.decisionSummary}</p>
    </div>
  );
}

function bestBy(companies: Company[], pick: (company: Company) => number, direction: "min" | "max") {
  return [...companies].sort((a, b) => direction === "max" ? pick(b) - pick(a) : pick(a) - pick(b))[0];
}

function maxHighlight(pick: (company: Company) => number) {
  return (company: Company, companies: Company[]) => pick(company) === Math.max(...companies.map(pick));
}

function minHighlight(pick: (company: Company) => number) {
  return (company: Company, companies: Company[]) => pick(company) === Math.min(...companies.map(pick));
}
