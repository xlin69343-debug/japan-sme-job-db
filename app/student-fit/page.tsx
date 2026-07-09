import { StudentFitGuide } from "@/components/StudentFitGuide";
import { getCompanies } from "@/lib/companies";

export const metadata = {
  title: "我的公司适配地图 | 我的日本求职成长台",
};

export default function StudentFitPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <StudentFitGuide companies={getCompanies()} />
    </main>
  );
}
