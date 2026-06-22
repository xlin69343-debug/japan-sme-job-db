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

  useEffect(() => {
    setFavoriteSlugs(JSON.parse(localStorage.getItem("favoriteCompanies") || "[]"));
    setNotes(JSON.parse(localStorage.getItem("favoriteNotes") || "{}"));
  }, []);

  const favorites = useMemo(() => favoriteSlugs.map((slug) => companies.find((company) => company.slug === slug)).filter(Boolean) as Company[], [favoriteSlugs, companies]);

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

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">收藏与投递管理</h1>
        <p className="mt-2 text-sm text-slate-500">收藏页不是普通列表，用来管理候选企业、投递状态、优先级、备注和下一步行动。</p>
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
