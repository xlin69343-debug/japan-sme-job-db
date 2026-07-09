import { CareerPathTool } from "@/components/CareerPathTool";
import { getCompanies, getFilterOptions } from "@/lib/companies";

export const metadata = {
  title: "成长路线 | 我的日本求职成长台",
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
