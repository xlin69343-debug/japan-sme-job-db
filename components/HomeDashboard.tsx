import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert, Target } from "lucide-react";
import type { Company } from "@/lib/types";
import { ScoreBadge, Tag } from "./DecisionUi";

export function HomeDashboard({ companies }: { companies: Company[]; industryCount: number }) {
  const focusCompanies = buildFocusCompanies(companies);
  const observeCompanies = buildObserveCompanies(companies, focusCompanies).slice(0, 6);

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
          <div className="flex items-center gap-2">
            <Target size={18} className="text-blue-700" />
            <h2 className="text-xl font-semibold text-slate-950">本周最重要的事</h2>
          </div>
          <div className="mt-4 grid gap-3">
            {[
              ["1", "完成一个C语言文件管理小项目", "能写进简历，比继续看公司更重要。"],
              ["2", "只研究5家主线公司", "查官网、岗位、签证、日语要求，不再漫游130家。"],
              ["3", "写一版日语自我介绍", "围绕“为什么从Web转向C/制造IT”准备。"],
            ].map(([index, title, body]) => (
              <div key={index} className="rounded-md bg-white/80 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-600 text-sm font-semibold text-white">{index}</span>
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
                  <Tag tone={company.visaSupport ? "green" : "amber"}>{company.visaSupport ? "签证可期待" : "签证需确认"}</Tag>
                </div>
              </Link>
            ))}
          </div>
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
      const routeFit = company.industry.includes("制造") || company.industry.includes("IT") || company.hiringPositions.join("").includes("测试") || company.hiringPositions.join("").includes("社内");
      const supportFit = company.visaSupport || company.acceptsForeigners || company.suitableForLowJapanese || company.suitableForNewGrad;
      const tooHard = ["preferred-networks", "pksha", "abeja", "smartnews"].includes(company.slug) || company.interviewInfo.difficulty === "高";
      return routeFit && supportFit && !tooHard;
    })
    .sort((a, b) => Number(b.visaSupport) - Number(a.visaSupport) || a.overtimeHours - b.overtimeHours || b.foreignerFriendlyScore - a.foreignerFriendlyScore)
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
