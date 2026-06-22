export type ReviewSummary = {
  pros: string[];
  cons: string[];
  keywords: string[];
  atmosphere: string;
  managementStyle: string;
  overtimeReview: string;
  growthOpportunity: string;
  leavingReasons: string[];
  sources: {
    openWork: string;
    tenshokuKaigi: string;
    glassdoor: string;
    wantedly: string;
    googleMaps: string;
  };
};

export type InterviewInfo = {
  rounds: string;
  questions: string[];
  writtenTest: string;
  codingTest: string;
  japaneseInterviewDifficulty: string;
  foreignerInterviewDifficulty: string;
  difficulty: string;
};

export type RiskAnalysis = {
  blackCompanyRisk: string;
  overtimeRisk: string;
  turnoverRisk: string;
  lowSalaryRisk: string;
  foreignerFitRisk: string;
  notes: string[];
};

export type ScoreBreakdown = {
  salary: number;
  stability: number;
  growth: number;
  workLifeBalance: number;
  foreignerFriendliness: number;
  businessValue: number;
  employeeReviews: number;
  total: number;
};

export type Company = {
  slug: string;
  name: string;
  industry: string;
  location: string;
  region: string;
  employees: string;
  employeeBand: string;
  website: string;
  founded: string;
  founderBackground: string;
  mainBusiness: string;
  mainProducts: string[];
  hiringPositions: string[];
  requiredSkills: string[];
  japaneseLevel: string;
  educationRequirement: string;
  visaSupport: boolean;
  acceptsForeigners: boolean;
  foreignEmployeeCases: string;
  hiringType: string;
  workHours: string;
  restSystem: string;
  shiftWork: boolean;
  nightShift: boolean;
  remoteWork: string;
  remoteAvailable: boolean;
  flexibleWork: boolean;
  hybridWork: boolean;
  overtime: string;
  overtimeHours: number;
  salaryRange: string;
  salaryBand: string;
  newGradSalary: string;
  midCareerSalary: string;
  bonus: string;
  raiseSystem: string;
  benefits: string[];
  transportAllowance: string;
  housingAllowance: string;
  sideJob: string;
  dressCode: string;
  openworkScore: number;
  foreignerFriendlyScore: number;
  recommendationScore: number;
  scoreBreakdown: ScoreBreakdown;
  matchTags: string[];
  riskTags: string[];
  suitableForNewGrad: boolean;
  suitableForCareerChange: boolean;
  suitableForLowJapanese: boolean;
  decisionSummary: string;
  aiSummary: string;
  recommendationReason: string;
  reviewSummary: ReviewSummary;
  interviewInfo: InterviewInfo;
  riskAnalysis: RiskAnalysis;
  suitedFor: string[];
  notSuitedFor: string[];
  updatedAt: string;
};

export type Filters = {
  query: string;
  industry: string;
  region: string;
  employeeBand: string;
  salaryBand: string;
  japaneseLevel: string;
  visaSupport: string;
  acceptsForeigners: string;
  remoteAvailable: string;
  shiftWork: string;
  overtime: string;
  score: string;
  recommendation: string;
  suitableForNewGrad: string;
  suitableForCareerChange: string;
  suitableForLowJapanese: string;
  workStyle: string;
  tag: string;
  sort: string;
};

export type UserProfile = {
  nationality: string;
  japaneseLevel: string;
  education: string;
  experience: string;
  targetIndustry: string;
  targetRegion: string;
  desiredSalary: string;
  needsVisa: boolean;
  acceptsOvertime: string;
  acceptsShift: boolean;
  preferredWorkStyle: string;
  careerGoal: string;
};
