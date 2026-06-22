"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Company, UserProfile } from "@/lib/types";
import { calculateMatch, defaultProfile } from "@/lib/recommendation";
import { Tag } from "./DecisionUi";

export function ProfileMatcher({ companies, industries, regions }: { companies: Company[]; industries: string[]; regions: string[] }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const matches = useMemo(() => companies.map((company) => ({ company, match: calculateMatch(company, profile) })).sort((a, b) => b.match.score - a.match.score).slice(0, 12), [companies, profile]);

  const update = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => setProfile((current) => ({ ...current, [key]: value }));

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
      <section className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-4">
        <h1 className="text-2xl font-semibold text-slate-950">适合度测试</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">输入你的画像，系统会按签证、日语、行业、地区、薪资、加班和职业目标推荐企业。</p>
        <div className="mt-5 grid gap-3">
          <Input label="国籍" value={profile.nationality} onChange={(value) => update("nationality", value)} />
          <Select label="日语水平" value={profile.japaneseLevel} options={["N1", "N2", "N3", "N4以下"]} onChange={(value) => update("japaneseLevel", value)} />
          <Select label="学历" value={profile.education} options={["专门学校", "本科", "硕士", "博士", "其他"]} onChange={(value) => update("education", value)} />
          <Select label="工作经验" value={profile.experience} options={["无经验", "1-3年", "3-5年", "5年以上"]} onChange={(value) => update("experience", value)} />
          <Select label="目标行业" value={profile.targetIndustry} options={industries} allowEmpty onChange={(value) => update("targetIndustry", value)} />
          <Select label="目标地区" value={profile.targetRegion} options={regions} allowEmpty onChange={(value) => update("targetRegion", value)} />
          <Select label="希望薪资" value={profile.desiredSalary} options={["400万日元以下", "400万-600万日元", "600万-800万日元", "800万日元以上"]} onChange={(value) => update("desiredSalary", value)} />
          <Select label="接受加班" value={profile.acceptsOvertime} options={["不接受加班", "20小时以内", "20-30小时", "30小时以上"]} onChange={(value) => update("acceptsOvertime", value)} />
          <Select label="希望工作方式" value={profile.preferredWorkStyle} options={["远程", "混合", "到岗"]} onChange={(value) => update("preferredWorkStyle", value)} />
          <Select label="职业目标" value={profile.careerGoal} options={["稳定发展", "提高年收", "技术成长", "拿日本工作经验", "未来转大企业", "低日语压力", "拿签证优先", "工作生活平衡"]} onChange={(value) => update("careerGoal", value)} />
          <Toggle label="需要签证支持" checked={profile.needsVisa} onChange={(value) => update("needsVisa", value)} />
          <Toggle label="接受轮班" checked={profile.acceptsShift} onChange={(value) => update("acceptsShift", value)} />
        </div>
      </section>

      <section className="grid gap-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">推荐结果</h2>
          <p className="mt-2 text-sm text-slate-500">每个结果都解释为什么推荐、潜在风险、面试准备重点和投递建议。</p>
        </div>
        {matches.map(({ company, match }) => (
          <article key={company.slug} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Link href={`/companies/${company.slug}`} className="text-xl font-semibold text-slate-950 hover:text-blue-700">{company.name}</Link>
                <p className="mt-1 text-sm text-slate-500">{company.industry} · {company.region} · {company.salaryRange}</p>
              </div>
              <div className="rounded-md bg-blue-600 px-3 py-2 text-center text-white">
                <div className="text-[11px]">{match.verdict}</div>
                <div className="text-xl font-semibold">{match.score}%</div>
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              <div className="rounded-md bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-500">准备期</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{match.prepTime}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {match.missing.map((item) => <Tag key={item} tone="amber">{item}</Tag>)}
                </div>
              </div>
              <ReasonBlock title="推荐原因" items={match.reasons.length ? match.reasons : [company.recommendationReason]} tone="green" />
              <ReasonBlock title="潜在风险" items={match.risks.length ? match.risks : ["暂无明显画像冲突，仍需确认固定残业和配属"]} tone="amber" />
              <ReasonBlock title="面试准备" items={match.advice} tone="blue" />
            </div>
            <div className="mt-4 rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              投递建议：{match.verdict === "优先" ? "优先投递，并准备岗位相关案例。" : match.verdict === "适合" ? "可作为候选，先确认风险项。" : match.verdict === "挑战" ? "先研究并补齐缺口，准备期通常需要6个月以上。" : "暂缓投递，建议先调整目标或补基础能力。"}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function ReasonBlock({ title, items, tone }: { title: string; items: string[]; tone: "green" | "amber" | "blue" }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => <Tag key={item} tone={tone}>{item}</Tag>)}
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-xs font-medium text-slate-500">
      {label}
      <input className="focus-ring h-10 rounded-md border border-slate-200 bg-slate-50 px-3" value={value} onInput={(event) => onChange(event.currentTarget.value)} />
    </label>
  );
}

function Select({ label, value, options, allowEmpty = false, onChange }: { label: string; value: string; options: string[]; allowEmpty?: boolean; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-xs font-medium text-slate-500">
      {label}
      <select className="focus-ring h-10 rounded-md border border-slate-200 bg-slate-50 px-3" value={value} onInput={(event) => onChange(event.currentTarget.value)}>
        {allowEmpty && <option value="">不限</option>}
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
      {label}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.currentTarget.checked)} />
    </label>
  );
}
