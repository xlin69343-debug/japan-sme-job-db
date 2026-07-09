import { HomeDashboard } from "@/components/HomeDashboard";
import { getCompanies, getFilterOptions } from "@/lib/companies";

export default function Home() {
  const companies = getCompanies();
  const options = getFilterOptions(companies);

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-6 md:px-8">
      <HomeDashboard companies={companies} industryCount={options.industries.length} />
      <footer className="mt-8 rounded-lg border border-line bg-white p-5 text-sm leading-6 text-muted">
        数据说明：这是我的个人求职行动面板，不是招聘网站。130家公司只作为底层资料库，不代表都适合我、都需要投递。正式投递前请以企业官网、募集要项、面试确认和在留资格要求为准。
      </footer>
    </main>
  );
}
