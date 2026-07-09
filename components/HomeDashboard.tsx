"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert, Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Company } from "@/lib/types";
import { ScoreBadge, Tag } from "./DecisionUi";

const focusKey = "focusCompanies";
const todayTaskKey = "todayTaskDone";

export function HomeDashboard({ companies }: { companies: Company[]; industryCount: number }) {
  const [manualFocus, setManualFocus] = useState<string[]>([]);
  const [taskDone, setTaskDone] = useState(false);

  useEffect(() => {
    setManualFocus(readJson<string[]>(focusKey, []));
    setTaskDone(localStorage.getItem(todayTaskKey) === "true");
  }, []);

  const focusCompanies = useMemo(() => {
    const pinned = manualFocus.map((slug) => companies.find((company) => company.slug === slug)).filter(Boolean) as Company[];
    const fallback = buildFocusCompanies(companies).filter((company) => !manualFocus.includes(company.slug));
    return [...pinned, ...fallback].slice(0, 5);
  }, [companies, manualFocus]);
  const observeCompanies = buildObserveCompanies(companies, focusCompanies).slice(0, 6);

  const toggleTodayTask = () => {
    const next = !taskDone;
    setTaskDone(next);
    localStorage.setItem(todayTaskKey, String(next));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">今日任务</div>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          今天只做一件事：把求职往前推一步
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          我现在不是找“所有可能的公司”，而是用当前条件收敛方向：专科学历、Web基础需重建、C语言学习中、目标是在日本先拿到真实工作经验。
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ScoreBadge label="当前阶段" value="准备期" />
          <ScoreBadge label="技术主线" value="C语言" tone="green" />
          <ScoreBadge label="近期重点" value="3-5家" tone="amber" />
          <ScoreBadge label="本周动作" value="做项目" tone="green" />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-blue-700" />
              <h2 className="text-xl font-semibold text-slate-950">今日唯一任务</h2>
            </div>
            <button
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${taskDone ? "bg-emerald-600 text-white" : "bg-white text-blue-700 hover:bg-blue-100"}`}
              onClick={toggleTodayTask}
            >
              {taskDone ? "今日已推进" : "标记完成"}
            </button>
          </div>
          <div className="mt-4 grid gap-3">
            {[
              ["任务", "完成一个C语言文件管理小项目 v1", "比继续看公司更重要。它是你证明“我能做技术”的第一块证据。"],
              ["完成标准", "能在面试中用日语解释项目功能", "文件读取、增删改查、错误处理、为什么这样设计。"],
              ["关联公司", "制造IT / 测试 / 社内SE助理", "这些岗位不一定要你很强，但要看到你真的开始动手。"],
            ].map(([index, title, body]) => (
              <div key={index} className="rounded-md bg-white/80 p-4">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 rounded-md bg-blue-600 px-2 py-1 text-xs font-semibold text-white">{index}</span>
                  <div>
                    <div className="font-semibold text-slate-950">{title}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">3-5家重点准备公司</h2>
              <p className="mt-2 text-sm text-slate-500">先只盯这些。每家都要能说清：为什么适合我、我缺什么、下一步做什么。</p>
            </div>
            <Link href="/companies" className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white">看主线候选</Link>
          </div>
          <div className="mt-4 grid gap-2">
            {focusCompanies.map((company, index) => (
              <Link key={company.slug} href={`/companies/${company.slug}`} className="rounded-md border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-300 hover:bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-950">{index + 1}. {company.name}</div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{company.industry} · {company.region} · {company.japaneseLevel}</p>
                  </div>
                  <Tag tone={company.visaSupport ? "blue" : "amber"}>{company.visaSupport ? "签证有线索" : "签证先确认"}</Tag>
                </div>
              </Link>
            ))}
          </div>
          {manualFocus.length > 0 && (
            <p className="mt-3 text-xs text-slate-500">已优先显示你手动固定的重点公司。</p>
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <DecisionBlock
          title="我现在能去哪"
          tone="green"
          items={["制造IT", "测试/检证", "社内SE助理", "培训明确的小型IT"]}
          href="/student-fit"
          action="看公司分层"
        />
        <DecisionBlock
          title="我现在缺什么"
          tone="amber"
          items={["C语言作品", "日语自我介绍", "志望动机", "签证确认话术"]}
          href="/career-path"
          action="看成长路线"
        />
        <DecisionBlock
          title="我先不碰什么"
          tone="red"
          items={["核心AI研究岗", "N1强依赖岗位", "无签证线索公司", "纯靠热情的投递"]}
          href="/companies?s=growth"
          action="看挑战目标"
        />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">主线观察，不急着投</h2>
            <p className="mt-2 text-sm text-slate-500">这些公司只用来建立行业感觉，不要变成本周任务。</p>
          </div>
          <Link href="/favorites" className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">投递记录</Link>
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {observeCompanies.map((company) => (
            <Link key={company.slug} href={`/companies/${company.slug}`} className="rounded-md bg-slate-50 p-3 text-sm hover:bg-blue-50">
              <div className="font-semibold text-slate-950">{company.name}</div>
              <div className="mt-1 text-xs text-slate-500">{company.industry} · {company.region}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function DecisionBlock({ title, tone, items, href, action }: { title: string; tone: "green" | "amber" | "red"; items: string[]; href: string; action: string }) {
  const toneClass = tone === "green" ? "border-emerald-200 bg-emerald-50" : tone === "amber" ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50";
  const iconClass = tone === "green" ? "text-emerald-700" : tone === "amber" ? "text-amber-700" : "text-red-700";
  return (
    <article className={`rounded-lg border p-5 ${toneClass}`}>
      <div className="flex items-center gap-2">
        {tone === "green" ? <CheckCircle2 size={18} className={iconClass} /> : <CircleAlert size={18} className={iconClass} />}
        <h2 className="font-semibold text-slate-950">{title}</h2>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => <Tag key={item} tone={tone}>{item}</Tag>)}
      </div>
      <Link href={href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
        {action}
        <ArrowRight size={15} />
      </Link>
    </article>
  );
}

function buildFocusCompanies(companies: Company[]) {
  return companies
    .filter((company) => {
      const routeText = `${company.industry} ${company.hiringPositions.join(" ")} ${company.requiredSkills.join(" ")} ${company.interviewInfo.codingTest}`;
      const routeFit = /制造|测试|検証|社内|品質|制御|通常无编码测试/.test(routeText) && !company.industry.includes("AI");
      const supportFit = company.visaSupport || company.acceptsForeigners || company.suitableForLowJapanese || company.suitableForNewGrad;
      const tooHard = ["preferred-networks", "pksha", "abeja", "smartnews", "exawizards", "brainpad", "freee", "layerx"].includes(company.slug) || company.interviewInfo.difficulty === "高";
      return routeFit && supportFit && !tooHard;
    })
    .sort((a, b) => Number(b.industry.includes("制造")) - Number(a.industry.includes("制造")) || Number(b.visaSupport) - Number(a.visaSupport) || a.overtimeHours - b.overtimeHours || b.foreignerFriendlyScore - a.foreignerFriendlyScore)
    .slice(0, 5);
}

function buildObserveCompanies(companies: Company[], focusCompanies: Company[]) {
  const focusSlugs = new Set(focusCompanies.map((company) => company.slug));
  return companies
    .filter((company) => !focusSlugs.has(company.slug))
    .filter((company) => company.visaSupport || company.acceptsForeigners)
    .sort((a, b) => b.foreignerFriendlyScore - a.foreignerFriendlyScore)
    .slice(0, 8);
}

function readJson<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
}
