import { FavoritesBoard } from "@/components/FavoritesBoard";
import { getCompanies } from "@/lib/companies";

export const metadata = {
  title: "收藏与投递管理 | 我的日本求职成长台",
};

export default function FavoritesPage() {
  return (
    <main className="mx-auto max-w-[1500px] px-4 py-6 md:px-8">
      <FavoritesBoard companies={getCompanies()} />
    </main>
  );
}
