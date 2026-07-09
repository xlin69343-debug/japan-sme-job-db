"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, ClipboardCheck, FileCheck2, GitCompare, GraduationCap, Route, SearchCheck, ShieldCheck, Target, UserRoundCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Company, UserProfile } from "@/lib/types";
import { calculateMatch, defaultProfile } from "@/lib/recommendation";
import { ScoreBar, Tag } from "./DecisionUi";

type Props = {
  companies: Company[];
  industries: string[];
  regions: string[];
};

const checklistKey = "careerDecisionChecklist";
const statusesKey = "companyStatuses";

const prepItems = [
  "完成日语自我介绍",
  "整理志望动机模板",
  "准备职务经历书/履历书",
  "确认在留资格与更新时间",
  "准备3个项目或工作案例",
  "整理10家优先企业",
  "准备逆質問清单",
  "记录每次面试复盘",
];

export function CareerDecisionWorkbench({ companies, industries, regions }: Props) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [doneItems, setDoneItems] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    setDoneItems(readJson<string[]>(checklistKey, []));
    setStatuses(readJson<Record<string, string>>(statusesKey, {}));
  }, []);

  const matches = useMemo(() => {
    return companies
      .map((company) => ({ company, match: calculateMatch(company, profile) }))
      .sort((a, b) => b.match.score - a.match.score)
      .slice(0, 6);
  }, [companies, profile]);

  const visaReady = Math.min(100, 34 + (profile.needsVisa ? 0 : 28) + (matches.filter(({ company }) => company.visaSupport).length * 8) + (profile.japaneseLevel === "N1" ? 14 : profile.japaneseLevel === "N2" ? 10 : 4));
  const gapScore = Math.min(100, 40 + doneItems.length * 6 + (profile.japaneseLevel === "N1" ? 18 : profile.japaneseLevel === "N2" ? 12 : 4));
  const applicationReady = Math.round((visaReady + gapScore + (matches[0]?.match.score ?? 50)) / 3);
  const activePipeline = Object.entries(statuses).filter(([, value]) => !["未研究", "已放弃"].includes(value));
  const focusCount = activePipeline.filter(([, value]) => ["重点关注", "准备投递", "已投递", "面试中"].includes(value)).length;

  const update = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => setProfile((current) => ({ ...current, [key]: value }));
  const togglePrep = (item: string) => {
    const next = doneItems.includes(item) ? doneItems.filter((value) => value !== item) : [...doneItems, item];
    setDoneItems(next);
    localStorage.setItem(checklistKey, JSON.stringify(next));
  };

  return (
    <div className="grid gap-6">
      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">Personal Career Intelligence Dashboard</div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">外国人在日本求职的一站式职业决策平台</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            围绕企业研究、职业规划、工签评估、能力差距、求职准备、投递管理六个场景，把“我能不能投、还差什么、下一步做什么”变成可执行的研究流程。
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Metric title="投递准备度" value={`${applicationReady}%`} />
            <Metric title="工签可行性" value={`${visaReady}%`} tone="green" />
            <Metric title="重点候选" value={`${focusCount}家`} tone="amber" />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">当前画像</h2>
          <div className="mt-4 grid gap-3">
            <Select label="日语水平" value={profile.japaneseLevel} options={["N1", "N2", "N3", "N4以下"]} onChange={(value) => update("japaneseLevel", value)} />
            <Select label="目标行业" value={profile.targetIndustry} options={industries} allowEmpty onChange={(value) => update("targetIndustry", value)} />
            <Select label="目标地区" value={profile.targetRegion} options={regions} allowEmpty onChange={(value) => update("targetRegion", value)} />
            <Select label="职业目标" value={profile.careerGoal} options={["稳定发展", "提高年收", "技术成长", "拿日本工作经验", "未来转大企业", "低日语压力", "拿签证优先", "工作生活平衡"]} onChange={(value) => update("careerGoal", value)} />
            <label className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
              需要工签支持
              <input type="checkbox" checked={profile.needsVisa} onChange={(event) => update("needsVisa", event.currentTarget.checked)} />
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">六大核心场景</h2>
            <p className="mt-2 text-sm text-slate-500">从研究到投递不是分散页面，而是一条连续决策链。</p>
          </div>
          <Link href="/companies" className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white">进入企业研究</Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {scenes.map((scene) => (
            <Link key={scene.title} href={scene.href} className="group rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-md bg-white p-2 text-blue-600">{scene.icon}</div>
                <ArrowRight size={17} className="text-slate-400 group-hover:text-blue-600" />
              </div>
              <h3 className="mt-3 font-semibold text-slate-950">{scene.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{scene.body}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {scene.tags.map((tag) => <Tag key={tag} tone="blue">{tag}</Tag>)}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-950">工签评估</h2>
          </div>
          <div className="mt-4 grid gap-3">
            <ScoreBar label="工签可行性" value={Math.round(visaReady / 10)} />
            <DecisionLine label="目标企业支持情况" value={`${matches.filter(({ company }) => company.visaSupport).length}/${matches.length} 家推荐企业支持或可期待`} />
            <DecisionLine label="当前优先动作" value={profile.needsVisa ? "优先筛选支持工签企业，并在面试前确认雇佣形态、试用期和更新责任。" : "可扩大候选池，但仍建议确认雇佣形态和试用期。"} />
            <DecisionLine label="风险提示" value={profile.japaneseLevel === "N3" || profile.japaneseLevel === "N4以下" ? "日语较低时，签证之外还要证明长期沟通和岗位适配。" : "日语基础较好，可以把重点转向岗位能力和公司稳定性。"} />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-950">能力差距与下一步行动</h2>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Column title="当前状态" items={[profile.japaneseLevel, profile.experience, profile.needsVisa ? "需要工签" : "签证压力较低"]} />
            <Column title="目标状态" items={[profile.careerGoal, profile.targetIndustry || "行业未锁定", profile.targetRegion || "地区未锁定"]} tone="blue" />
            <Column title="差距能力" items={buildGaps(profile, doneItems)} tone="amber" />
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <ClipboardCheck size={18} className="text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-950">求职准备清单</h2>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {prepItems.map((item) => {
              const active = doneItems.includes(item);
              return (
                <button key={item} className={`rounded-md border px-3 py-3 text-left text-sm transition active:scale-95 ${active ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200"}`} onClick={() => togglePrep(item)}>
                  {active ? "已完成： " : "待完成： "}{item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <BriefcaseBusiness size={18} className="text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-950">投递管理概览</h2>
          </div>
          <div className="mt-4 grid gap-3">
            {["研究中", "重点关注", "准备投递", "已投递", "面试中"].map((status) => (
              <div key={status} className="flex items-center justify-between rounded-md bg-slate-50 p-3">
                <span className="text-sm font-medium text-slate-700">{status}</span>
                <span className="font-semibold text-slate-950">{activePipeline.filter(([, value]) => value === status).length}家</span>
              </div>
            ))}
            <Link href="/favorites" className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 text-sm font-semibold text-white">
              管理收藏与投递
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">现在最值得研究的企业</h2>
            <p className="mt-2 text-sm text-slate-500">根据你的画像即时排序，并给出下一步动作。</p>
          </div>
          <Link href="/profile-test" className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">完整适合度测试</Link>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {matches.map(({ company, match }) => (
            <Link key={company.slug} href={`/companies/${company.slug}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-950">{company.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{company.industry} · {company.region} · {company.japaneseLevel}</p>
                </div>
                <span className="rounded-md bg-blue-600 px-2.5 py-1 text-sm font-semibold text-white">{match.score}%</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{match.score >= 80 ? "优先研究，可进入准备投递。" : match.score >= 65 ? "可以放入候选，先确认风险项。" : "暂时作为观察对象，先补能力差距。"}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(match.reasons.length ? match.reasons : [company.recommendationReason]).slice(0, 2).map((item) => <Tag key={item} tone="green">{item}</Tag>)}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

const scenes = [
  { title: "留学生适配", body: "按24岁、专科学历、Web忘记、C语言学习中的背景，分出现在能投、现实目标和挑战目标。", href: "/student-fit", icon: <GraduationCap size={18} />, tags: ["能去哪", "差距", "分层"] },
  { title: "企业研究", body: "按行业、签证、日语、加班、外国人友好度筛出值得深入研究的企业。", href: "/companies", icon: <SearchCheck size={18} />, tags: ["筛选", "风险", "对比"] },
  { title: "职业规划", body: "把当前阶段、目标能力、目标企业和准备周期连接成路线图。", href: "/career-path", icon: <Route size={18} />, tags: ["路线图", "阶段", "目标"] },
  { title: "工签评估", body: "先判断在留资格可行性，再决定是否投递和面试要确认什么。", href: "/companies?s=visa", icon: <ShieldCheck size={18} />, tags: ["工签", "在留", "风险"] },
  { title: "能力差距", body: "用日语、技能、作品集、面试表达拆出你距离目标企业的差距。", href: "/profile-test", icon: <UserRoundCheck size={18} />, tags: ["准备度", "差距", "建议"] },
  { title: "求职准备", body: "维护简历、面试、逆質問、签证说明等投递前清单。", href: "/dashboard", icon: <FileCheck2 size={18} />, tags: ["清单", "面试", "材料"] },
  { title: "投递管理", body: "追踪收藏、重点关注、准备投递、已投递和面试中的企业。", href: "/favorites", icon: <GitCompare size={18} />, tags: ["状态", "笔记", "行动"] },
];

function readJson<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
}

function Metric({ title, value, tone = "blue" }: { title: string; value: string; tone?: "blue" | "green" | "amber" }) {
  const toneClass = tone === "green" ? "bg-emerald-50 text-emerald-700" : tone === "amber" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700";
  return (
    <div className={`rounded-md p-4 ${toneClass}`}>
      <div className="text-xs font-semibold opacity-80">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function DecisionLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="mt-1 text-sm leading-6 text-slate-800">{value}</div>
    </div>
  );
}

function Column({ title, items, tone = "slate" }: { title: string; items: string[]; tone?: "slate" | "blue" | "amber" }) {
  const toneClass = tone === "blue" ? "bg-blue-50 text-blue-800" : tone === "amber" ? "bg-amber-50 text-amber-800" : "bg-slate-50 text-slate-700";
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      <div className="mt-3 grid gap-2">
        {items.map((item) => <div key={item} className={`rounded-md p-3 text-sm ${toneClass}`}>{item}</div>)}
      </div>
    </div>
  );
}

function Select({ label, value, options, allowEmpty = false, onChange }: { label: string; value: string; options: string[]; allowEmpty?: boolean; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-xs font-medium text-slate-500">
      {label}
      <select className="focus-ring h-10 rounded-md border border-slate-200 bg-slate-50 px-3" value={value} onChange={(event) => onChange(event.currentTarget.value)}>
        {allowEmpty && <option value="">不限</option>}
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function buildGaps(profile: UserProfile, doneItems: string[]) {
  const gaps = [];
  if (profile.japaneseLevel === "N3" || profile.japaneseLevel === "N4以下") gaps.push("N2与业务日语");
  if (!doneItems.includes("准备职务经历书/履历书")) gaps.push("求职材料");
  if (!doneItems.includes("准备3个项目或工作案例")) gaps.push("项目/工作案例");
  if (profile.needsVisa && !doneItems.includes("确认在留资格与更新时间")) gaps.push("签证说明");
  if (!profile.targetIndustry) gaps.push("目标行业选择");
  return gaps.length ? gaps.slice(0, 4) : ["进入投递准备", "面试复盘", "企业对比"];
}
