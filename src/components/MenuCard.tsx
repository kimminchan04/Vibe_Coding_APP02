import Link from "next/link";
import type { CafeteriaMenu } from "@/types";
import { MEAL_TYPE_LABEL } from "@/types";

type Props = {
  menu: CafeteriaMenu;
  kcal?: number;
};

export function MenuCard({ menu, kcal }: Props) {
  const dateLabel = new Date(menu.date).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <Link
      href={`/menu/${menu.id}`}
      className="block rounded-2xl bg-white p-4 shadow-sm ring-1 ring-accent/5 transition hover:shadow-md"
    >
      <div className="mb-2 flex items-center justify-between gap-2 text-xs font-medium">
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
      </div>
    </Link>
  );
}
