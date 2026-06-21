import { CompanyExplorer } from "@/components/CompanyExplorer";
import { getCompanies, getFilterOptions } from "@/lib/companies";

export default function Home() {
  const companies = getCompanies();
  const options = getFilterOptions(companies);

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-6 md:px-8">
      <CompanyExplorer companies={companies} options={options} />
      <footer className="mt-8 rounded-lg border border-line bg-white p-5 text-sm leading-6 text-muted">
        数据说明：这是 MVP 求职研究库。公司规模、薪资、评价、签证支持、外国人录用等字段来自公开信息、招聘页面和求职口碑的整理口径，正式投递前请以企业官网、募集要项、面试确认和在留资格要求为准。
      </footer>
    </main>
  );
}

