import fs from "node:fs";
import path from "node:path";
import type { Company } from "../lib/types";

const dir = path.join(process.cwd(), "data", "companies");
const files = fs.readdirSync(dir).filter((file) => file.endsWith(".json"));
const required: (keyof Company)[] = [
  "slug",
  "name",
  "industry",
  "location",
  "employees",
  "website",
  "founded",
  "mainBusiness",
  "hiringPositions",
  "workHours",
  "remoteWork",
  "overtime",
  "salaryRange",
  "japaneseLevel",
  "visaSupport",
  "acceptsForeigners",
  "openworkScore",
  "foreignerFriendlyScore",
  "recommendationScore",
  "scoreBreakdown",
  "matchTags",
  "riskTags",
  "suitableForNewGrad",
  "suitableForCareerChange",
  "suitableForLowJapanese",
  "decisionSummary",
  "aiSummary",
  "recommendationReason",
];

const companies = files.map((file) => JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")) as Company);
const missing = companies.flatMap((company) =>
  required.filter((key) => company[key] === undefined || company[key] === null || company[key] === "").map((key) => `${company.slug}:${String(key)}`),
);

if (companies.length !== 100) {
  throw new Error(`Expected 100 companies, got ${companies.length}`);
}

if (missing.length > 0) {
  throw new Error(`Missing fields:\n${missing.join("\n")}`);
}

const invalidScores = companies.flatMap((company) => {
  const score = company.scoreBreakdown;
  if (!score) return [`${company.slug}:scoreBreakdown`];
  return Object.entries(score)
    .filter(([, value]) => typeof value !== "number" || value < 1 || value > 10)
    .map(([key]) => `${company.slug}:scoreBreakdown.${key}`);
});

const invalidTags = companies.filter((company) => company.matchTags.length < 4 || company.interviewInfo.questions.length < 5).map((company) => company.slug);

if (invalidScores.length > 0) {
  throw new Error(`Invalid scores:\n${invalidScores.join("\n")}`);
}

if (invalidTags.length > 0) {
  throw new Error(`Invalid decision data:\n${invalidTags.join("\n")}`);
}

console.log(`OK: ${companies.length} company files validated.`);
