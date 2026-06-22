import Link from "next/link";
import { ArrowRight, BadgeCheck, BriefcaseBusiness, Route, SearchCheck, UserRoundCheck } from "lucide-react";
import type { Company } from "@/lib/types";
import { ScoreBadge, Tag } from "./DecisionUi";
import { PersonalHomePanel } from "./PersonalCareerTools";

export function HomeDashboard({ companies, industryCount }: { companies: Company[]; industryCount: number }) {
  const newGrad = companies.filter((company) => company.suitableForNewGrad).slice(0, 5);
  const careerChange = companies.filter((company) => company.suitableForCareerChange).sort((a, b) => b.scoreBreakdown.growth - a.scoreBreakdown.growth).slice(0, 5);
  const lowJapanese = companies.filter((company) => company.suitableForLowJapanese && company.visaSupport).sort((a, b) => b.foreignerFriendlyScore - a.foreignerFriendlyScore).slice(0, 5);
  const smallCompanies = companies.filter((company) => company.employeeBand.includes("超小型") || company.employeeBand.includes("小型") || company.employeeBand.includes("成长型")).sort((a, b) => b.recommendationScore - a.recommendationScore).slice(0, 5);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm">
          <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">外国人在日本求职的一站式职业决策平台</div>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            从查企业到决定下一步行动
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            不只是公司列表。这里围绕企业研究、职业规划、工签评估、能力差距分析、求职准备和投递管理，帮助你判断这家公司能不能投、距离目标还有多远、下一步该做什么。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/dashboard" className="inline-flex h-11 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white">
              <UserRoundCheck size={17} />
              打开个人工作台
            </Link>
            <Link href="/profile-test" className="inline-flex h-11 items-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-800">
              <UserRoundCheck size={17} />
              适合度测试
            </Link>
            <Link href="/companies" className="inline-flex h-11 items-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-800">
              <SearchCheck size={17} />
              浏览企业
            </Link>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <ScoreBadge label="企业数量" value={`${companies.length}家`} />
          <ScoreBadge label="行业覆盖" value={`${industryCount}类`} tone="green" />
          <ScoreBadge label="签证支持" value={`${companies.filter((item) => item.visaSupport).length}家`} tone="amber" />
          <ScoreBadge label="小企业样本" value={`${companies.filter((item) => item.employeeBand.includes("超小型") || item.employeeBand.includes("小型") || item.employeeBand.includes("成长型")).length}家`} tone="green" />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">快速开始</h2>
            <p className="mt-2 text-sm text-slate-500">先不用看完整列表，从一个明确问题进入：我现在要研究哪一类企业。</p>
          </div>
          <Link href="/companies" className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
            打开全部企业
          </Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["AI企业", "看技术含金量和作品集要求", "/companies?q=AI"],
            ["外国人友好企业", "优先确认录用历史和沟通压力", "/companies?s=foreigner"],
            ["支持工签企业", "先解决在留资格可持续性", "/companies?s=visa"],
            ["东京企业", "通勤、面试机会和行业密度更高", "/companies?region=东京"],
            ["N2推荐企业", "适合日语已有基础、想正式投递的人", "/companies?s=lowjp"],
            ["成长性企业", "看业务含金量、岗位宽度和转职价值", "/companies?s=growth"],
          ].map(([title, body, href]) => (
            <Link key={title} href={href} className="group rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-950">{title}</h3>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-blue-600" />
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
            </Link>
          ))}
        </div>
      </section>

      <PersonalHomePanel companies={companies} />

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">按你的求职阶段直接判断</h2>
            <p className="mt-2 text-sm text-slate-500">这四块不再只是入口，而是不同人群的候选池、风险和下一步动作。</p>
          </div>
          <Link href="/profile-test" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            用个人画像重新计算
          </Link>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <DecisionTrack
            icon={<BadgeCheck size={20} />}
            title="新卒 / 第二新卒"
            verdict="优先看培训入口、日语压力、配属透明度，不要只看综合分。"
            bestFor={["适合新卒", "低加班", "签证可确认"]}
            watchOut={["固定残业", "研修后配属", "转勤范围"]}
            companies={newGrad}
            primaryHref="/companies?s=newgrad"
            secondaryHref="/career-path"
          />
          <DecisionTrack
            icon={<BriefcaseBusiness size={20} />}
            title="转职 / 想提高年收"
            verdict="重点比较成长性、业务含金量和工资上限，低分但岗位对口也可以留候选。"
            bestFor={["适合转职", "成长性", "薪资较好"]}
            watchOut={["试用期条件", "评价制度", "实际职责范围"]}
            companies={careerChange}
            primaryHref="/companies?s=career"
            secondaryHref="/compare"
          />
          <DecisionTrack
            icon={<UserRoundCheck size={20} />}
            title="日语 N3-N2 / 需要签证"
            verdict="先看签证支持和外国人案例，再看工资。能不能留下来比第一年年收更重要。"
            bestFor={["N3可挑战", "外国人友好", "支持签证"]}
            watchOut={["日语日报", "客户沟通", "签证更新责任"]}
            companies={lowJapanese}
            primaryHref="/companies?s=lowjp"
            secondaryHref="/profile-test"
          />
          <DecisionTrack
            icon={<Route size={20} />}
            title="想进小企业"
            verdict="小企业适合想快速接触业务的人，但要重点确认制度成熟度和上司风格。"
            bestFor={["超小团队", "小企业", "职责范围广"]}
            watchOut={["制度不标准", "老板风格", "加班计算"]}
            companies={smallCompanies}
            primaryHref="/companies?s=small"
            secondaryHref="/map"
          />
        </div>
      </section>
    </div>
  );
}

function DecisionTrack({
  icon,
  title,
  verdict,
  bestFor,
  watchOut,
  companies,
  primaryHref,
  secondaryHref,
}: {
  icon: React.ReactNode;
  title: string;
  verdict: string;
  bestFor: string[];
  watchOut: string[];
  companies: Company[];
  primaryHref: string;
  secondaryHref: string;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-white p-2 text-blue-600">{icon}</div>
        <div>
          <h3 className="font-semibold text-slate-950">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{verdict}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <div className="text-xs font-semibold text-emerald-700">优先看</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {bestFor.map((item) => <Tag key={item} tone="green">{item}</Tag>)}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-amber-700">必须确认</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {watchOut.map((item) => <Tag key={item} tone="amber">{item}</Tag>)}
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-2">
        {companies.slice(0, 3).map((company) => (
          <Link key={company.slug} href={`/companies/${company.slug}`} className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm hover:text-blue-700">
            <span className="truncate font-medium">{company.name}</span>
            <span className="ml-3 shrink-0 text-xs text-slate-500">{company.recommendationScore}/10</span>
          </Link>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link href={primaryHref} className="rounded-md bg-slate-950 px-3 py-2 text-center text-sm font-semibold text-white">
          看候选池
        </Link>
        <Link href={secondaryHref} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-700">
          深入判断
        </Link>
      </div>
    </article>
  );
}
