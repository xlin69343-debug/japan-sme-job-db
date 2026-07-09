import Link from "next/link";
import { ArrowRight, BadgeCheck, BriefcaseBusiness, Route, SearchCheck, UserRoundCheck } from "lucide-react";
import type { Company } from "@/lib/types";
import { ScoreBadge, Tag } from "./DecisionUi";

export function HomeDashboard({ companies, industryCount }: { companies: Company[]; industryCount: number }) {
  const realisticTargets = companies
    .filter((company) => company.visaSupport && (company.suitableForLowJapanese || company.suitableForNewGrad || company.industry.includes("制造") || company.industry.includes("物流")))
    .sort((a, b) => b.foreignerFriendlyScore - a.foreignerFriendlyScore)
    .slice(0, 5);
  const growthTargets = companies
    .filter((company) => company.suitableForCareerChange || company.scoreBreakdown.growth >= 8)
    .sort((a, b) => b.scoreBreakdown.growth - a.scoreBreakdown.growth)
    .slice(0, 5);
  const visaTargets = companies
    .filter((company) => company.visaSupport && company.acceptsForeigners)
    .sort((a, b) => b.foreignerFriendlyScore - a.foreignerFriendlyScore)
    .slice(0, 5);
  const smallCompanies = companies
    .filter((company) => company.employeeBand.includes("超小型") || company.employeeBand.includes("小型") || company.employeeBand.includes("成长型"))
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm">
          <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">我的个人成长求职网站</div>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            从 C 语言学习到日本就业的个人作战台
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            这里不是招聘网站，而是记录我当前背景、学习进度、公司适配、工签风险和投递状态的求职研究台。核心问题只有一个：以我现在的条件，哪些公司能研究、哪些公司够得着、我还缺什么、下一步做什么。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/student-fit" className="inline-flex h-11 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white">
              <UserRoundCheck size={17} />
              看我能投哪些公司
            </Link>
            <Link href="/dashboard" className="inline-flex h-11 items-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-800">
              <UserRoundCheck size={17} />
              打开个人工作台
            </Link>
            <Link href="/favorites" className="inline-flex h-11 items-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-800">
              <SearchCheck size={17} />
              管理候选清单
            </Link>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <ScoreBadge label="当前阶段" value="准备期" />
          <ScoreBadge label="技术主线" value="C语言" tone="green" />
          <ScoreBadge label="个人主线池" value="10-20家" tone="amber" />
          <ScoreBadge label="原始研究库" value={`${companies.length}家 / ${industryCount}类`} tone="green" />
        </div>
      </section>

      <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">我的当前定位</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            24岁，专科学历，大学学过 Web 但现在基本忘记，正在重新学 C 语言。130家公司不是我要全部投的目标，而是用来做对照和排除的原始研究库。真正需要我长期盯住的，应该是10-20家现实目标。
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["现在重点", "建立C语言项目和日语表达"],
            ["优先公司", "培训明确、签证可确认、日语压力可控"],
            ["暂不主攻", "顶级AI研究岗、算法门槛极高公司"],
            ["下一步", "从130家里收敛出10-20家主线目标"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md bg-slate-50 p-4">
              <div className="text-xs font-semibold text-slate-500">{label}</div>
              <div className="mt-2 text-sm font-semibold leading-6 text-slate-900">{value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">今天从哪里开始</h2>
            <p className="mt-2 text-sm text-slate-500">不从海量列表开始，而是从我当前最需要回答的问题开始。</p>
          </div>
          <Link href="/student-fit" className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
            查看公司分层
          </Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["我现在真正该看哪些", "把130家拆成主线目标、观察样本、挑战目标和排除项", "/student-fit"],
            ["找现实目标公司", "优先看制造IT、测试、社内SE助理和培训明确的中小企业", "/student-fit"],
            ["查支持工签企业", "先确认能不能留下来，再比较工资和成长性", "/companies?s=visa"],
            ["补C语言项目", "把学习路线转成能写进简历的作品集", "/career-path"],
            ["管理投递进度", "把研究、收藏、准备、投递和面试复盘接起来", "/favorites"],
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

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">按我的现实距离直接判断</h2>
            <p className="mt-2 text-sm text-slate-500">每一类都对应不同的准备动作，不再把所有公司都当成“好像能投”。</p>
          </div>
          <Link href="/companies" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            看主线候选
          </Link>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <DecisionTrack
            icon={<BadgeCheck size={20} />}
            title="现在可研究"
            verdict="先建立日本求职感觉，重点看岗位语言、工签、培训和真实工作内容。"
            bestFor={["入门研究", "签证可确认", "岗位门槛可拆解"]}
            watchOut={["是否真招未经验", "日语沟通量", "研修后配属"]}
            companies={smallCompanies}
            primaryHref="/student-fit"
            secondaryHref="/career-path"
          />
          <DecisionTrack
            icon={<BriefcaseBusiness size={20} />}
            title="6-12个月现实目标"
            verdict="最适合作为主线候选：补C语言项目、日语表达和面试材料后，有机会进入投递池。"
            bestFor={["制造IT", "测试/运维", "培训明确"]}
            watchOut={["学历筛选", "客户现场", "加班波动"]}
            companies={realisticTargets}
            primaryHref="/student-fit"
            secondaryHref="/favorites"
          />
          <DecisionTrack
            icon={<UserRoundCheck size={20} />}
            title="签证优先候选"
            verdict="对留学生来说，工签可持续性是第一层门槛。先看外国人案例，再看岗位成长。"
            bestFor={["支持工签", "外国人案例", "沟通压力可确认"]}
            watchOut={["日语证明风险", "雇佣形态", "签证更新责任"]}
            companies={visaTargets}
            primaryHref="/companies?s=visa"
            secondaryHref="/favorites"
          />
          <DecisionTrack
            icon={<Route size={20} />}
            title="挑战目标"
            verdict="可以研究，但不建议现在主投。它们更适合在日语、项目和基础工作经验补上之后冲。"
            bestFor={["成长快", "技术含金量", "未来转职价值"]}
            watchOut={["技术面试", "N2以上表达", "竞争强度"]}
            companies={growthTargets}
            primaryHref="/companies?s=growth"
            secondaryHref="/career-path"
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
