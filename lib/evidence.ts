import type { Company } from "./types";

export type EvidenceTone = "green" | "blue" | "amber" | "red" | "slate";

export type EvidenceBadge = {
  label: string;
  tone: EvidenceTone;
  detail: string;
};

export function getEvidenceBadge(company: Company, field: "business" | "employees" | "salary" | "overtime" | "visa" | "foreigners" | "score"): EvidenceBadge {
  const credibility = `${company.dataCredibility} ${company.dataSourceNote}`;
  const hasOfficial = /官网|公司公开|官方|公司页面/.test(credibility);
  const hasEstimate = /估算|近似|口碑|摘要|需确认/.test(credibility);

  if (field === "business") {
    return hasOfficial
      ? { label: "业务: 官网确认", tone: "green", detail: "业务方向优先来自企业官网或公司公开页面。" }
      : { label: "业务: 待核验", tone: "amber", detail: "业务描述需要在官网或募集要项中再确认。" };
  }

  if (field === "employees") {
    if (/员工数.*(官网|公司页面|时点|截至)|Number of Employees/i.test(credibility)) {
      return { label: "人数: 官方口径", tone: "green", detail: "员工数来自公司页面或明确时点的公开资料。" };
    }
    if (/员工数/.test(credibility)) {
      return { label: "人数: 近似口径", tone: "blue", detail: "员工数来自公开资料近似值，投递前建议刷新。" };
    }
    return { label: "人数: 待刷新", tone: "amber", detail: "员工数未见明确官方时点，容易过期。" };
  }

  if (field === "salary") {
    return { label: "薪资: 估算", tone: "amber", detail: "薪资用于求职研究排序，不等同于官方募集条件。" };
  }

  if (field === "overtime") {
    return { label: "加班: 口碑推断", tone: "amber", detail: "加班来自公开评价摘要或模板估算，必须面试确认。" };
  }

  if (field === "visa") {
    return company.visaSupport
      ? { label: "签证: 面试确认", tone: "blue", detail: "只能说明有支持可能，不能替代企业书面确认。" }
      : { label: "签证: 未确认", tone: "red", detail: "未见足够公开线索，投递前先问清在留资格支持。" };
  }

  if (field === "foreigners") {
    return company.acceptsForeigners
      ? { label: "外国人: 线索可见", tone: "blue", detail: "公开资料或口碑中有线索，但仍需确认岗位语言环境。" }
      : { label: "外国人: 案例少", tone: "amber", detail: "公开案例较少，不应作为近期主投。" };
  }

  if (field === "score") {
    return hasEstimate
      ? { label: "评分: 个人研究用", tone: "slate", detail: "综合分只是个人筛选排序，不代表企业官方评价。" }
      : { label: "评分: 待标注", tone: "amber", detail: "评分需要补充来源解释。" };
  }

  return { label: "数据: 待核验", tone: "amber", detail: "该字段需要补充来源和更新时间。" };
}

export function buildVerificationChecklist(company: Company) {
  return [
    {
      title: "官网和募集要项",
      body: `确认${company.name}当前招聘岗位、必要技能、学历/经验要求和勤務地。`,
      done: company.sourceUrls.length > 0,
    },
    {
      title: "签证支持",
      body: company.visaSupport ? "面试或HR联系时确认是否支持技术・人文知识・国际业务在留资格。" : "先问是否接受需要在留资格支持的外国人，再决定是否继续。",
      done: false,
    },
    {
      title: "日语环境",
      body: `确认实际工作是否需要${company.japaneseLevel}以上读写、客户沟通、日报或会议表达。`,
      done: false,
    },
    {
      title: "加班和固定残业",
      body: "确认平均残业、繁忙期、固定残业代、远程/出社规则，不直接相信估算值。",
      done: false,
    },
    {
      title: "我的证据",
      body: "准备一个能说明技术成长的作品、日语自我介绍、志望动机和签证说明话术。",
      done: false,
    },
  ];
}

export function getCurrentStage(company: Company) {
  const hardSlugs = new Set(["preferred-networks", "pksha", "abeja", "smartnews", "exawizards", "brainpad"]);
  if (hardSlugs.has(company.slug) || company.interviewInfo.difficulty === "高") return "挑战目标";
  if (!company.visaSupport && !company.acceptsForeigners) return "暂不主投";
  if (company.industry.includes("制造") || company.hiringPositions.join("").includes("测试") || company.hiringPositions.join("").includes("社内")) return "主线候选";
  return "观察候选";
}
