"use client";

import { useMemo, useState } from "react";
import { MenuCard } from "@/components/MenuCard";
import type { CafeteriaMenu } from "@/types";

type Props = {
  menus: CafeteriaMenu[];
  source: "crawler" | "fallback";
};

type SortKey = "date" | "price" | "cafeteria";

const sortOptions: Array<{ key: SortKey; label: string }> = [
  { key: "date", label: "날짜순" },
  { key: "price", label: "가격순" },
  { key: "cafeteria", label: "식당순" },
];

function compareMenus(a: CafeteriaMenu, b: CafeteriaMenu, sortKey: SortKey) {
  if (sortKey === "price") return a.price - b.price;
  if (sortKey === "cafeteria") return a.cafeteria.localeCompare(b.cafeteria, "ko-KR");

  const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
  if (dateDiff !== 0) return dateDiff;
  return a.mealType.localeCompare(b.mealType);
}

export function HomeSearch({ menus, source }: Props) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = !q
      ? [...menus]
      : menus.filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.cafeteria.toLowerCase().includes(q) ||
            m.date.includes(q) ||
            (m.corner?.toLowerCase().includes(q) ?? false),
        );

    return result.sort((a, b) => compareMenus(a, b, sortKey));
  }, [menus, query, sortKey]);

  return (
    <div>
      <header className="bg-primary px-5 pb-6 pt-8 text-white">
        <p className="text-sm opacity-85">대진대학교</p>
        <h1 className="text-2xl font-bold">대진학식 영양알리미</h1>
        <p className="mt-1 text-sm opacity-90">학식 검색 · 영양 분석 · AI 조언</p>
        <div className="relative mt-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="메뉴, 식당, 날짜 검색"
            className="w-full rounded-xl px-4 py-3.5 pr-10 text-text placeholder:text-muted"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-accent">⌕</span>
        </div>
      </header>

      <main className="space-y-4 px-4 py-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">
              {query ? `검색 결과 ${filtered.length}개` : "오늘의 학식"}
            </h2>
            <span className="text-xs text-muted">
              {source === "crawler" ? "대진대 페이지 크롤링" : "샘플 데이터"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {sortOptions.map((option) => {
              const active = option.key === sortKey;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setSortKey(option.key)}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-accent text-white shadow-sm"
                      : "bg-white text-muted ring-1 ring-accent/10"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="font-medium">검색 결과가 없어요</p>
            <p className="mt-1 text-sm text-muted">다른 키워드를 입력해 보세요.</p>
          </div>
        ) : (
          filtered.map((menu) => <MenuCard key={menu.id} menu={menu} />)
        )}
      </main>
    </div>
  );
}
