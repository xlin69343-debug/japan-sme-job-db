import Link from "next/link";
import { ArrowRight, BadgeCheck, BriefcaseBusiness, CircleAlert, MapPinned, Route, SearchCheck, UserRoundCheck } from "lucide-react";
import type { Company } from "@/lib/types";
import { CompanyMiniLink, ScoreBadge, Tag } from "./DecisionUi";

export function HomeDashboard({ companies, industryCount }: { companies: Company[]; industryCount: number }) {
  const foreignerTop = companies.filter((company) => company.acceptsForeigners).sort((a, b) => b.foreignerFriendlyScore - a.foreignerFriendlyScore).slice(0, 5);
  const lowOvertime = [...companies].sort((a, b) => a.overtimeHours - b.overtimeHours).slice(0, 5);
  const newGrad = companies.filter((company) => company.suitableForNewGrad).slice(0, 5);
  const smallCompanies = companies.filter((company) => company.employeeBand === "100人以下" || company.employeeBand === "100-300人").sort((a, b) => b.recommendationScore - a.recommendationScore).slice(0, 5);
  const riskCompanies = companies.filter((company) => company.riskTags.length > 0).slice(0, 5);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm">
          <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">日本中小企业求职决策工具</div>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            判断日本企业值不值得去
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            不只是公司列表。这里会按签证支持、日语要求、加班风险、工资水平、外国人友好度和成长性，帮助你判断这家公司适不适合新卒、转职、低日语水平和想稳定发展的人。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/profile-test" className="inline-flex h-11 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white">
              <UserRoundCheck size={17} />
              开始适合度测试
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
          <ScoreBadge label="小企业样本" value={`${companies.filter((item) => item.employeeBand === "100人以下" || item.employeeBand === "100-300人").length}家`} tone="green" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PersonaLink icon={<BadgeCheck size={20} />} title="我是新卒" body="找培训压力较低、录用入口清楚的公司" href="/companies?s=newgrad" />
        <PersonaLink icon={<BriefcaseBusiness size={20} />} title="我是转职" body="比较工资、成长性和业务含金量" href="/companies?s=career" />
        <PersonaLink icon={<UserRoundCheck size={20} />} title="日语 N3-N2" body="优先看低日语可挑战和签证支持" href="/profile-test" />
        <PersonaLink icon={<Route size={20} />} title="找小企业" body="优先看 300 人以下、职责范围更宽的企业" href="/companies?s=small" />
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <DecisionPanel title="外国人友好 Top" companies={foreignerTop} />
        <DecisionPanel title="低加班 Top" companies={lowOvertime} />
        <DecisionPanel title="小企业精选" companies={smallCompanies.length ? smallCompanies : newGrad} />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <CircleAlert size={18} className="text-amber-600" />
            <h2 className="text-lg font-semibold text-slate-950">风险提醒</h2>
          </div>
          <div className="mt-4 grid gap-3">
            {riskCompanies.map((company) => (
              <Link key={company.slug} href={`/companies/${company.slug}`} className="rounded-md border border-slate-200 p-4 hover:border-amber-300">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-950">{company.name}</div>
                    <div className="mt-1 text-xs text-slate-500">{company.industry} · 加班 {company.overtimeHours}小时/月</div>
                  </div>
                  <span className="text-sm font-semibold text-amber-700">{company.recommendationScore}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {company.riskTags.slice(0, 3).map((tag) => <Tag key={tag} tone="amber">{tag}</Tag>)}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <MapPinned size={18} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-950">下一步怎么用</h2>
          </div>
          <div className="mt-4 grid gap-3">
            {[
              ["做画像测试", "输入日语、签证、目标行业，先生成适合企业。", "/profile-test"],
              ["看企业详情", "重点看决策摘要、适合人群、风险和面试问题。", "/companies"],
              ["加入对比", "把 2-3 家候选企业放在一起看工资、加班、签证和成长性。", "/compare"],
              ["规划路线", "按低日语、拿签证、技术成长、稳定发展生成行动计划。", "/career-path"],
            ].map(([title, body, href]) => (
              <Link key={title} href={href} className="group flex items-center justify-between rounded-md bg-slate-50 p-4">
                <div>
                  <div className="font-semibold text-slate-950">{title}</div>
                  <div className="mt-1 text-sm text-slate-500">{body}</div>
                </div>
                <ArrowRight size={18} className="text-slate-400 group-hover:text-blue-600" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function PersonaLink({ icon, title, body, href }: { icon: React.ReactNode; title: string; body: string; href: string }) {
  return (
    <Link href={href} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300">
      <div className="text-blue-600">{icon}</div>
      <h2 className="mt-3 font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
    </Link>
  );
}

function DecisionPanel({ title, companies }: { title: string; companies: Company[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <div className="mt-4 grid gap-3">
        {companies.map((company) => <CompanyMiniLink key={company.slug} company={company} />)}
      </div>
    </section>
  );
}
