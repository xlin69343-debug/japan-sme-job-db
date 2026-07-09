import { CompareBoard } from "@/components/CompareBoard";
import { getCompanies } from "@/lib/companies";

export const metadata = {
  title: "候选企业对比 | 我的日本求职成长台",
};

export default function ComparePage() {
  return (
    <main className="mx-auto max-w-[1500px] px-4 py-6 md:px-8">
      <CompareBoard companies={getCompanies()} />
    </main>
  );
}
