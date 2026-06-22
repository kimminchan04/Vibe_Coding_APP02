import Link from "next/link";
import type { CafeteriaMenu } from "@/types";
import { MEAL_TYPE_LABEL } from "@/types";

type Props = {
  menu: CafeteriaMenu;
  kcal?: number;
};

export function MenuCard({ menu, kcal }: Props) {
  return (
    <Link
      href={`/menu/${menu.id}`}
      className="block rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold leading-snug text-text">{menu.name}</h3>
        {kcal !== undefined && (
          <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
            {kcal}kcal
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
        <span>{menu.cafeteria}</span>
        <span>·</span>
        <span>{MEAL_TYPE_LABEL[menu.mealType]}</span>
        <span>·</span>
        <span className="font-medium text-primary">{menu.price.toLocaleString()}원</span>
      </div>
    </Link>
  );
}
