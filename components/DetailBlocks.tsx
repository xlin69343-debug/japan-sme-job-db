import type { Company } from "@/lib/types";
import { buildVerificationChecklist, getCurrentStage, getEvidenceBadge } from "@/lib/evidence";
import { DecisionSummary, Tag } from "./DecisionUi";
import { CareerReadinessPanel, PersonalResearchPanel } from "./PersonalCareerTools";

export function DetailBlocks({ company }: { company: Company }) {
  return (
    <div className="grid gap-6">
      <OverviewPanel company={company} />
      <DecisionSummary company={company} />
      <EvidencePanel company={company} />
      <DecisionConclusion company={company} />
      <CareerReadinessPanel company={company} />
      <PersonalResearchPanel company={company} />

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Panel title="为什么推荐">
          <ul className="grid gap-3 text-sm leading-6 text-slate-700">
            {recommendReasons(company).map((item) => (
              <li key={item} className="rounded-md bg-emerald-50 p-3 text-emerald-800">{item}</li>
            ))}
          </ul>
        </Panel>
        <Panel title="需要注意">
          <ul className="grid gap-3 text-sm leading-6 text-slate-700">
            {cautionPoints(company).map((item) => (
              <li key={item} className="rounded-md bg-amber-50 p-3 text-amber-800">{item}</li>
            ))}
          </ul>
        </Panel>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel title="评分拆解">
          <ScoringFormula company={company} />
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
          ["数据更新时间", company.updatedAt],
          ["数据来源口径", company.dataSourceNote],
          ["可信度等级", company.dataCredibility],
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
          ["加班口径", company.overtime],
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
            <Item label="日语证明风险" value={company.languageProofRisk} />
            <Item label="是否接受外国人" value={company.acceptsForeigners ? "接受可能性较高" : "公开案例较少，需提前确认"} />
            <Item label="签证支持" value={company.visaSupport ? "有支持可能，必须向HR确认" : "公开信息有限，先确认再投"} />
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
            资料口径：官网和招聘页优先用于确认业务、岗位和员工数；OpenWork、転職会議、Glassdoor、Wantedly、Google Maps 等公开评价摘要只能辅助判断，不替代正式尽调。
          </div>
          {company.sourceUrls.length > 0 && (
            <div className="mt-4">
              <div className="text-xs font-semibold text-slate-500">参考链接</div>
              <div className="mt-2 grid gap-2">
                {company.sourceUrls.map((url) => (
                  <a key={url} className="break-all rounded-md bg-slate-50 p-3 text-sm text-blue-700 hover:underline" href={url} target="_blank" rel="noreferrer">{url}</a>
                ))}
              </div>
            </div>
          )}
        </Panel>
      </section>
    </div>
  );
}

