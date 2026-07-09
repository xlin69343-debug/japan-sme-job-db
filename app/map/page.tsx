import Link from "next/link";
import { getCompanies } from "@/lib/companies";
import type { Company } from "@/lib/types";
import { Tag } from "@/components/DecisionUi";

export const metadata = {
  title: "地区地图 | 我的日本求职成长台",
};

export default function MapPage() {
  const companies = getCompanies();
  const groups = Array.from(groupBy(companies, (company) => company.region).entries()).map(([region, items]) => ({
    region,
    items,
    avgOvertime: Math.round(items.reduce((sum, company) => sum + company.overtimeHours, 0) / items.length),
    avgScore: Math.round((items.reduce((sum, company) => sum + company.recommendationScore, 0) / items.length) * 10) / 10,
    foreignerCount: items.filter((company) => company.acceptsForeigners).length,
    topIndustries: topIndustries(items),
  }));

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-6 md:px-8">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">我的求职地区地图</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">先按地区聚合，不接真实地图 API。用企业数量、加班估算、外国人录用线索和推荐行业判断我适合把求职重心放在哪里。</p>
      </section>

      <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <article key={group.region} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">{group.region}</h2>
                <p className="mt-1 text-sm text-slate-500">{group.items.length} 家企业</p>
              </div>
              <span className="rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">个人排序 {group.avgScore}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <Metric label="加班估算均值" value={`${group.avgOvertime}小时/月`} />
              <Metric label="外国人线索" value={`${group.foreignerCount}家`} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.topIndustries.map((industry) => <Tag key={industry} tone="blue">{industry}</Tag>)}
            </div>
            <div className="mt-4 grid gap-2">
              {group.items.slice(0, 4).map((company) => (
                <Link key={company.slug} href={`/companies/${company.slug}`} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm">
                  <span className="font-medium text-slate-800">{company.name}</span>
                  <span className="text-slate-500">{company.recommendationScore}</span>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 font-semibold text-slate-950">{value}</div>
    </div>
  );
}

function groupBy<T>(items: T[], pick: (item: T) => string) {
  return items.reduce((map, item) => {
    const key = pick(item);
    map.set(key, [...(map.get(key) ?? []), item]);
    return map;
  }, new Map<string, T[]>());
}

function topIndustries(companies: Company[]) {
  const counts = new Map<string, number>();
  for (const company of companies) counts.set(company.industry, (counts.get(company.industry) ?? 0) + 1);
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([industry]) => industry);
}
