import type { Company } from "@/lib/types";
import { DecisionSummary, Tag } from "./DecisionUi";
import { CareerReadinessPanel, PersonalResearchPanel } from "./PersonalCareerTools";

export function DetailBlocks({ company }: { company: Company }) {
  return (
    <div className="grid gap-6">
      <OverviewPanel company={company} />
      <DecisionSummary company={company} />
      <CareerReadinessPanel company={company} />
      <PersonalResearchPanel company={company} />

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Panel title="为什么推荐">
          <ul className="grid gap-3 text-sm leading-6 text-slate-700">
            {recommendReasons(company).map((item) => (
              <li key={item} className="rounded-md bg-emerald-50 p-3 text-emerald-800">⭐ {item}</li>
            ))}
          </ul>
        </Panel>
        <Panel title="需要注意">
          <ul className="grid gap-3 text-sm leading-6 text-slate-700">
            {cautionPoints(company).map((item) => (
              <li key={item} className="rounded-md bg-amber-50 p-3 text-amber-800">⚠ {item}</li>
            ))}
          </ul>
        </Panel>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel title="评分拆解">
          <div className="grid gap-3">
            <BlockScore label="工作环境" value={company.scoreBreakdown.workLifeBalance} />
            <BlockScore label="成长空间" value={company.scoreBreakdown.growth} />
            <BlockScore label="薪资竞争力" value={company.scoreBreakdown.salary} />
            <BlockScore label="外国人友好度" value={company.scoreBreakdown.foreignerFriendliness} />
            <BlockScore label="稳定性" value={company.scoreBreakdown.stability} />
          </div>
        </Panel>
        <Panel title="适合与不适合">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-emerald-700">适合的人</h3>
              <ul className="mt-2 grid gap-2 text-sm leading-6 text-slate-700">
                {company.suitedFor.map((item) => <li key={item}>- {item}</li>)}
                {company.suitableForNewGrad && <li>- 新卒或第二新卒可作为候选</li>}
                {company.suitableForCareerChange && <li>- 转职者可用经验换取岗位匹配</li>}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-red-700">不适合的人</h3>
              <ul className="mt-2 grid gap-2 text-sm leading-6 text-slate-700">
                {company.notSuitedFor.map((item) => <li key={item}>- {item}</li>)}
                {!company.suitableForLowJapanese && <li>- 日语沟通压力承受度低的人</li>}
              </ul>
            </div>
          </div>
        </Panel>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <InfoPanel title="基础信息" items={[
          ["公司名称", company.name],
          ["行业分类", company.industry],
          ["所在地", company.location],
          ["员工人数", company.employees],
          ["成立时间", company.founded],
          ["官网", company.website],
          ["主要业务", company.mainBusiness],
        ]} />
        <InfoPanel title="薪资待遇" items={[
          ["工资区间", company.salaryRange],
          ["应届薪资", company.newGradSalary],
          ["中途薪资", company.midCareerSalary],
          ["奖金制度", company.bonus],
          ["涨薪制度", company.raiseSystem],
          ["福利待遇", company.benefits.join("、")],
          ["交通费/住房", `${company.transportAllowance}；${company.housingAllowance}`],
        ]} />
        <InfoPanel title="工作方式" items={[
          ["工作时间", company.workHours],
          ["工作方式", company.remoteWork],
          ["平均加班", company.overtime],
          ["休假制度", company.restSystem],
          ["轮班/夜班", `${company.shiftWork ? "有轮班" : "通常无轮班"}；${company.nightShift ? "可能夜班" : "通常无夜班"}`],
          ["弹性/副业", `${company.flexibleWork ? "弹性较多" : "弹性较少"}；${company.sideJob}`],
          ["服装要求", company.dressCode],
        ]} />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Panel title="外国人适配">
          <div className="grid gap-3 text-sm leading-6 text-slate-700">
            <Item label="日语要求" value={company.japaneseLevel} />
            <Item label="是否接受外国人" value={company.acceptsForeigners ? "接受可能性较高" : "公开案例较少，需提前确认"} />
            <Item label="签证支持" value={company.visaSupport ? "支持或有机会支持" : "公开信息有限，需确认"} />
            <Item label="外国员工案例" value={company.foreignEmployeeCases} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {company.matchTags.map((tag) => <Tag key={tag} tone="blue">{tag}</Tag>)}
          </div>
        </Panel>
        <Panel title="岗位与技能">
          <div className="grid gap-3 text-sm leading-6 text-slate-700">
            <Item label="招聘岗位" value={company.hiringPositions.join("、")} />
            <Item label="技术栈/业务技能" value={company.requiredSkills.join("、")} />
            <Item label="学历要求" value={company.educationRequirement} />
            <Item label="新卒/中途" value={company.hiringType} />
          </div>
        </Panel>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Panel title="员工评价">
          <div className="grid gap-3">
            <Item label="优点" value={company.reviewSummary.pros.join("、")} />
            <Item label="缺点" value={company.reviewSummary.cons.join("、")} />
            <Item label="工作氛围" value={company.reviewSummary.atmosphere} />
            <Item label="管理风格" value={company.reviewSummary.managementStyle} />
            <Item label="加班评价" value={company.reviewSummary.overtimeReview} />
            <Item label="离职原因" value={company.reviewSummary.leavingReasons.join("、")} />
          </div>
        </Panel>
        <Panel title="面试信息">
          <div className="grid gap-3">
            <Item label="面试流程" value={company.interviewInfo.rounds} />
            <Item label="笔试/编码测试" value={`${company.interviewInfo.writtenTest}；${company.interviewInfo.codingTest}`} />
            <Item label="日语/外国人难度" value={`${company.interviewInfo.japaneseInterviewDifficulty}；${company.interviewInfo.foreignerInterviewDifficulty}`} />
            <div>
              <div className="text-xs font-semibold text-slate-500">常见问题</div>
              <ul className="mt-2 grid gap-2 text-sm leading-6 text-slate-700">
                {company.interviewInfo.questions.map((question) => <li key={question}>- {question}</li>)}
              </ul>
            </div>
          </div>
        </Panel>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Panel title="风险分析">
          <RiskMatrix company={company} />
          <div className="grid gap-3">
            <Item label="黑企业风险" value={company.riskAnalysis.blackCompanyRisk} />
            <Item label="加班风险" value={company.riskAnalysis.overtimeRisk} />
            <Item label="离职率风险" value={company.riskAnalysis.turnoverRisk} />
            <Item label="薪资偏低风险" value={company.riskAnalysis.lowSalaryRisk} />
            <Item label="外国人适配风险" value={company.riskAnalysis.foreignerFitRisk} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {company.riskTags.length === 0 ? <Tag tone="green">暂无明显高风险标签</Tag> : company.riskTags.map((tag) => <Tag key={tag} tone="amber">{tag}</Tag>)}
          </div>
        </Panel>
        <Panel title="AI 总结">
          <p className="text-sm leading-7 text-slate-700">{company.aiSummary}</p>
          <div className="mt-4 rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            资料口径：OpenWork、転職会議、Glassdoor、Wantedly、Google Maps 等公开评价摘要仅用于求职判断，不替代正式尽调。
          </div>
        </Panel>
      </section>
    </div>
  );
}

