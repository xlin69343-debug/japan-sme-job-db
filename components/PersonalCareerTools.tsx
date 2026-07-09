"use client";

import Link from "next/link";
import { CheckCircle2, ClipboardList, Star, Target, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Company } from "@/lib/types";
import { Tag } from "./DecisionUi";

export const statusOptions = ["未研究", "研究中", "感兴趣", "重点关注", "准备投递", "已投递", "面试中", "已放弃"] as const;

const statusKey = "companyStatuses";
const recentKey = "recentCompanies";
const researchKey = (slug: string) => `research:${slug}`;

type Status = (typeof statusOptions)[number];

type ResearchState = {
  liked: string;
  disliked: string;
  worthApplying: string;
  reevaluateDate: string;
  notes: string;
  progress: string[];
  actions: string[];
};

const progressSteps = ["已研究", "已收藏", "准备中", "已投递", "一面", "二面", "终面", "Offer", "入职"];

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(localStorage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function CompanyStatusSelect({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const [status, setStatus] = useState<Status>("未研究");

  useEffect(() => {
    const statuses = readJson<Record<string, Status>>(statusKey, {});
    setStatus(statuses[slug] || "未研究");
  }, [slug]);

  const updateStatus = (next: Status) => {
    const statuses = readJson<Record<string, Status>>(statusKey, {});
    const updated = { ...statuses, [slug]: next };
    writeJson(statusKey, updated);
    setStatus(next);
    window.dispatchEvent(new Event("career-storage-change"));
  };

  return (
    <label className={`grid gap-1 ${compact ? "text-[11px]" : "text-xs"} font-semibold text-slate-500`}>
      我的状态
      <select
        className={`${compact ? "h-9" : "h-10"} rounded-md border border-slate-200 bg-white px-2 text-sm font-semibold text-slate-800 transition focus:border-blue-500 focus:outline-none`}
        value={status}
        onChange={(event) => updateStatus(event.currentTarget.value as Status)}
      >
        {statusOptions.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
    </label>
  );
}

export function TrackCompanyView({ slug }: { slug: string }) {
  useEffect(() => {
    const current = readJson<string[]>(recentKey, []);
    const next = [slug, ...current.filter((item) => item !== slug)].slice(0, 8);
    writeJson(recentKey, next);
    window.dispatchEvent(new Event("career-storage-change"));
  }, [slug]);

  return null;
}

export function PersonalHomePanel({ companies }: { companies: Company[] }) {
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [recent, setRecent] = useState<string[]>([]);

  const refresh = () => {
    setStatuses(readJson<Record<string, Status>>(statusKey, {}));
    setRecent(readJson<string[]>(recentKey, []));
  };

  useEffect(() => {
    refresh();
    window.addEventListener("career-storage-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("career-storage-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const todayCompany = useMemo(() => {
    const date = new Date();
    const daySeed = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
    return companies[daySeed % companies.length];
  }, [companies]);

  const focusCompanies = ["重点关注", "准备投递", "已投递", "面试中"]
    .flatMap((status) => Object.entries(statuses).filter(([, value]) => value === status).map(([slug]) => slug))
    .map((slug) => companies.find((company) => company.slug === slug))
    .filter(Boolean) as Company[];
  const recentCompanies = recent.map((slug) => companies.find((company) => company.slug === slug)).filter(Boolean) as Company[];

  return (
    <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Star size={18} className="text-blue-600" />
          <h2 className="text-lg font-semibold text-slate-950">今日研究对象</h2>
        </div>
        <Link href={`/companies/${todayCompany.slug}`} className="mt-4 block rounded-lg bg-blue-50 p-4 transition hover:bg-blue-100">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-xl font-semibold text-slate-950">{todayCompany.name}</div>
              <p className="mt-2 text-sm leading-6 text-slate-700">{todayCompany.decisionSummary}</p>
            </div>
            <span className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white">研究优先度 {Math.round(todayCompany.recommendationScore * 10)}%</span>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {todayReasons(todayCompany).map((reason) => (
              <div key={reason} className="rounded-md bg-white/70 px-3 py-2 text-xs font-semibold text-blue-800">{reason}</div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {todayCompany.matchTags.slice(0, 4).map((tag) => <Tag key={tag} tone="blue">{tag}</Tag>)}
          </div>
        </Link>
      </div>

      <div className="grid gap-5">
        <PersonalList title="最近浏览" empty="还没有浏览记录。先从一个方向开始研究。" companies={recentCompanies} showStarter />
        <PersonalList title="我的重点关注" empty="把企业状态改成“重点关注”或“准备投递”，这里就会变成你的优先清单。" companies={focusCompanies.slice(0, 5)} />
      </div>
    </section>
  );
}

function PersonalList({ title, empty, companies, showStarter = false }: { title: string; empty: string; companies: Company[]; showStarter?: boolean }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <div className="mt-3 grid gap-2">
        {companies.length === 0 ? (
          <div className="rounded-md bg-slate-50 p-3">
            <p className="text-sm leading-6 text-slate-500">{empty}</p>
            {showStarter && (
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/companies?q=AI" className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-blue-700">AI企业</Link>
                <Link href="/companies?s=foreigner" className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-blue-700">外国人友好</Link>
                <Link href="/companies?s=visa" className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-blue-700">支持工签</Link>
              </div>
            )}
          </div>
        ) : companies.map((company) => (
          <Link key={company.slug} href={`/companies/${company.slug}`} className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2 text-sm hover:text-blue-700">
            <span className="truncate font-semibold">{company.name}</span>
            <span className="shrink-0 text-xs text-slate-500">{company.recommendationScore}/10</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function todayReasons(company: Company) {
  return [
    company.region === "关东" ? "东京/关东机会较多" : `${company.region}地区候选`,
    company.industry.includes("AI") || company.industry.includes("IT") ? "技术/AI方向" : company.industry,
    company.acceptsForeigners ? "有外国人录用可能性" : "需确认外国人案例",
    company.visaSupport ? "工签支持可期待" : "签证需提前确认",
  ];
}

export function CareerReadinessPanel({ company }: { company: Company }) {
  const gate = readinessGate(company);
  const readiness = Math.max(35, Math.min(gate.cap, Math.round(
    company.foreignerFriendlyScore * 4 +
    (company.visaSupport ? 10 : 0) +
    (company.suitableForLowJapanese ? 8 : 0) +
    (company.overtimeHours <= 20 ? 6 : 2) +
    company.scoreBreakdown.growth * 1.6 -
    gate.penalty
  )));
  const missing = buildMissingItems(company);
  const current = company.suitableForLowJapanese ? ["基础日语", "简历初稿", "行业兴趣"] : ["N2以上日语", "岗位经验", "职务经历书"];
  const target = buildTargetSkills(company);
  const gap = [...gate.gaps, ...missing, company.industry.includes("IT") || company.industry.includes("AI") ? "技术面试表达" : "行业案例表达"].slice(0, 4);

  return (
    <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-blue-600" />
          <h2 className="text-xl font-semibold text-slate-950">当前准备度</h2>
        </div>
        <div className="mt-5">
          <div className="flex items-end justify-between">
            <span className="text-4xl font-semibold text-slate-950">{readiness}%</span>
            <span className="text-sm text-slate-500">预计准备时间：{gate.prepTime || (readiness >= 75 ? "1-3个月" : readiness >= 60 ? "3-6个月" : "6个月以上")}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-blue-600 transition-all duration-700" style={{ width: `${readiness}%` }} />
          </div>
        </div>
        <div className="mt-5 grid gap-2">
          {missing.map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-md bg-slate-50 p-3 text-sm text-slate-700">
              <span className="h-4 w-4 rounded border border-slate-300 bg-white" />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-blue-600" />
          <h2 className="text-xl font-semibold text-slate-950">能力差距分析</h2>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <SkillColumn title="当前能力" items={current} tone="slate" />
          <SkillColumn title="目标能力" items={target} tone="blue" />
          <SkillColumn title="差距能力" items={gap} tone="amber" />
        </div>
      </div>
    </section>
  );
}

function readinessGate(company: Company) {
  if (company.slug === "preferred-networks") {
    return { cap: 66, penalty: 18, prepTime: "6-12个月", gaps: ["算法/机器学习深度", "研究实现或高质量项目", "技术面试难"] };
  }
  if (company.slug === "pksha") {
    return { cap: 72, penalty: 13, prepTime: "6-12个月", gaps: ["NLP/AI产品经验", "技术面试准备"] };
  }
  if (company.slug === "abeja") {
    return { cap: 78, penalty: 8, prepTime: "3-6个月", gaps: ["AI/DX项目表达", "客户课题理解"] };
  }
  const hard = company.industry.includes("IT") || company.industry.includes("AI") || company.scoreBreakdown.businessValue >= 8.4;
  return { cap: hard ? 84 : 90, penalty: hard ? 5 : 0, prepTime: "", gaps: hard ? ["作品集质量", "技术问答准备"] : [] };
}

export function PersonalResearchPanel({ company }: { company: Company }) {
  const defaultActions = buildNextActions(company);
  const initialState: ResearchState = {
    liked: "",
    disliked: "",
    worthApplying: "待判断",
    reevaluateDate: "",
    notes: "",
    progress: [],
    actions: defaultActions.slice(0, 4),
  };
  const [state, setState] = useState<ResearchState>(initialState);

  useEffect(() => {
    setState({ ...initialState, ...readJson<Partial<ResearchState>>(researchKey(company.slug), {}) });
  }, [company.slug]);

  const update = (patch: Partial<ResearchState>) => {
    const next = { ...state, ...patch };
    setState(next);
    writeJson(researchKey(company.slug), next);
  };

  const toggleList = (key: "progress" | "actions", item: string) => {
    const list = state[key];
    update({ [key]: list.includes(item) ? list.filter((value) => value !== item) : [...list, item] });
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ClipboardList size={18} className="text-blue-600" />
          <h2 className="text-xl font-semibold text-slate-950">个人研究空间</h2>
        </div>
        <CompanyStatusSelect slug={company.slug} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="grid gap-4">
          <TextArea label="我的笔记" value={state.notes} onChange={(notes) => update({ notes })} placeholder="记录官网信息、OB/OG访谈、面试确认点、个人直觉。" />
          <div className="grid gap-3 md:grid-cols-2">
            <TextArea label="为什么喜欢" value={state.liked} onChange={(liked) => update({ liked })} placeholder="例如：签证支持、成长性、地点合适。" />
            <TextArea label="为什么不喜欢" value={state.disliked} onChange={(disliked) => update({ disliked })} placeholder="例如：加班不确定、日语压力高。" />
          </div>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-1 text-xs font-semibold text-slate-500">
            是否值得投
            <select className="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800" value={state.worthApplying} onChange={(event) => update({ worthApplying: event.currentTarget.value })}>
              {["待判断", "值得研究", "准备投递", "暂不投递", "放弃"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-xs font-semibold text-slate-500">
            重新评估日期
            <input className="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800" type="date" value={state.reevaluateDate} onChange={(event) => update({ reevaluateDate: event.currentTarget.value })} />
          </label>

          <Checklist title="求职进度追踪" items={progressSteps} selected={state.progress} onToggle={(item) => toggleList("progress", item)} />
          <Checklist title="下一步行动" items={defaultActions} selected={state.actions} onToggle={(item) => toggleList("actions", item)} />
        </div>
      </div>
    </section>
  );
}

function SkillColumn({ title, items, tone }: { title: string; items: string[]; tone: "slate" | "blue" | "amber" }) {
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

function TextArea({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-xs font-semibold text-slate-500">
      {label}
      <textarea className="min-h-28 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white" value={value} placeholder={placeholder} onChange={(event) => onChange(event.currentTarget.value)} />
    </label>
  );
}

function Checklist({ title, items, selected, onToggle }: { title: string; items: string[]; selected: string[]; onToggle: (item: string) => void }) {
  return (
    <div>
      <div className="text-xs font-semibold text-slate-500">{title}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => {
          const active = selected.includes(item);
          return (
            <button key={item} className={`inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm transition active:scale-95 ${active ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600 hover:border-blue-200"}`} onClick={() => onToggle(item)}>
              {active ? <CheckCircle2 size={15} /> : <span className="h-[15px] w-[15px] rounded-full border border-slate-300" />}
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function buildMissingItems(company: Company) {
  return [
    company.suitableForLowJapanese ? "把日语面试回答练到可稳定复述" : "补足N2级业务沟通和日语证明",
    company.industry.includes("IT") || company.industry.includes("AI") ? "完成可展示作品集或GitHub项目" : "准备该行业的志望动机和现场案例",
    company.visaSupport ? "准备签证状态说明" : "面试前确认签证支持可能性",
    "准备3个追问：加班、配属、外国员工案例",
  ];
}

function buildTargetSkills(company: Company) {
  const base = [company.japaneseLevel, company.requiredSkills[0] || "岗位基础技能", "日本职场沟通"];
  if (company.industry.includes("IT") || company.industry.includes("AI")) return [...base, "项目作品集"];
  if (company.shiftWork) return [...base, "轮班适应与客户应对"];
  return [...base, "行业理解"];
}

function buildNextActions(company: Company) {
  return [
    company.suitableForLowJapanese ? "准备日语自我介绍和志望动机" : "强化敬语、业务说明和逆質問",
    company.industry.includes("IT") || company.industry.includes("AI") ? "完成一个相关作品集项目" : "整理该行业3个真实案例",
    "确认签证支持、试用期和固定残业",
    "准备常见面试问题答案",
    "3个月后重新评估是否投递",
  ];
}
