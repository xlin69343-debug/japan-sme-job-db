import { StudentFitGuide } from "@/components/StudentFitGuide";
import { getCompanies } from "@/lib/companies";

export const metadata = {
  title: "留学生公司适配地图 | 日本求职职业决策平台",
};

export default function StudentFitPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <StudentFitGuide companies={getCompanies()} />
    </main>
  );
}
