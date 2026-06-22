import { CareerPathTool } from "@/components/CareerPathTool";
import { getCompanies, getFilterOptions } from "@/lib/companies";

export const metadata = {
  title: "职业路线 | 日本中小企业求职决策库",
};

export default function CareerPathPage() {
  const companies = getCompanies();
  const options = getFilterOptions(companies);
  return (
    <main className="mx-auto max-w-[1500px] px-4 py-6 md:px-8">
      <CareerPathTool companies={companies} industries={options.industries} />
    </main>
  );
}
