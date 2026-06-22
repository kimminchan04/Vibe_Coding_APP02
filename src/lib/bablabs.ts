import type { CafeteriaMenu } from "@/types";
import { FALLBACK_MENUS } from "./fallback-menus";

const BABLABS_BASE = "https://api.bablabs.com/v2";

type BabLabsMenuResponse = {
  menus?: Array<{
    id: number;
    name: string;
    price: number;
    cafeteria_name: string;
    meal_type: string;
    date: string;
    corner?: string;
  }>;
};

function mapMealType(raw: string): CafeteriaMenu["mealType"] {
  if (raw.includes("조") || raw === "breakfast") return "breakfast";
  if (raw.includes("석") || raw === "dinner") return "dinner";
  return "lunch";
}

/** 밥대생 Open API에서 대진대 학식 조회 (키 없으면 폴백) */
export async function fetchDaejinMenus(): Promise<{
  menus: CafeteriaMenu[];
  source: "bablabs" | "fallback";
}> {
  const apiKey = process.env.BABLABS_API_KEY;

  if (!apiKey) {
    return { menus: FALLBACK_MENUS, source: "fallback" };
  }

  try {
    const today = new Date().toISOString().slice(0, 10);
    const res = await fetch(
      `${BABLABS_BASE}/campus/daejin/menus?date=${today}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) throw new Error("Bablabs API error");

    const data = (await res.json()) as BabLabsMenuResponse;
    const menus: CafeteriaMenu[] = (data.menus ?? []).map((m) => ({
      id: String(m.id),
      name: m.name,
      price: m.price,
      cafeteria: m.cafeteria_name,
      mealType: mapMealType(m.meal_type),
      date: m.date,
      corner: m.corner,
    }));

    if (menus.length === 0) {
      return { menus: FALLBACK_MENUS, source: "fallback" };
    }

    return { menus, source: "bablabs" };
  } catch {
    return { menus: FALLBACK_MENUS, source: "fallback" };
  }
}
