import fs from "node:fs";
import path from "node:path";
import type { Company } from "./types";

const dataDir = path.join(process.cwd(), "data", "companies");

export function getCompanies(): Company[] {
  const files = fs.readdirSync(dataDir).filter((file) => file.endsWith(".json"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dataDir, file), "utf8");
      return JSON.parse(raw) as Company;
    })
    .sort((a, b) => b.recommendationScore - a.recommendationScore || a.name.localeCompare(b.name, "zh-CN"));
}

export function getCompany(slug: string): Company | undefined {
  const file = path.join(dataDir, `${slug}.json`);
  if (!fs.existsSync(file)) return undefined;
  return JSON.parse(fs.readFileSync(file, "utf8")) as Company;
}

export function getFilterOptions(companies: Company[]) {
  const uniq = (values: string[]) => Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "zh-CN"));
  return {
    industries: uniq(companies.map((company) => company.industry)),
    regions: uniq(companies.map((company) => company.region)),
    employeeBands: uniq(companies.map((company) => company.employeeBand)),
    salaryBands: uniq(companies.map((company) => company.salaryBand)),
    japaneseLevels: uniq(companies.map((company) => company.japaneseLevel)),
    tags: uniq(companies.flatMap((company) => [...company.matchTags, ...company.riskTags])),
  };
}
