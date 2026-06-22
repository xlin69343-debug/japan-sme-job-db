import { CompanyExplorer } from "@/components/CompanyExplorer";
import { getCompanies, getFilterOptions } from "@/lib/companies";

export const metadata = {
  title: "企业决策列表 | 日本中小企业求职决策库",
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
