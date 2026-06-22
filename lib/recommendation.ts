import type { Company, UserProfile } from "./types";

export const defaultProfile: UserProfile = {
  nationality: "中国",
  japaneseLevel: "N2",
  education: "本科",
  experience: "1-3年",
  targetIndustry: "",
  targetRegion: "",
  desiredSalary: "400万-600万日元",
  needsVisa: true,
  acceptsOvertime: "20-30小时",
  acceptsShift: false,
  preferredWorkStyle: "混合",
  careerGoal: "稳定发展",
};

export function calculateMatch(company: Company, profile: UserProfile) {
  const reasons: string[] = [];
  const risks: string[] = [];
  let score = 0;
  const missing: string[] = [];

  if (!profile.targetIndustry || company.industry === profile.targetIndustry) {
    score += 15;
    if (profile.targetIndustry) reasons.push(`目标行业匹配：${company.industry}`);
  } else if (company.industry.includes(profile.targetIndustry) || profile.targetIndustry.includes(company.industry)) {
    score += 9;
  } else {
    risks.push(`行业与目标方向不同：当前为${company.industry}`);
  }

  if (!profile.targetRegion || company.region === profile.targetRegion || company.location.includes(profile.targetRegion)) {
    score += 10;
    if (profile.targetRegion) reasons.push(`目标地区匹配：${company.region}`);
  } else {
    risks.push(`地区不完全匹配：${company.location}`);
  }

  if (!profile.needsVisa || company.visaSupport) {
    score += 20;
    reasons.push(company.visaSupport ? "签证支持可能性较高" : "不需要签证支持");
  } else {
    risks.push("需要签证，但该公司签证支持公开信息有限");
  }

  if (company.acceptsForeigners) {
    score += 12;
    reasons.push("外国人录用或双语人才案例较多");
  } else {
    score += 4;
    risks.push("外国人录用案例较少，需要提前确认");
  }

  if (japaneseFits(profile.japaneseLevel, company.japaneseLevel)) {
    score += 14;
    reasons.push(`日语要求可挑战：${company.japaneseLevel}`);
  } else {
    risks.push(`日语压力较高：公司要求${company.japaneseLevel}`);
    missing.push(company.japaneseLevel.includes("N2") ? "缺N2级业务日语" : "缺N1级商务日语");
  }

  if (salaryFits(profile.desiredSalary, company.salaryBand)) {
    score += 10;
    reasons.push(`薪资区间接近目标：${company.salaryRange}`);
  } else {
    score += 4;
    risks.push(`薪资可能不完全符合目标：${company.salaryRange}`);
  }

  if (overtimeFits(profile.acceptsOvertime, company.overtimeHours)) {
    score += 8;
    reasons.push(`加班接受度匹配：${company.overtime}`);
  } else {
    risks.push(`加班可能超过偏好：${company.overtime}`);
  }

  if (!profile.acceptsShift && company.shiftWork) {
    risks.push("存在轮班或排班，需要确认生活节奏");
  } else {
    score += 5;
  }

  if (workStyleFits(profile.preferredWorkStyle, company)) {
    score += 6;
    reasons.push(`工作方式匹配：${company.remoteWork}`);
  }

  const goal = profile.careerGoal;
  if (goal === "稳定发展") score += company.scoreBreakdown.stability;
  if (goal === "提高年收") score += company.scoreBreakdown.salary;
  if (goal === "技术成长") score += company.scoreBreakdown.growth;
  if (goal === "拿日本工作经验") score += company.acceptsForeigners ? 8 : 4;
  if (goal === "未来转大企业") score += company.scoreBreakdown.businessValue;
  if (goal === "低日语压力") score += company.suitableForLowJapanese ? 8 : 3;
  if (goal === "拿签证优先") score += company.visaSupport ? 9 : 2;
  if (goal === "工作生活平衡") score += company.scoreBreakdown.workLifeBalance;

  const difficulty = companyDifficulty(company);
  score -= difficulty.penalty;
  risks.push(...difficulty.risks);
  missing.push(...difficulty.missing);
  if (profile.needsVisa && !company.visaSupport) missing.push("签证支持确认");
  if (company.industry.includes("IT") || company.industry.includes("AI")) missing.push("技术面试准备");

  const finalScore = Math.min(difficulty.cap, Math.max(38, Math.round(score)));
  const uniqueRisks = Array.from(new Set(risks)).slice(0, 4);
  const uniqueMissing = Array.from(new Set(missing)).slice(0, 4);

  return {
    score: finalScore,
    verdict: finalScore >= 85 ? "优先" : finalScore >= 72 ? "适合" : finalScore >= 60 ? "挑战" : "暂缓",
    prepTime: finalScore >= 85 ? "1-3个月" : finalScore >= 72 ? "3-6个月" : finalScore >= 60 ? "6-12个月" : "12个月以上",
    missing: uniqueMissing.length ? uniqueMissing : ["补充企业研究", "准备面试案例"],
    reasons: reasons.slice(0, 5),
    risks: uniqueRisks,
    advice: buildAdvice(company, profile, uniqueRisks),
  };
}