function EvidencePanel({ company }: { company: Company }) {
  const badges = [
    getEvidenceBadge(company, "business"),
    getEvidenceBadge(company, "employees"),
    getEvidenceBadge(company, "visa"),
    getEvidenceBadge(company, "salary"),
    getEvidenceBadge(company, "overtime"),
    getEvidenceBadge(company, "score"),
  ];
  const checklist = buildVerificationChecklist(company);
  const stage = getCurrentStage(company);

  return (
    <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <Panel title="数据核验状态">
        <div className="rounded-md bg-slate-50 p-4">
          <div className="text-xs font-semibold text-slate-500">当前定位</div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Tag tone={stage === "挑战目标" ? "amber" : stage === "暂不主投" ? "red" : "blue"}>{stage}</Tag>
            <span className="text-sm leading-6 text-slate-700">
              这不是企业官方推荐分，而是按你的当前阶段做的个人求职研究判断。
            </span>
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {badges.map((badge) => (
            <div key={badge.label} className="rounded-md border border-slate-100 bg-white p-3">
              <Tag tone={badge.tone}>{badge.label}</Tag>
              <p className="mt-2 text-xs leading-5 text-slate-500">{badge.detail}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="投递前核验清单">
        <div className="grid gap-3">
          {checklist.map((item) => (
            <div key={item.title} className="rounded-md bg-slate-50 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Tag tone={item.done ? "green" : "amber"}>{item.done ? "已有线索" : "必须确认"}</Tag>
                <div className="text-sm font-semibold text-slate-900">{item.title}</div>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function DecisionConclusion({ company }: { company: Company }) {
  return (
    <section className="grid gap-3 md:grid-cols-4">
      <ConclusionCard title="一句话结论" value={oneLineConclusion(company)} tone="blue" />
      <ConclusionCard title="最大优势" value={largestAdvantage(company)} tone="green" />
      <ConclusionCard title="最大风险" value={largestRisk(company)} tone="amber" />
      <ConclusionCard title="最不适合" value={company.notSuitedFor[0] || "风险承受度低的人"} tone="red" />
    </section>
  );
}

function ConclusionCard({ title, value, tone }: { title: string; value: string; tone: "blue" | "green" | "amber" | "red" }) {
  const toneClass = tone === "green" ? "bg-emerald-50 text-emerald-800" : tone === "amber" ? "bg-amber-50 text-amber-800" : tone === "red" ? "bg-red-50 text-red-800" : "bg-blue-50 text-blue-800";
  return (
    <div className={`rounded-lg p-4 ${toneClass}`}>
      <div className="text-xs font-semibold opacity-80">{title}</div>
      <p className="mt-2 text-sm leading-6 font-medium">{value}</p>
    </div>
  );
}

function oneLineConclusion(company: Company) {
  if (company.slug === "preferred-networks") return "适合N2以上、算法/机器学习基础强、有高质量项目经验的挑战型候选人。";
  if (company.slug === "abeja") return "适合N2左右、想做AI/DX落地并能理解客户课题的求职者。";
  if (company.slug === "pksha") return "适合有AI产品、NLP或机器学习项目经验，并能解释业务价值的人。";
  if (company.industry.includes("IT") || company.industry.includes("AI")) return `适合希望进入${company.industry}、具备${company.japaneseLevel}和项目经验的求职者。`;
  return `适合想在${company.industry}积累日本实务经验，并能接受${company.overtimeHours}小时/月左右加班的人。`;
}

function largestAdvantage(company: Company) {
  if (company.slug === "preferred-networks") return "AI半导体、计算基盘、生成AI基盤模型到AI解决方案的技术含金量高。";
  if (company.slug === "abeja") return "AI/DX项目落地经验明确，适合把技术和客户课题连接起来。";
  if (company.slug === "pksha") return "算法资产和AI产品化方向明确，适合AI产品/自然语言处理路线。";
  if (company.visaSupport && company.acceptsForeigners) return "外国人录用和工签支持可能性较高。";
  return company.reviewSummary.pros[0] || company.recommendationReason;
}

function largestRisk(company: Company) {
  if (company.riskTags.length > 0) return company.riskTags.join("、");
  if (company.interviewInfo.difficulty === "高") return "面试竞争和技术筛选难度高。";
  if (!company.suitableForLowJapanese) return "日语业务沟通和日语证明需要提前准备。";
  return "制度、配属、固定残业和评价方式仍需面试确认。";
}

function ScoringFormula({ company }: { company: Company }) {
  const rows = [
    ["工资水平", "20%", company.scoreBreakdown.salary, "薪资区间、工资分和行业薪资带估算"],
    ["成长空间", "25%", company.scoreBreakdown.growth, "业务含金量、技术/岗位可迁移性"],
    ["外国人友好度", "20%", company.scoreBreakdown.foreignerFriendliness, "外国人录用案例、语言环境、适配风险"],
    ["工签支持", "20%", company.visaSupport ? 8.5 : company.acceptsForeigners ? 5.8 : 3.8, "签证支持公开信息和外国人受入可能性"],
    ["工作强度", "15%", company.scoreBreakdown.workLifeBalance, "加班、轮班、远程/混合和休假制度"],
  ] as const;
  return (
    <div className="mb-4 rounded-lg border border-slate-100 bg-slate-50 p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-950">综合评分公式</div>
          <p className="mt-1 text-xs leading-5 text-slate-500">综合评分 = 工资20% + 成长25% + 外国人友好20% + 工签20% + 工作强度15%。分数只服务于你的个人筛选和复盘，不代表企业官方评价；薪资、加班、签证字段投递前必须刷新。</p>
        </div>
        <div className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white">{company.recommendationScore}/10</div>
      </div>
      <div className="mt-4 grid gap-2">
        {rows.map(([label, weight, value, source]) => (
          <div key={label} className="grid gap-2 rounded-md bg-white p-3 md:grid-cols-[90px_60px_1fr]">
            <div className="text-sm font-semibold text-slate-800">{label}</div>
            <div className="text-xs font-semibold text-blue-700">{weight}</div>
            <div>
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.max(4, Math.min(100, value * 10))}%` }} />
                </div>
                <span className="w-12 text-right text-sm font-semibold text-slate-900">{value}/10</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">{source}</div>
            </div>
          </div>
        ))}
      </div>
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
        <OverviewMetric label="个人排序" value={`${company.recommendationScore}/10`} strong />
        <OverviewMetric label="外国人线索" value={`${company.foreignerFriendlyScore}/10`} />
        <OverviewMetric label="签证状态" value={company.visaSupport ? "需HR确认" : "先确认"} />
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
    ["日语证明风险", company.languageProofRisk.includes("高") ? "高" : company.languageProofRisk.includes("低") ? "低" : "中"],
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
    company.visaSupport ? "工签有公开线索，但必须在HR或面试中确认。" : "适合签证问题已经稳定或能提前确认的人。",
    company.overtimeHours <= 20 ? "加班估算不高，但需要用募集要项和面试确认。" : "能较早接触业务和现场问题，成长速度可能更快。",
    company.scoreBreakdown.growth >= 8 ? "成长空间较高，适合想积累可迁移经验的人。" : "业务边界较清楚，适合稳扎稳打积累经验。",
    company.matchTags.includes("小企业") || company.matchTags.includes("超小团队") ? "团队规模较小，职责范围更宽，能更快看到业务全貌。" : "组织规模较大，制度和岗位分工相对清楚。",
  ].slice(0, 5);
}

function cautionPoints(company: Company) {
  const base = company.riskTags.length > 0 ? company.riskTags : ["制度执行和配属情况需面试确认"];
  return [
    ...base,
    company.japaneseLevel.includes("N1") ? "面试和入社后沟通可能偏重日语读写。" : "即使标为N3可挑战，也要准备日语自我介绍和业务表达。",
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
