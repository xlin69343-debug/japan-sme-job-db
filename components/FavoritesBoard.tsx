"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Company } from "@/lib/types";
import { EmptyState, Tag } from "./DecisionUi";

type Note = {
  status: string;
  priority: string;
  memo: string;
  nextAction: string;
};

const defaultNote: Note = {
  status: "考虑中",
  priority: "中",
  memo: "",
  nextAction: "确认签证支持和实际加班",
};

export function FavoritesBoard({ companies }: { companies: Company[] }) {
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, Note>>({});
  const [query, setQuery] = useState("");

  useEffect(() => {
    setFavoriteSlugs(JSON.parse(localStorage.getItem("favoriteCompanies") || "[]"));
    setNotes(JSON.parse(localStorage.getItem("favoriteNotes") || "{}"));
  }, []);

  const favorites = useMemo(() => favoriteSlugs.map((slug) => companies.find((company) => company.slug === slug)).filter(Boolean) as Company[], [favoriteSlugs, companies]);
  const candidates = useMemo(() => {
    const value = query.trim().toLowerCase();
    return companies
      .filter((company) => !favoriteSlugs.includes(company.slug))
      .filter((company) => !value || [company.name, company.industry, company.region, company.matchTags.join(" ")].join(" ").toLowerCase().includes(value))
      .slice(0, 8);
  }, [companies, favoriteSlugs, query]);

  const updateNote = (slug: string, patch: Partial<Note>) => {
    const next = { ...notes, [slug]: { ...(notes[slug] ?? defaultNote), ...patch } };
    localStorage.setItem("favoriteNotes", JSON.stringify(next));
    setNotes(next);
  };

  const remove = (slug: string) => {
    const next = favoriteSlugs.filter((item) => item !== slug);
    localStorage.setItem("favoriteCompanies", JSON.stringify(next));
    setFavoriteSlugs(next);
  };

  const addFavorite = (slug: string) => {
    const next = favoriteSlugs.includes(slug) ? favoriteSlugs : [...favoriteSlugs, slug];
    localStorage.setItem("favoriteCompanies", JSON.stringify(next));
    setFavoriteSlugs(next);
    setQuery("");
  };

  const statusCounts = ["考虑中", "准备投递", "已投递", "面试中", "内定", "放弃"].map((status) => ({
    status,
    count: favorites.filter((company) => (notes[company.slug] ?? defaultNote).status === status).length,
  }));

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">收藏与投递管理</h1>
        <p className="mt-2 text-sm text-slate-500">这里负责闭环：研究 → 收藏 → 准备 → 投递 → 面试 → 复盘。每家公司都可以维护状态、优先级、备注和下一步行动。</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {statusCounts.map((item) => (
            <div key={item.status} className="rounded-md bg-slate-50 p-3">
              <div className="text-xs text-slate-500">{item.status}</div>
              <div className="mt-1 text-xl font-semibold text-slate-950">{item.count}</div>
            </div>
          ))}
        </div>
        <div className="relative mt-4">
          <input className="focus-ring h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3" placeholder="搜索公司名、行业、标签，直接加入收藏管理" value={query} onChange={(event) => setQuery(event.currentTarget.value)} />
          {query && (
            <div className="absolute z-20 mt-2 max-h-80 w-full overflow-auto rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
              {candidates.map((company) => (
                <button key={company.slug} className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-blue-50" onClick={() => addFavorite(company.slug)}>
                  <span>
                    <span className="font-semibold text-slate-950">{company.name}</span>
                    <span className="ml-2 text-xs text-slate-500">{company.industry} · {company.region}</span>
                  </span>
                  <span className="text-xs text-blue-700">加入</span>
                </button>
              ))}
              {candidates.length === 0 && <div className="px-3 py-2 text-sm text-slate-500">没有匹配企业</div>}
            </div>
          )}
        </div>
      </section>

      {favorites.length === 0 ? (
        <EmptyState title="还没有收藏企业" body="去企业列表点“收藏”，这里会变成你的日本求职候选清单。" />
      ) : (
        <div className="grid gap-4">
          {favorites.map((company) => {
            const note = notes[company.slug] ?? defaultNote;
            return (
              <article key={company.slug} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Link href={`/companies/${company.slug}`} className="text-xl font-semibold text-slate-950 hover:text-blue-700">{company.name}</Link>
                    <p className="mt-1 text-sm text-slate-500">{company.industry} · {company.region} · {company.salaryRange}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {company.matchTags.slice(0, 4).map((tag) => <Tag key={tag} tone="blue">{tag}</Tag>)}
                      {company.riskTags.slice(0, 2).map((tag) => <Tag key={tag} tone="amber">{tag}</Tag>)}
                    </div>
                  </div>
                  <button className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600" onClick={() => remove(company.slug)}>
                    移除收藏
                  </button>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <Select label="投递状态" value={note.status} options={["考虑中", "准备投递", "已投递", "面试中", "内定", "放弃"]} onChange={(value) => updateNote(company.slug, { status: value })} />
                  <Select label="优先级" value={note.priority} options={["高", "中", "低"]} onChange={(value) => updateNote(company.slug, { priority: value })} />
                  <label className="grid gap-1 text-xs font-medium text-slate-500 md:col-span-2">
                    下次行动
                    <input className="focus-ring h-10 rounded-md border border-slate-200 bg-slate-50 px-3" value={note.nextAction} onInput={(event) => updateNote(company.slug, { nextAction: event.currentTarget.value })} />
                  </label>
                  <label className="grid gap-1 text-xs font-medium text-slate-500 md:col-span-4">
                    备注
                    <textarea className="focus-ring min-h-20 rounded-md border border-slate-200 bg-slate-50 p-3" value={note.memo} placeholder="例如：需要确认固定残业、签证更新、是否能新卒入社" onInput={(event) => updateNote(company.slug, { memo: event.currentTarget.value })} />
                  </label>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-xs font-medium text-slate-500">
      {label}
      <select className="focus-ring h-10 rounded-md border border-slate-200 bg-slate-50 px-3" value={value} onInput={(event) => onChange(event.currentTarget.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}
