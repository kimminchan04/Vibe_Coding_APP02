import type { CafeteriaMenu } from "@/types";

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

/** 대진대학교 학식 샘플 데이터 (밥대생 API 폴백용) */
export const FALLBACK_MENUS: CafeteriaMenu[] = [
  {
    id: "1",
    name: "[데일리밥] 춘천닭갈비볶음*떡/고구마맛탕/와사비무생채/쌀밥/깍두기",
    price: 4300,
    cafeteria: "학생회관 식당",
    mealType: "lunch",
    date: todayString(),
    corner: "데일리밥",
  },
  {
    id: "2",
    name: "[데일리밥] 얼큰우거지순대국/잡채말이어묵/갓절임/쌀밥/깍두기",
    price: 4300,
    cafeteria: "학생회관 식당",
    mealType: "lunch",
    date: todayString(),
    corner: "데일리밥",
  },
  {
    id: "3",
    name: "[데일리밥] 불향숙주제육볶음/새송이볶음/미니고추지/쌀밥/깍두기",
    price: 4300,
    cafeteria: "학생회관 식당",
    mealType: "lunch",
    date: todayString(),
    corner: "데일리밥",
  },
  {
    id: "4",
    name: "[누들송] 갈릭알리오올리오/수제마늘빵/오이피클",
    price: 5200,
    cafeteria: "학생회관 식당",
    mealType: "lunch",
    date: todayString(),
    corner: "누들송",
  },
  {
    id: "5",
    name: "[크레이지팬] 치킨볼마요덮밥/뿌링클치즈스틱/팽이장국/깍두기",
    price: 5500,
    cafeteria: "학생회관 식당",
    mealType: "lunch",
    date: todayString(),
    corner: "크레이지팬",
  },
  {
    id: "6",
    name: "[돈카츠락] 왕등심돈까스/쌀밥/우동국/샐러드/단무지",
    price: 5700,
    cafeteria: "학생회관 식당",
    mealType: "lunch",
    date: todayString(),
    corner: "돈카츠락",
  },
  {
    id: "7",
    name: "[돈카츠락] 체다치즈돈까스/쌀밥/우동국/감자튀김/피클",
    price: 5700,
    cafeteria: "학생회관 식당",
    mealType: "lunch",
    date: todayString(),
    corner: "돈카츠락",
  },
  {
    id: "8",
    name: "[기숙사] 김치찌개/계란말이/쌀밥/김/단무지",
    price: 4400,
    cafeteria: "남자 기숙사 식당",
    mealType: "dinner",
    date: todayString(),
  },
  {
    id: "9",
    name: "[기숙사] 된장찌개/제육볶음/쌀밥/나물/깍두기",
    price: 4400,
    cafeteria: "여자 기숙사 식당",
    mealType: "dinner",
    date: todayString(),
  },
  {
    id: "10",
    name: "[기숙사] 미역국/불고기/쌀밥/잡채/김치",
    price: 4400,
    cafeteria: "남자 기숙사 식당",
    mealType: "breakfast",
    date: todayString(),
  },
];

export function searchMenus(query: string, menus = FALLBACK_MENUS) {
  const q = query.trim().toLowerCase();
  if (!q) return menus;
  return menus.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.cafeteria.toLowerCase().includes(q) ||
      (m.corner?.toLowerCase().includes(q) ?? false),
  );
}

export function getMenuById(id: string, menus = FALLBACK_MENUS) {
  return menus.find((m) => m.id === id);
}

export function extractSearchKeyword(menuName: string): string {
  const cleaned = menuName
    .replace(/\[.*?\]/g, "")
    .replace(/\*.*$/g, "")
    .split("/")[0]
    .trim();

  const keywords = ["돈까스", "제육", "치킨", "국밥", "덮밥", "우동", "파스타", "찌개", "불고기"];
  for (const kw of keywords) {
    if (cleaned.includes(kw)) return kw;
  }
  return cleaned.slice(0, 8) || "백반";
}
