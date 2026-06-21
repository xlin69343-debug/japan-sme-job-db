import Link from "next/link";
import { notFound } from "next/navigation";
import { DetailBlocks } from "@/components/DetailBlocks";
import { getCompanies, getCompany } from "@/lib/companies";

export function generateStaticParams() {
  return getCompanies().map((company) => ({ slug: company.slug }));
}

type CompanyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CompanyPageProps) {
  const { slug } = await params;
  const company = getCompany(slug);
  return {
    title: company ? `${company.name} | 日本中小企业求职数据库` : "企业详情",
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  const company = getCompany(slug);
  if (!company) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:px-8">
      <Link href="/" className="text-sm font-semibold text-moss hover:underline">
        ← 返回企业列表
      </Link>
      <header className="mt-5 rounded-lg border border-line bg-white p-7 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-rust">{company.industry} · {company.region}</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">{company.name}</h1>
            <a className="mt-3 inline-block break-all text-sm text-moss hover:underline" href={company.website} target="_blank" rel="noreferrer">
              {company.website}
            </a>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <Score label="推荐" value={`${company.recommendationScore}`} />
            <Score label="评价" value={`${company.openworkScore}`} />
            <Score label="外国人" value={`${company.foreignerFriendlyScore}`} />
          </div>
        </div>
        <p className="mt-5 max-w-3xl text-sm leading-6 text-muted">{company.mainBusiness}</p>
      </header>
      <div className="mt-6">
        <DetailBlocks company={company} />
      </div>
    </main>
  );
}

function Score({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-20 rounded-md bg-paper px-4 py-3">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-ink">{value}</div>
    </div>
  );
}