function OverviewPanel({ company }: { company: Company }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(6,1fr)]">
        <div>
          <div className="text-xs font-semibold text-blue-700">企业概览</div>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">{company.name}</h2>
          <p className="mt-2 text-sm text-slate-500">{company.industry} · {company.location} · {company.employees}</p>
        </div>
        <OverviewMetric label="推荐指数" value={`${company.recommendationScore}/10`} strong />
        <OverviewMetric label="外国人友好度" value={`${company.foreignerFriendlyScore}/10`} />
        <OverviewMetric label="工签友好度" value={company.visaSupport ? "高" : "需确认"} />
        <OverviewMetric label="成长空间" value={`${company.scoreBreakdown.growth}/10`} />
        <OverviewMetric label="面试难度" value={company.interviewInfo.difficulty} />
        <OverviewMetric label="工作强度" value={company.overtimeHours > 30 ? "高" : company.overtimeHours > 18 ? "中" : "低"} />
      </div>
    </section>
  );
}

function OverviewMetric({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`rounded-md p-3 ${strong ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-900"}`}>
      <div className={`text-xs ${strong ? "text-blue-100" : "text-slate-500"}`}>{label}</div>
      <div className="mt-2 text-lg font-semibold">{value}</div>
    </div>
  );
}

function BlockScore({ label, value }: { label: string; value: number }) {
  const count = Math.max(1, Math.min(5, Math.round(value / 2)));
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-slate-50 p-3">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className="font-mono text-sm text-blue-700" aria-label={`${label} ${value}/10`}>
        {"■".repeat(count)}{"□".repeat(5 - count)}
      </span>
    </div>
  );
}

