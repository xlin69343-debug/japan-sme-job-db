import type { Company } from "@/lib/types";
import { DecisionSummary, ScoreBar, Tag } from "./DecisionUi";

export function DetailBlocks({ company }: { company: Company }) {
  return (
    <div className="grid gap-6">
      <DecisionSummary company={company} />

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel title="评分拆解">
          <div className="grid gap-3">
            <ScoreBar label="工资" value={company.scoreBreakdown.salary} />
            <ScoreBar label="稳定性" value={company.scoreBreakdown.stability} />
            <ScoreBar label="成长性" value={company.scoreBreakdown.growth} />
            <ScoreBar label="工作生活平衡" value={company.scoreBreakdown.workLifeBalance} />
            <ScoreBar label="外国人友好度" value={company.scoreBreakdown.foreignerFriendliness} />
            <ScoreBar label="技术/业务含金量" value={company.scoreBreakdown.businessValue} />
            <ScoreBar label="员工评价" value={company.scoreBreakdown.employeeReviews} />
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
