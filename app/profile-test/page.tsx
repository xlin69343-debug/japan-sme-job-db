import { ProfileMatcher } from "@/components/ProfileMatcher";
import { getCompanies, getFilterOptions } from "@/lib/companies";

export const metadata = {
  title: "适合度测试 | 日本中小企业求职决策库",
};

export default function ProfileTestPage() {
  const companies = getCompanies();
  const options = getFilterOptions(companies);
  return (
    <main className="mx-auto max-w-[1500px] px-4 py-6 md:px-8">
      <ProfileMatcher companies={companies} industries={options.industries} regions={options.regions} />
    </main>
  );
}
