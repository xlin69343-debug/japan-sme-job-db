import Link from "next/link";
import { notFound } from "next/navigation";
import { DetailBlocks } from "@/components/DetailBlocks";
import { ScoreBadge, Tag } from "@/components/DecisionUi";
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
    title: company ? `${company.name} | 日本中小企业求职决策库` : "企业详情",
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  const company = getCompany(slug);
  if (!company) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:px-8">
      <Link href="/companies" className="text-sm font-semibold text-blue-700 hover:underline">
        返回企业列表
      </Link>
      <header className="mt-5 rounded-lg border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-700">{company.industry} · {company.region} · {company.employees}</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">{company.name}</h1>
            <a className="mt-3 inline-block break-all text-sm text-blue-700 hover:underline" href={company.website} target="_blank" rel="noreferrer">
              {company.website}
            </a>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <ScoreBadge label="综合" value={company.recommendationScore} />
            <ScoreBadge label="评价" value={company.openworkScore} tone="green" />
            <ScoreBadge label="外国人" value={company.foreignerFriendlyScore} tone="amber" />
          </div>
        </div>
        <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-600">{company.mainBusiness}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {company.matchTags.slice(0, 6).map((tag) => <Tag key={tag} tone="blue">{tag}</Tag>)}
          {company.riskTags.slice(0, 3).map((tag) => <Tag key={tag} tone="amber">{tag}</Tag>)}
        </div>
      </header>
      <div className="mt-6">
        <DetailBlocks company={company} />
      </div>
    </main>
  );
}
