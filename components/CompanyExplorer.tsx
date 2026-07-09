"use client";

import Link from "next/link";
import { Search, Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Company } from "@/lib/types";
import { CompanyCard } from "./CompanyCard";
import { EmptyState, Tag } from "./DecisionUi";

type Props = {
  companies: Company[];
  options: unknown;
};

type Lane = {
  key: string;
  title: string;
  subtitle: string;
  intent: string;
  companies: Company[];
  tone: "green" | "blue" | "amber" | "red";
  compact?: boolean;
};

export function CompanyExplorer({ companies }: Props) {
  const [query, setQuery] = useState("");
  const [preset, setPreset] = useState("");

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    setPreset(search.get("s") || "");
    setQuery(search.get("q") || "");
  }, []);

  const lanes = useMemo(() => buildPersonalLanes(companies, preset), [companies, preset]);
  const filteredLanes = useMemo(() => {
    const keywords = expandQuery(query);
    if (keywords.length === 0) return lanes;
    return lanes
      .map((lane) => ({
        ...lane,
        companies: lane.companies.filter((company) => matchCompany(company, keywords)),
      }))
      .filter((lane) => lane.companies.length > 0);
  }, [lanes, query]);

  const total = filteredLanes.reduce((sum, lane) => sum + lane.companies.length, 0);

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">个人主线候选</div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">只保留我需要行动的公司</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              这页不再展示完整数据库。默认只看3-5家重点准备和少量主线观察；挑战目标只用于反推学习计划，暂不主投只用于提醒自己别分心。
            </p>
          </div>
          <Link href="/student-fit" className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            看分层逻辑
          </Link>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <DecisionRule label="当前背景" value="24岁 / 专科 / C语言学习中" />
          <DecisionRule label="优先路线" value="制造IT / 测试 / 社内SE助理" />
          <DecisionRule label="先排除" value="高算法门槛 / N1强依赖 / 无签证线索" />
          <DecisionRule label="硬规则" value="重点公司最多5家，不广撒网" />
        </div>
      </section>

      <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto]">
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            placeholder="只在个人候选里搜索：C语言、测试、制造、工签、N3、AI"
            value={query}
            onInput={(event) => setQuery(event.currentTarget.value)}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <PresetButton active={preset === ""} onClick={() => setPreset("")}>重点优先</PresetButton>
          <PresetButton active={preset === "visa"} onClick={() => setPreset(preset === "visa" ? "" : "visa")}>工签优先</PresetButton>
          <PresetButton active={preset === "growth"} onClick={() => setPreset(preset === "growth" ? "" : "growth")}>挑战目标</PresetButton>
        </div>
      </section>

      <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <Target className="mt-0.5 text-amber-700" size={18} />
          <div>
            <div className="text-sm font-semibold text-amber-900">使用原则</div>
            <p className="mt-1 text-sm leading-6 text-amber-800">
              一家公司如果不能解释“为什么适合我现在这条路线”，就先不要收藏。宁可少看，也不要被130家公司拖着走。
            </p>
          </div>
        </div>
      </section>

      {total === 0 ? (
        <EmptyState title="没有匹配企业" body="把搜索词放宽一点。现在这页只显示个人路线相关企业，不追求覆盖全部数据库。" />
      ) : (
        <div className="grid gap-6">
          {filteredLanes.map((lane) => (
            <section key={lane.key} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-slate-950">{lane.title}</h2>
                    <Tag tone={lane.tone}>{lane.companies.length}家</Tag>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{lane.subtitle}</p>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{lane.intent}</p>
                </div>
              </div>
              {lane.compact ? (
                <div className="mt-4 grid gap-2 md:grid-cols-2">
                  {lane.companies.map((company) => (
                    <Link key={company.slug} href={`/companies/${company.slug}`} className="rounded-md bg-slate-50 p-3 text-sm hover:bg-blue-50">
                      <div className="font-semibold text-slate-950">{company.name}</div>
                      <div className="mt-1 text-xs text-slate-500">{company.industry} · {company.japaneseLevel} · {company.interviewInfo.difficulty}</div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-4 grid gap-4 xl:grid-cols-2">
                  {lane.companies.map((company) => (
                    <CompanyCard key={company.slug} company={company} />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function buildPersonalLanes(companies: Company[], preset: string): Lane[] {
  const focusTargets = companies
    .filter((company) => {
      const routeFit = company.industry.includes("制造") || company.industry.includes("IT") || company.hiringPositions.join("").includes("测试") || company.hiringPositions.join("").includes("社内");
      const supportFit = company.visaSupport || company.acceptsForeigners || company.suitableForLowJapanese || company.suitableForNewGrad;
      const tooHard = ["preferred-networks", "pksha", "abeja", "smartnews"].includes(company.slug) || company.interviewInfo.difficulty === "高";
      return routeFit && supportFit && !tooHard;
    })
    .sort((a, b) => Number(b.visaSupport) - Number(a.visaSupport) || a.overtimeHours - b.overtimeHours || b.foreignerFriendlyScore - a.foreignerFriendlyScore)
    .slice(0, 5);

  const focusSlugs = new Set(focusTargets.map((company) => company.slug));

  const mainTargets = companies
    .filter((company) => {
      const routeFit = company.industry.includes("制造") || company.industry.includes("IT") || company.hiringPositions.join("").includes("测试") || company.hiringPositions.join("").includes("社内");
      const supportFit = company.visaSupport || company.acceptsForeigners || company.suitableForLowJapanese || company.suitableForNewGrad;
      const tooHard = ["preferred-networks", "pksha", "abeja", "smartnews"].includes(company.slug) || company.interviewInfo.difficulty === "高";
      return routeFit && supportFit && !tooHard && !focusSlugs.has(company.slug);
    })
    .sort((a, b) => Number(b.visaSupport) - Number(a.visaSupport) || a.overtimeHours - b.overtimeHours || b.foreignerFriendlyScore - a.foreignerFriendlyScore)
    .slice(0, 8);

  const observation = companies
    .filter((company) => {
      const usefulIndustry = ["物流", "零售", "教育", "介护", "医疗", "贸易"].some((keyword) => company.industry.includes(keyword));
      return usefulIndustry && (company.visaSupport || company.acceptsForeigners);
    })
    .sort((a, b) => b.foreignerFriendlyScore - a.foreignerFriendlyScore)
    .filter((company) => !focusSlugs.has(company.slug))
    .slice(0, 4);

  const challenge = companies
    .filter((company) => ["abeja", "pksha", "smartnews", "preferred-networks", "exawizards", "brainpad"].includes(company.slug))
    .sort((a, b) => a.slug === "preferred-networks" ? 1 : b.recommendationScore - a.recommendationScore)
    .slice(0, 4);

  const notNow = companies
    .filter((company) => company.interviewInfo.difficulty === "高" || company.japaneseLevel.includes("N1") || company.riskTags.includes("技术面试难"))
    .filter((company) => !challenge.some((item) => item.slug === company.slug))
    .slice(0, 4);

  const lanes: Lane[] = [
    {
      key: "main",
      title: "重点准备",
      subtitle: "最多5家，真正进入行动",
      intent: "这些公司最接近你当前阶段。不是看看就算，要查官网、写笔记、准备志望动机和面试回答。",
      companies: focusTargets,
      tone: "blue",
    },
    {
      key: "observe",
      title: "主线观察",
      subtitle: "看行业规律，不急着投",
      intent: "这些公司用于横向理解岗位、日语、签证和工作方式。看完要么收藏，要么放弃。",
      companies: mainTargets,
      tone: "green",
    },
    {
      key: "sample",
      title: "行业样本",
      subtitle: "只用于补认知",
      intent: "不作为近期主投，只用来理解非IT行业的门槛和工作方式。",
      companies: observation,
      tone: "green",
      compact: true,
    },
    {
      key: "challenge",
      title: "挑战目标",
      subtitle: "未来可以冲，现在不主投",
      intent: "这些公司适合反推学习计划：日语、项目、算法/技术面试和业务理解都要补。",
      companies: challenge,
      tone: "amber",
      compact: true,
    },
    {
      key: "not-now",
      title: "暂不主投",
      subtitle: "先别把精力耗在这里",
      intent: "不是永远不能去，而是当前阶段成功率低。先把主线目标跑通，再回来重评。",
      companies: notNow,
      tone: "red",
      compact: true,
    },
  ];

  if (preset === "visa") {
    return lanes
      .map((lane) => ({ ...lane, companies: lane.companies.filter((company) => company.visaSupport || company.acceptsForeigners) }))
      .filter((lane) => lane.companies.length > 0);
  }

  if (preset === "growth") return lanes.filter((lane) => lane.key === "challenge" || lane.key === "main");

  return lanes;
}

function matchCompany(company: Company, keywords: string[]) {
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
  return keywords.some((keyword) => text.includes(keyword));
}

function expandQuery(raw: string) {
  const value = raw.trim().toLowerCase();
  if (!value) return [];
  const dictionary: Record<string, string[]> = {
    ai: ["ai", "人工智能", "机器学习", "数据", "算法"],
    c: ["c语言", "嵌入式", "制造", "测试", "制御"],
    c语言: ["c语言", "嵌入式", "制造", "测试", "制御"],
    工签: ["签证", "visa", "在留资格", "工签"],
    签证: ["签证", "visa", "在留资格", "工签"],
    制造: ["制造", "生产技术", "品质", "cad", "制御"],
    测试: ["测试", "qa", "品质", "検証"],
    低日语: ["n3", "n3可挑战", "低日语"],
    n3: ["n3", "n3可挑战", "低日语"],
  };
  return [value, ...(dictionary[value] ?? [])].map((item) => item.toLowerCase());
}

function DecisionRule({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-4">
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="mt-2 text-sm font-semibold leading-6 text-slate-900">{value}</div>
    </div>
  );
}

function PresetButton({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick: () => void }) {
  return (
    <button className={`h-11 rounded-md border px-3 text-sm font-semibold transition ${active ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50"}`} onClick={onClick}>
      {children}
    </button>
  );
}
