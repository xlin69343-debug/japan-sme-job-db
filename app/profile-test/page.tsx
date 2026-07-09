import { ProfileMatcher } from "@/components/ProfileMatcher";
import { getCompanies, getFilterOptions } from "@/lib/companies";

export const metadata = {
  title: "个人适合度测试 | 我的日本求职成长台",
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
