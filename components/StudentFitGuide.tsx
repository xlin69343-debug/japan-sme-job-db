import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert, Code2, GraduationCap, Route, Target } from "lucide-react";
import type { Company } from "@/lib/types";
import { Tag } from "./DecisionUi";

type Tier = {
  title: string;
  subtitle: string;
  body: string;
  tone: "green" | "blue" | "amber" | "red";
  companies: Company[];
  requirements: string[];
  nextActions: string[];
};

export function StudentFitGuide({ companies }: { companies: Company[] }) {
  const tiers = buildTiers(companies);

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">个人公司分层</div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">130家公司不是目标清单，而是用来筛出我的路线</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          按你的当前画像：24岁、专科学历、Web学过但已忘、正在学C语言、希望在日本就业。系统会把企业拆成四层：现在可研究、现实目标、挑战目标、暂不建议。真正需要你投入精力的不是130家，而是其中10-20家现实目标和3-5家重点准备对象。
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <ProfileCard icon={<GraduationCap size={18} />} label="学历" value="专科 / 专门学校层级" />
          <ProfileCard icon={<Code2 size={18} />} label="当前技术" value="C语言学习中，Web需重建" />
          <ProfileCard icon={<Target size={18} />} label="优先方向" value="制造IT / 测试 / 社内SE助理" />
          <ProfileCard icon={<Route size={18} />} label="策略" value="先就业，再转更高层级公司" />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        {tiers.map((tier) => (
          <TierPanel key={tier.title} tier={tier} />
        ))}
      </section>

      <section className="rounded-lg border border-blue-200 bg-blue-50 p-5">
        <h2 className="text-xl font-semibold text-slate-950">个人筛选结论</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {[
            ["130家", "原始研究库，用来建立行业认知和做排除"],
            ["30家左右", "可浏览样本，用来理解日本中小企业岗位差异"],
            ["10-20家", "个人主线目标，需要收藏、做笔记、查官网"],
            ["3-5家", "近期重点准备对象，需要写志望动机和面试答案"],
          ].map(([label, body]) => (
            <div key={label} className="rounded-md bg-white/80 p-4">
              <div className="text-2xl font-semibold text-blue-700">{label}</div>
              <p className="mt-2 text-sm leading-6 text-slate-700">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <CircleAlert size={18} className="text-amber-600" />
            <h2 className="text-xl font-semibold text-slate-950">你现在不要这样选公司</h2>
          </div>
          <div className="mt-4 grid gap-3">
            {[
              ["不要只看公司名", "PFN、PKSHA、ABEJA看起来都很酷，但它们不是同一难度层。先看门槛，再看兴趣。"],
              ["不要只搜IT", "你的C语言路线更适合制造IT、嵌入式助理、测试、设备控制、社内SE助理。"],
              ["不要把N2当万能钥匙", "N2只能降低日语风险，不能替代作品、项目、面试表达和签证说明。"],
              ["不要一开始冲AI核心岗", "先用6-12个月做C项目、补日语、准备作品集，再把AI公司作为挑战目标。"],
            ].map(([title, body]) => (
              <div key={title} className="rounded-md bg-amber-50 p-3">
                <div className="font-semibold text-amber-900">{title}</div>
                <p className="mt-1 text-sm leading-6 text-amber-800">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <h2 className="text-xl font-semibold text-slate-950">你的6-12个月准备路线</h2>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Plan title="0-2个月" items={["C语言基础", "指针/结构体/文件操作", "日语面试自我介绍"]} />
            <Plan title="2-4个月" items={["2个C语言小项目", "GitHub整理", "履历书/职务经历书"]} />
            <Plan title="4-12个月" items={["投递现实目标企业", "准备测试/社内SE岗位", "挑战制造IT或嵌入式助理"]} />
          </div>
        </div>
      </section>
    </div>
  );
}

function TierPanel({ tier }: { tier: Tier }) {
  const toneClass = {
    green: "border-emerald-200 bg-emerald-50",
    blue: "border-blue-200 bg-blue-50",
    amber: "border-amber-200 bg-amber-50",
    red: "border-red-200 bg-red-50",
  }[tier.tone];

  return (
    <article className={`rounded-lg border p-4 ${toneClass}`}>
      <h2 className="text-lg font-semibold text-slate-950">{tier.title}</h2>
      <p className="mt-1 text-sm font-semibold text-slate-700">{tier.subtitle}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{tier.body}</p>

      <div className="mt-4">
        <div className="text-xs font-semibold text-slate-500">需要条件</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {tier.requirements.map((item) => <Tag key={item} tone={tier.tone === "red" ? "red" : tier.tone}>{item}</Tag>)}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs font-semibold text-slate-500">下一步</div>
        <ul className="mt-2 grid gap-1 text-sm leading-6 text-slate-700">
          {tier.nextActions.map((item) => <li key={item}>- {item}</li>)}
        </ul>
      </div>

      <div className="mt-4 grid gap-2">
        {tier.companies.slice(0, 4).map((company) => (
          <Link key={company.slug} href={`/companies/${company.slug}`} className="group rounded-md bg-white/80 p-3 text-sm transition hover:bg-white">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-slate-950">{company.name}</span>
              <ArrowRight size={14} className="text-slate-400 group-hover:text-blue-600" />
            </div>
            <div className="mt-1 text-xs text-slate-500">{company.industry} · {company.japaneseLevel} · {company.recommendationScore}/10</div>
          </Link>
        ))}
      </div>
    </article>
  );
}

function ProfileCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-blue-700">
        {icon}
        <span className="text-xs font-semibold">{label}</span>
      </div>
      <div className="mt-2 text-sm font-semibold leading-6 text-slate-900">{value}</div>
    </div>
  );
}

function Plan({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md bg-slate-50 p-4">
      <div className="font-semibold text-slate-950">{title}</div>
      <ul className="mt-2 grid gap-1 text-sm leading-6 text-slate-600">
        {items.map((item) => <li key={item}>- {item}</li>)}
      </ul>
    </div>
  );
}

function buildTiers(companies: Company[]): Tier[] {
  const reachable = companies
    .filter((company) => ["制造业", "物流 / 仓储", "零售 / 电商", "教育 / 语言学校"].some((industry) => company.industry.includes(industry)))
    .filter((company) => company.visaSupport || company.acceptsForeigners)
    .sort((a, b) => a.overtimeHours - b.overtimeHours)
    .slice(0, 8);

  const realistic = companies
    .filter((company) => company.industry.includes("IT") || company.industry.includes("制造") || company.hiringPositions.join("").includes("测试"))
    .filter((company) => !["preferred-networks", "pksha", "abeja", "smartnews"].includes(company.slug))
    .sort((a, b) => Number(b.visaSupport) - Number(a.visaSupport) || b.foreignerFriendlyScore - a.foreignerFriendlyScore)
    .slice(0, 8);

  const challenge = companies
    .filter((company) => ["abeja", "pksha", "smartnews", "preferred-networks", "exawizards", "brainpad"].includes(company.slug))
    .sort((a, b) => a.slug === "preferred-networks" ? 1 : b.recommendationScore - a.recommendationScore);

  const notYet = companies
    .filter((company) => company.interviewInfo.difficulty === "高" || company.riskTags.includes("技术面试难") || company.japaneseLevel.includes("N1"))
    .slice(0, 8);

  return [
    {
      title: "现在可研究",
      subtitle: "先建立日本求职感觉",
      body: "适合你先了解日本公司、岗位语言、工签和面试问题。不是马上乱投，而是用来学习市场。",
      tone: "green",
      companies: reachable,
      requirements: ["N3-N2", "基础日语表达", "愿意从助理/测试做起"],
      nextActions: ["打开3家公司详情", "记录工签和日语要求", "准备日语自我介绍"],
    },
    {
      title: "现实目标",
      subtitle: "6-12个月后主投",
      body: "更贴近你的C语言学习路线：制造IT、嵌入式助理、测试、社内SE助理、低门槛IT中小企业。",
      tone: "blue",
      companies: realistic,
      requirements: ["C语言2-3个项目", "N2目标", "GitHub/作品集", "能说明为什么转IT"],
      nextActions: ["做C语言项目", "补Linux/SQL基础", "收藏10家现实目标"],
    },
    {
      title: "挑战目标",
      subtitle: "不是不能去，是现在还早",
      body: "ABEJA、PKSHA、PFN、SmartNews这类公司要看项目质量、技术面试、日语/英语表达和业务理解。",
      tone: "amber",
      companies: challenge,
      requirements: ["N2以上", "项目经验", "技术面试", "准备期6-12个月"],
      nextActions: ["先研究门槛", "不要作为第一批投递", "用它们反推学习计划"],
    },
    {
      title: "暂不建议",
      subtitle: "现在投递成本高",
      body: "不是否定你，而是以当前背景投递成功率低，容易消耗信心。先补项目、日语和作品集。",
      tone: "red",
      companies: notYet,
      requirements: ["N2-N1", "强项目经历", "高竞争面试", "稳定业务表达"],
      nextActions: ["暂时不主投", "6个月后重评", "先完成现实目标路线"],
    },
  ];
}
