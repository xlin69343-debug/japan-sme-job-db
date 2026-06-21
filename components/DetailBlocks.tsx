import type { Company } from "@/lib/types";

export function DetailBlocks({ company }: { company: Company }) {
  return (
    <div className="grid gap-6">
      <Section title="基础信息" items={[
        ["公司名称", company.name],
        ["行业分类", company.industry],
        ["官网", company.website],
        ["所在地", company.location],
        ["员工人数", company.employees],
        ["成立时间", company.founded],
        ["社长/创始人背景", company.founderBackground],
        ["主要业务", company.mainBusiness],
        ["主要产品", company.mainProducts.join("、")],
      ]} />
      <Section title="求职信息" items={[
        ["招聘岗位", company.hiringPositions.join("、")],
        ["需要技能", company.requiredSkills.join("、")],
        ["日语要求", company.japaneseLevel],
        ["学历要求", company.educationRequirement],
        ["是否支持签证", company.visaSupport ? "支持或有机会支持" : "公开信息有限，需确认"],
        ["是否接受外国人", company.acceptsForeigners ? "接受可能性较高" : "案例较少，需提前确认"],
        ["是否有外国员工案例", company.foreignEmployeeCases],
        ["新卒/中途采用情况", company.hiringType],
      ]} />
      <Section title="工作方式" items={[
        ["工作时间", company.workHours],
        ["休息制度", company.restSystem],
        ["是否轮班", company.shiftWork ? "是" : "否"],
        ["是否夜班", company.nightShift ? "可能有" : "通常无"],
        ["是否远程办公", company.remoteWork],
        ["是否弹性工作", company.flexibleWork ? "是" : "较少"],
        ["是否混合办公", company.hybridWork ? "是" : "较少"],
        ["平均加班时间", company.overtime],
        ["休假制度", company.restSystem],
        ["副业可否", company.sideJob],
        ["服装要求", company.dressCode],
      ]} />
      <Section title="薪资待遇" items={[
        ["应届薪资", company.newGradSalary],
        ["中途薪资", company.midCareerSalary],
        ["薪资范围", company.salaryRange],
        ["奖金", company.bonus],
        ["涨薪制度", company.raiseSystem],
        ["福利制度", company.benefits.join("、")],
        ["交通费", company.transportAllowance],
        ["住房补贴", company.housingAllowance],
      ]} />
      <ReviewBlock company={company} />
      <Section title="面试信息" items={[
        ["面试轮数", company.interviewInfo.rounds],
        ["常见问题", company.interviewInfo.questions.join(" / ")],
        ["笔试/适性检查", company.interviewInfo.writtenTest],
        ["编码测试", company.interviewInfo.codingTest],
        ["日语面试难度", company.interviewInfo.japaneseInterviewDifficulty],
        ["外国人面试难度", company.interviewInfo.foreignerInterviewDifficulty],
        ["录取难度", company.interviewInfo.difficulty],
      ]} />
      <Section title="风险分析" items={[
        ["黑企业风险", company.riskAnalysis.blackCompanyRisk],
        ["加班风险", company.riskAnalysis.overtimeRisk],
        ["离职率风险", company.riskAnalysis.turnoverRisk],
        ["薪资偏低风险", company.riskAnalysis.lowSalaryRisk],
        ["外国人适配风险", company.riskAnalysis.foreignerFitRisk],
        ["风险备注", company.riskAnalysis.notes.join(" / ")],
      ]} />
      <Section title="总结" items={[
        ["适合什么样的人", company.suitedFor.join("、")],
        ["不适合什么样的人", company.notSuitedFor.join("、")],
        ["综合推荐指数", `${company.recommendationScore}/10`],
      ]} />
    </div>
  );
}

function ReviewBlock({ company }: { company: Company }) {
  const review = company.reviewSummary;
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <h2 className="text-xl font-semibold">员工评价</h2>
      <p className="mt-2 text-sm text-muted">整合 OpenWork、転職会議、Glassdoor、Wantedly、Google Maps 等公开评价摘要口径。</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Box label="优点" value={review.pros.join("、")} />
        <Box label="缺点" value={review.cons.join("、")} />
        <Box label="常见关键词" value={review.keywords.join("、")} />
        <Box label="工作氛围" value={review.atmosphere} />
        <Box label="管理风格" value={review.managementStyle} />
        <Box label="加班评价" value={review.overtimeReview} />
        <Box label="成长机会" value={review.growthOpportunity} />
        <Box label="离职原因" value={review.leavingReasons.join("、")} />
      </div>
      <div className="mt-4 rounded-md bg-paper p-4 text-sm text-muted">
        OpenWork：{review.sources.openWork} / 転職会議：{review.sources.tenshokuKaigi} / Glassdoor：{review.sources.glassdoor} / Wantedly：{review.sources.wantedly} / Google Maps：{review.sources.googleMaps}
      </div>
    </section>
  );
}

function Section({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map(([label, value]) => (
          <Box key={label} label={label} value={value} />
        ))}
      </div>
    </section>
  );
}

function Box({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-paper p-4">
      <div className="text-xs font-semibold text-muted">{label}</div>
      <div className="mt-2 text-sm leading-6 text-ink">{value}</div>
    </div>
  );
}

