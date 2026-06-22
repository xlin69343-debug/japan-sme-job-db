import { CompareBoard } from "@/components/CompareBoard";
import { getCompanies } from "@/lib/companies";

export const metadata = {
  title: "企业对比 | 日本中小企业求职决策库",
};

export default function ComparePage() {
  return (
    <main className="mx-auto max-w-[1500px] px-4 py-6 md:px-8">
      <CompareBoard companies={getCompanies()} />
    </main>
  );
}
