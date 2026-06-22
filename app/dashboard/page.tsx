import { CareerDecisionWorkbench } from "@/components/CareerDecisionWorkbench";
import { getCompanies, getFilterOptions } from "@/lib/companies";

export const metadata = {
  title: "个人职业决策工作台 | 日本中小企业求职决策库",
};

export default function DashboardPage() {
  const companies = getCompanies();
  const options = getFilterOptions(companies);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <CareerDecisionWorkbench companies={companies} industries={options.industries} regions={options.regions} />
    </main>
  );
}