function RiskMatrix({ company }: { company: Company }) {
  const risks = [
    ["日语风险", company.japaneseLevel.includes("N1") ? "高" : company.suitableForLowJapanese ? "低" : "中"],
    ["工签风险", company.visaSupport ? "低" : "中"],
    ["面试风险", company.interviewInfo.difficulty.includes("高") ? "高" : company.interviewInfo.difficulty.includes("中") ? "中" : "低"],
    ["技术风险", company.industry.includes("IT") || company.industry.includes("AI") || company.requiredSkills.length > 4 ? "中" : "低"],
    ["工作强度风险", company.overtimeHours > 30 || company.shiftWork ? "高" : company.overtimeHours > 18 ? "中" : "低"],
  ];

  return (
    <div className="mb-4 grid gap-2 sm:grid-cols-2">
      {risks.map(([label, level]) => (
        <div key={label} className="flex items-center justify-between rounded-md bg-slate-50 p-3 text-sm">
          <span className="font-medium text-slate-700">{label}</span>
          <RiskLevel level={level} />
        </div>
      ))}
    </div>
  );
}

function RiskLevel({ level }: { level: string }) {
  const tone = level === "高" ? "bg-red-50 text-red-700" : level === "中" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700";
  const mark = level === "高" ? "🔴" : level === "中" ? "🟡" : "🟢";
  return <span className={`rounded-md px-2 py-1 text-xs font-semibold ${tone}`}>{mark}{level}</span>;
}

function recommendReasons(company: Company) {
  return [
    company.acceptsForeigners ? "外国人录用可能性较高，适合作为优先候选。" : "可作为挑战候选，但需要先确认外国人录用经验。",
    company.visaSupport ? "工签支持可期待，适合需要在留资格支持的人。" : "适合签证问题已经稳定或能提前确认的人。",
    company.overtimeHours <= 20 ? "加班时间相对可控，工作生活平衡较好。" : "能较早接触业务和现场问题，成长速度可能更快。",
    company.scoreBreakdown.growth >= 8 ? "成长空间较高，适合想积累可迁移经验的人。" : "业务边界较清楚，适合稳扎稳打积累经验。",
    company.matchTags.includes("小企业") || company.matchTags.includes("超小团队") ? "团队规模较小，职责范围更宽，能更快看到业务全貌。" : "组织规模较大，制度和岗位分工相对清楚。",
  ].slice(0, 5);
}

function cautionPoints(company: Company) {
  const base = company.riskTags.length > 0 ? company.riskTags : ["制度执行和配属情况需面试确认"];
  return [
    ...base,
    company.japaneseLevel.includes("N1") ? "面试和入社后沟通可能偏重日语读写。" : "即使低日语可挑战，也要准备日语自我介绍和业务表达。",
    company.shiftWork ? "存在轮班或排班，需确认休假和夜班频率。" : "实际加班会随项目、客户或繁忙期波动。",
    "投递前建议确认固定残业、试用期、签证更新责任和评价制度。",
  ].slice(0, 5);
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function InfoPanel({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <Panel title={title}>
      <div className="grid gap-3">
        {items.map(([label, value]) => <Item key={label} label={label} value={value} />)}
      </div>
    </Panel>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="mt-1 text-sm leading-6 text-slate-800">{value}</div>
    </div>
  );
}
