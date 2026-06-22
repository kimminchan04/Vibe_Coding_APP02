"use client";

import { useMemo, useState } from "react";
import { MenuCard } from "@/components/MenuCard";
import type { CafeteriaMenu } from "@/types";

type Props = {
  menus: CafeteriaMenu[];
  source: "bablabs" | "fallback";
};

export function HomeSearch({ menus, source }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return menus;
    return menus.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.cafeteria.toLowerCase().includes(q) ||
        (m.corner?.toLowerCase().includes(q) ?? false),
    );
  }, [menus, query]);

  return (
    <div>
      <header className="bg-primary px-5 pb-6 pt-8 text-white">
        <p className="text-sm opacity-80">대진대학교</p>
        <h1 className="text-2xl font-bold">대진밥핏</h1>
        <p className="mt-1 text-sm opacity-90">학식 검색 · 영양 분석 · AI 조언</p>
        <div className="relative mt-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="메뉴 검색 (예: 돈까스, 제육)"
            className="w-full rounded-xl px-4 py-3.5 pr-10 text-text placeholder:text-muted"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">🔍</span>
        </div>
      </header>

      <main className="space-y-4 px-4 py-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">
            {query ? `검색 결과 ${filtered.length}개` : "오늘의 학식"}
          </h2>
          {source === "fallback" && (
            <span className="text-xs text-muted">샘플 데이터</span>
          )}
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
