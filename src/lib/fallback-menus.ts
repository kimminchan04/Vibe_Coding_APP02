import type { CafeteriaMenu } from "@/types";

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

/** 대진대학교 학식 샘플 데이터 (크롤링 실패 시 폴백용) */
export const FALLBACK_MENUS: CafeteriaMenu[] = [
  {
    id: "sample-1",
    name: "제육볶음, 잡곡밥, 미역국, 김치",
    price: 4300,
    cafeteria: "학생회관 식당",
    mealType: "lunch",
    date: todayString(),
    corner: "한식",
  },
  {
    id: "sample-2",
    name: "등심돈까스, 쌀밥, 우동국물, 샐러드, 깍두기",
    price: 5700,
    cafeteria: "학생회관 식당",
    mealType: "lunch",
    date: todayString(),
    corner: "돈까스",
  },
  {
    id: "sample-3",
    name: "치킨마요덮밥, 유부장국, 단무지",
    price: 5500,
    cafeteria: "학생회관 식당",
    mealType: "lunch",
    date: todayString(),
    corner: "덮밥",
  },
  {
    id: "sample-4",
    name: "김치찌개, 쌀밥, 계란말이, 김, 깍두기",
    price: 4400,
    cafeteria: "남자 기숙사 식당",
    mealType: "dinner",
    date: todayString(),
  },
  {
    id: "sample-5",
    name: "불고기비빔밥, 된장국, 김치",
    price: 4400,
    cafeteria: "여자 기숙사 식당",
    mealType: "dinner",
    date: todayString(),
  },
  {
    id: "sample-6",
    name: "계란볶음밥, 소시지구이, 콩나물국, 배추김치",
    price: 4200,
    cafeteria: "기숙사 식당",
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
    .split(/[,+/·]/)[0]
    .trim();

  const keywords = [
    "돈까스",
    "돈가스",
    "제육",
    "치킨",
    "닭",
    "찌개",
    "덮밥",
    "볶음밥",
    "비빔밥",
    "국수",
    "우동",
    "라면",
    "불고기",
  ];

  return keywords.find((kw) => cleaned.includes(kw)) ?? cleaned.slice(0, 12) ?? "백반";
}
