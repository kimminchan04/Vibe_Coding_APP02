"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import type { CafeteriaMenu } from "@/types";
import { MEAL_TYPE_LABEL } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  menu: CafeteriaMenu;
  kcal?: number;
  isFavorite?: boolean;
  onToggleFavorite?: (menu: CafeteriaMenu) => void;
  unavailable?: boolean;
};

export function MenuCard({
  menu,
  kcal,
  isFavorite = false,
  onToggleFavorite,
  unavailable = false,
}: Props) {
  const dateLabel = new Date(menu.date).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  const content = (
    <>
      <div className="mb-2 flex items-center justify-between gap-2 pr-8 text-xs font-medium">
        <span className="text-accent">{dateLabel}</span>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
          {MEAL_TYPE_LABEL[menu.mealType]}
        </span>
      </div>
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold leading-snug text-text">{menu.name}</h3>
        {kcal !== undefined && (
          <span className="shrink-0 rounded-full bg-warning/15 px-2 py-0.5 text-xs font-semibold text-warning">
            {kcal}kcal
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
        <span>{menu.cafeteria}</span>
        <span>·</span>
        <span className="font-medium text-primary">
          {menu.price > 0 ? `${menu.price.toLocaleString()}원` : "가격 정보 없음"}
        </span>
        {unavailable && (
          <>
            <span>·</span>
            <span className="text-xs text-muted">오늘 식단 없음</span>
          </>
        )}
      </div>
    </>
  );

  return (
    <div className="relative rounded-2xl bg-white shadow-sm ring-1 ring-accent/5 transition hover:shadow-md">
      {onToggleFavorite && (
        <button
          type="button"
          aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onToggleFavorite(menu);
          }}
          className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-accent transition hover:bg-accent/10"
        >
          <Star
            className={cn("h-4 w-4", isFavorite ? "fill-accent text-accent" : "text-muted")}
          />
        </button>
      )}

      {unavailable ? (
        <div className="block p-4 opacity-80">{content}</div>
      ) : (
        <Link href={`/menu/${menu.id}`} className="block p-4">
          {content}
        </Link>
      )}
    </div>
  );
}
