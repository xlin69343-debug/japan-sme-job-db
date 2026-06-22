"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Company } from "@/lib/types";
import { Tag } from "./DecisionUi";

const goals = ["稳定发展", "提高年收", "技术成长", "拿日本工作经验", "未来转大企业", "低日语压力", "拿签证优先", "工作生活平衡"];
const levels = ["N4以下", "N3", "N2", "N1"];
const stages = ["新卒", "未经验转职", "有经验转职", "在日本打工/留学中"];

export function CareerPathTool({ companies, industries }: { companies: Company[]; industries: string[] }) {
  const [goal, setGoal] = useState("拿签证优先");
  const [level, setLevel] = useState("N2");
  const [stage, setStage] = useState("未经验转职");
  const [industry, setIndustry] = useState("");

  const recommended = useMemo(() => {
    return companies
      .filter((company) => !industry || company.industry === industry)
      .filter((company) => goal !== "拿签证优先" || company.visaSupport)
      .filter((company) => goal !== "低日语压力" || company.suitableForLowJapanese)
      .sort((a, b) => pickScore(b, goal) - pickScore(a, goal))
      .slice(0, 8);
  }, [companies, goal, industry]);

  const plan = buildPlan(goal, level, stage);

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
      <section className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-4">
        <h1 className="text-2xl font-semibold text-slate-950">AI 职业路线生成</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">先做规则型 MVP：根据目标、日语和阶段生成路线，再匹配企业。</p>
        <div className="mt-5 grid gap-3">
          <Select label="职业目标" value={goal} options={goals} onChange={setGoal} />
          <Select label="当前日语" value={level} options={levels} onChange={setLevel} />
          <Select label="当前阶段" value={stage} options={stages} onChange={setStage} />
          <Select label="目标行业" value={industry} options={industries} allowEmpty onChange={setIndustry} />
        </div>
      </section>

      <section className="grid gap-5">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">路线判断</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{plan.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {plan.tags.map((tag) => <Tag key={tag} tone="blue">{tag}</Tag>)}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <PlanCard title="3个月" items={plan.threeMonths} />
          <PlanCard title="6个月" items={plan.sixMonths} />
          <PlanCard title="12个月" items={plan.twelveMonths} />
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">推荐准备事项</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {plan.prepare.map((item) => (
              <div key={item} className="rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">{item}</div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">推荐企业</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {recommended.map((company) => (
              <Link key={company.slug} href={`/companies/${company.slug}`} className="rounded-md border border-slate-200 p-4 hover:border-blue-300">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-950">{company.name}</div>
                    <div className="mt-1 text-xs text-slate-500">{company.industry} · {company.region}</div>
                  </div>
                  <span className="font-semibold text-blue-700">{pickScore(company, goal).toFixed(1)}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{company.recommendationReason}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function pickScore(company: Company, goal: string) {
  if (goal === "稳定发展") return company.scoreBreakdown.stability;
  if (goal === "提高年收") return company.scoreBreakdown.salary;
  if (goal === "技术成长") return company.scoreBreakdown.growth;
  if (goal === "未来转大企业") return company.scoreBreakdown.businessValue;
  if (goal === "低日语压力") return company.suitableForLowJapanese ? 9 : 4;
  if (goal === "拿签证优先") return company.visaSupport ? 9 : 3;
  if (goal === "工作生活平衡") return company.scoreBreakdown.workLifeBalance;
  return company.recommendationScore;
}

function buildPlan(goal: string, level: string, stage: string) {
  const lowJapanese = level === "N4以下" || level === "N3";
  const summary = `${stage}阶段如果目标是“${goal}”，建议先把候选企业分成保底、挑战和成长三层。${lowJapanese ? "当前日语需要把面试表达、业务邮件和敬语作为第一优先。" : "当前日语可以开始更重视岗位经验、行业匹配和薪资上限。"}`;
  const prepare = [
    lowJapanese ? "准备 20 个日语面试固定回答：自我介绍、志望动机、转职理由、困难经历、签证说明。" : "准备岗位成果案例：用 STAR 法整理项目、客户、现场或运营改善经验。",
    goal.includes("签证") ? "投递前确认在留资格类型、更新支持、试用期和雇佣形态。" : "投递前确认固定残业、评价制度、调薪周期和配属范围。",
    goal.includes("技术") ? "准备作品集、GitHub、技术选型说明和故障处理案例。" : "准备行业理解、客户沟通、团队协作和长期工作意愿说明。",
    "每家公司至少记录三个问题：实际加班、外国员工案例、入社后前三个月工作内容。",
  ];
  return {
    summary,
    tags: [goal, level, stage, lowJapanese ? "日语优先" : "岗位匹配优先"],
    prepare,
    threeMonths: ["确定目标行业和保底行业", "完成日语面试模板", "整理 10 家候选企业", "补齐简历和职务经历书"],
    sixMonths: ["每周投递 5-8 家", "每次面试后复盘问题", "补充岗位技能或资格", "筛掉高加班和签证不明企业"],
    twelveMonths: ["拿到日本实务经验", "复盘薪资和成长性", "准备转向更高评分企业", "建立长期职业路线"],
  };
}

function PlanCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-950">{title}</h3>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-600">
        {items.map((item) => <li key={item}>- {item}</li>)}
      </ul>
    </div>
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
