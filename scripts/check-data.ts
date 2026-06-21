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

console.log(`OK: ${companies.length} company files validated.`);
