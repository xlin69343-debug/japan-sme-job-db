import Link from "next/link";
import type { Company } from "@/lib/types";

export function ScoreBadge({ label, value, tone = "blue" }: { label: string; value: number | string; tone?: "blue" | "green" | "amber" | "red" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-red-50 text-red-700 border-red-100",
  };
  return (
    <div className={`rounded-md border px-3 py-2 ${tones[tone]}`}>
      <div className="text-[11px] font-medium opacity-80">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}

export function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">{value}/10</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-blue-600 transition-all duration-700" style={{ width: `${Math.max(4, Math.min(100, value * 10))}%` }} />
      </div>
    </div>
  );
}

export function Tag({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "green" | "amber" | "red" | "blue" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    blue: "bg-blue-50 text-blue-700",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function DecisionSummary({ company }: { company: Company }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-blue-50 p-5">
      <div className="text-xs font-semibold text-blue-700">求职决策结论</div>
      <p className="mt-2 text-base leading-7 text-slate-900">{company.decisionSummary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {company.matchTags.slice(0, 6).map((tag) => (
          <Tag key={tag} tone={tag.includes("风险") || tag.includes("较高") ? "amber" : "blue"}>{tag}</Tag>
        ))}
      </div>
    </section>
  );
}

export function CompanyMiniLink({ company }: { company: Company }) {
  return (
    <Link href={`/companies/${company.slug}`} className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3 hover:border-blue-300">
      <div className="min-w-0">
        <div className="truncate font-semibold text-slate-950">{company.name}</div>
        <div className="mt-1 truncate text-xs text-slate-500">{company.industry} · {company.region} · {company.japaneseLevel}</div>
      </div>
      <span className="ml-3 shrink-0 rounded-md bg-slate-100 px-2 py-1 text-sm font-semibold text-slate-900">{company.recommendationScore}</span>
    </Link>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
    </div>
  );
}
