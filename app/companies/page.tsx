import { CompanyExplorer } from "@/components/CompanyExplorer";
import { getCompanies, getFilterOptions } from "@/lib/companies";

export const metadata = {
  title: "候选企业研究 | 我的日本求职成长台",
};

export default function CompaniesPage() {
  const companies = getCompanies();
  const options = getFilterOptions(companies);
  return (
    <main className="mx-auto max-w-[1500px] px-4 py-6 md:px-8">
      <CompanyExplorer companies={companies} options={options} />
    </main>
  );
}