export function sortCompanies(companies: Company[], sort: string) {
  const list = [...companies];
  if (sort === "foreigner") return list.sort((a, b) => b.foreignerFriendlyScore - a.foreignerFriendlyScore);
  if (sort === "salary") return list.sort((a, b) => b.scoreBreakdown.salary - a.scoreBreakdown.salary);
  if (sort === "overtime") return list.sort((a, b) => a.overtimeHours - b.overtimeHours);
  if (sort === "growth") return list.sort((a, b) => b.scoreBreakdown.growth - a.scoreBreakdown.growth);
  if (sort === "stability") return list.sort((a, b) => b.scoreBreakdown.stability - a.scoreBreakdown.stability);
  if (sort === "newGrad") return list.sort((a, b) => Number(b.suitableForNewGrad) - Number(a.suitableForNewGrad) || b.recommendationScore - a.recommendationScore);
  if (sort === "career") return list.sort((a, b) => Number(b.suitableForCareerChange) - Number(a.suitableForCareerChange) || b.recommendationScore - a.recommendationScore);
  return list.sort((a, b) => b.recommendationScore - a.recommendationScore);
}

function japaneseFits(userLevel: string, required: string) {
  if (userLevel === "N1") return true;
  if (userLevel === "N2") return !required.includes("N1");
  if (userLevel === "N3") return required.includes("N3") || required.includes("低");
  return required.includes("N3");
}

function salaryFits(desired: string, actual: string) {
  if (!desired) return true;
  if (desired === actual) return true;
  if (desired.includes("400万") && !actual.includes("400万日元以下")) return true;
  if (desired.includes("600万") && (actual.includes("600万") || actual.includes("800万"))) return true;
  if (desired.includes("800万") && actual.includes("800万")) return true;
  return false;
}

function overtimeFits(accepts: string, hours: number) {
  if (accepts === "不接受加班") return hours <= 10;
  if (accepts === "20小时以内") return hours <= 20;
  if (accepts === "20-30小时") return hours <= 30;
  return true;
}

function workStyleFits(style: string, company: Company) {
  if (!style) return true;
  if (style === "远程") return company.remoteAvailable;
  if (style === "混合") return company.hybridWork || company.remoteAvailable;
  if (style === "到岗") return !company.remoteAvailable || company.remoteWork.includes("到岗");
  return true;
}

function companyDifficulty(company: Company) {
  if (company.slug === "preferred-networks") {
    return {
      penalty: 18,
      cap: 82,
      risks: ["技术面试难", "竞争激烈"],
      missing: ["算法/机器学习深度", "论文或高质量项目经验"],
    };
  }
  if (company.slug === "pksha") {
    return {
      penalty: 12,
      cap: 86,
      risks: ["AI产品理解要求高", "技术面试偏难"],
      missing: ["NLP/机器学习项目", "产品化经验"],
    };
  }
  if (company.slug === "abeja") {
    return {
      penalty: 9,
      cap: 88,
      risks: ["客户课题理解要求高"],
      missing: ["AI/DX项目表达", "客户沟通案例"],
    };
  }
  const hardTech = company.industry.includes("IT") || company.industry.includes("AI") || company.scoreBreakdown.businessValue >= 8.5;
  return {
    penalty: hardTech ? 5 : 0,
    cap: hardTech ? 91 : 94,
    risks: hardTech ? ["技术筛选需准备"] : [],
    missing: hardTech ? ["作品集或项目案例"] : [],
  };
}

function buildAdvice(company: Company, profile: UserProfile, risks: string[]) {
  const base = [`准备${company.hiringPositions.slice(0, 2).join("、")}相关经历`, `面试追问签证、加班和评价制度`];
  if (profile.japaneseLevel !== "N1") base.push("提前准备日语自我介绍和业务沟通案例");
  if (risks.length > 0) base.push(`重点确认：${risks[0]}`);
  return base;
}
