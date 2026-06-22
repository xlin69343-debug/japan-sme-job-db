"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Company } from "@/lib/types";
import { EmptyState, Tag } from "./DecisionUi";

export function CompareBoard({ companies }: { companies: Company[] }) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setSelected(JSON.parse(localStorage.getItem("compareCompanies") || "[]"));
  }, []);

  const selectedCompanies = selected.map((slug) => companies.find((company) => company.slug === slug)).filter(Boolean) as Company[];
  const addCompany = (slug: string) => {
    setSelected((current) => {
      const next = current.includes(slug) ? current : current.length >= 3 ? current : [...current, slug];
      localStorage.setItem("compareCompanies", JSON.stringify(next));
      return next;
    });
  };
  const removeCompany = (slug: string) => {
    const next = selected.filter((item) => item !== slug);
    localStorage.setItem("compareCompanies", JSON.stringify(next));
    setSelected(next);
  };

  const best = selectedCompanies.length > 0 ? {
    stable: maxBy(selectedCompanies, (company) => company.scoreBreakdown.stability),
    salary: maxBy(selectedCompanies, (company) => company.scoreBreakdown.salary),
    foreigner: maxBy(selectedCompanies, (company) => company.foreignerFriendlyScore),
    balance: maxBy(selectedCompanies, (company) => company.scoreBreakdown.workLifeBalance),
  } : null;

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">企业对比</h1>
        <p className="mt-2 text-sm text-slate-500">选择 2-3 家公司，对比工资、加班、远程、日语、签证、外国人友好度和风险。</p>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <select className="focus-ring h-11 rounded-md border border-slate-200 bg-slate-50 px-3" onInput={(event) => addCompany(event.currentTarget.value)} value="">
            <option value="">添加企业到对比</option>
            {companies.filter((company) => !selected.includes(company.slug)).map((company) => (
              <option key={company.slug} value={company.slug}>{company.name} · {company.industry}</option>
            ))}
          </select>
          <button className="h-11 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700" onClick={() => { localStorage.removeItem("compareCompanies"); setSelected([]); }}>
            清空对比
          </button>
        </div>
      </section>

      {selectedCompanies.length === 0 ? (
        <EmptyState title="还没有选择企业" body="可以从企业列表卡片点击“对比”，也可以在上方下拉框手动添加。" />
      ) : (
        <>
          {best && (
            <section className="grid gap-3 md:grid-cols-4">
              <Conclusion title="重视稳定" company={best.stable} />
              <Conclusion title="重视工资" company={best.salary} />
              <Conclusion title="外国人友好" company={best.foreigner} />
              <Conclusion title="生活平衡" company={best.balance} />
            </section>
          )}
          <section className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <tbody>
                {rows.map(([label, render]) => (
                  <tr key={label} className="border-b border-slate-200 last:border-b-0">
                    <th className="w-44 bg-slate-50 p-4 text-left font-semibold text-slate-700">{label}</th>
                    {selectedCompanies.map((company) => (
                      <td key={company.slug} className="p-4 align-top text-slate-700">{render(company, removeCompany)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}

const rows: [string, (company: Company, remove: (slug: string) => void) => React.ReactNode][] = [
  ["公司", (company, remove) => <div><Link href={`/companies/${company.slug}`} className="font-semibold text-blue-700">{company.name}</Link><button className="ml-3 text-xs text-slate-400 hover:text-red-600" onClick={() => remove(company.slug)}>移除</button></div>],
  ["综合评分", (company) => `${company.recommendationScore}/10`],
  ["工资", (company) => `${company.salaryRange}；工资分 ${company.scoreBreakdown.salary}/10`],
  ["加班", (company) => company.overtime],
  ["远程", (company) => company.remoteWork],
  ["日语要求", (company) => company.japaneseLevel],
  ["签证支持", (company) => company.visaSupport ? "支持或可期待" : "需确认"],
  ["外国人友好度", (company) => `${company.foreignerFriendlyScore}/10`],
  ["成长性", (company) => `${company.scoreBreakdown.growth}/10`],
  ["稳定性", (company) => `${company.scoreBreakdown.stability}/10`],
  ["员工评价", (company) => `${company.openworkScore} / OpenWork 摘要口径`],
  ["风险标签", (company) => <div className="flex flex-wrap gap-2">{company.riskTags.length ? company.riskTags.map((tag) => <Tag key={tag} tone="amber">{tag}</Tag>) : <Tag tone="green">暂无明显高风险</Tag>}</div>],
  ["适合人群", (company) => company.suitedFor.join("、")],
  ["不适合人群", (company) => company.notSuitedFor.join("、")],
];

function Conclusion({ title, company }: { title: string; company: Company }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold text-slate-500">{title}</div>
      <Link href={`/companies/${company.slug}`} className="mt-2 block font-semibold text-slate-950 hover:text-blue-700">{company.name}</Link>
      <p className="mt-1 text-xs leading-5 text-slate-500">{company.decisionSummary}</p>
    </div>
  );
}

function maxBy(companies: Company[], pick: (company: Company) => number) {
  return [...companies].sort((a, b) => pick(b) - pick(a))[0];
}
