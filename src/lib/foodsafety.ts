import type { NutritionInfo } from "@/types";

type FoodSafetyResponse = {
  I2790?: {
    total_count?: string;
    row?: Array<{
      DESC_KOR?: string;
      NUTR_CONT1?: string;
      NUTR_CONT2?: string;
      NUTR_CONT3?: string;
      NUTR_CONT4?: string;
      NUTR_CONT6?: string;
      SERVING_SIZE?: string;
    }>;
  };
};

const ESTIMATE_BY_KEYWORD: Record<string, Omit<NutritionInfo, "name" | "source">> = {
  돈까스: { kcal: 680, protein: 22, carbs: 58, fat: 38, sodium: 820, servingSize: "1인분" },
  제육: { kcal: 520, protein: 28, carbs: 45, fat: 24, sodium: 980, servingSize: "1인분" },
  치킨: { kcal: 610, protein: 26, carbs: 52, fat: 32, sodium: 760, servingSize: "1인분" },
  국밥: { kcal: 480, protein: 18, carbs: 62, fat: 14, sodium: 1100, servingSize: "1인분" },
  덮밥: { kcal: 590, protein: 20, carbs: 78, fat: 18, sodium: 890, servingSize: "1인분" },
  우동: { kcal: 450, protein: 12, carbs: 72, fat: 10, sodium: 950, servingSize: "1인분" },
  파스타: { kcal: 520, protein: 14, carbs: 68, fat: 20, sodium: 680, servingSize: "1인분" },
  찌개: { kcal: 380, protein: 16, carbs: 28, fat: 22, sodium: 1200, servingSize: "1인분" },
  불고기: { kcal: 490, protein: 26, carbs: 42, fat: 20, sodium: 870, servingSize: "1인분" },
  백반: { kcal: 550, protein: 18, carbs: 75, fat: 16, sodium: 900, servingSize: "1인분" },
};

function parseNum(v?: string) {
  const n = parseFloat(v ?? "0");
  return Number.isFinite(n) ? n : 0;
}

function getEstimate(keyword: string, menuName: string): NutritionInfo {
  const match = Object.keys(ESTIMATE_BY_KEYWORD).find((k) => keyword.includes(k) || menuName.includes(k));
  const base = ESTIMATE_BY_KEYWORD[match ?? "백반"];
  return { name: menuName, ...base, source: "estimate" };
}

/** 식품의약품안전처 I2790 API로 영양 정보 조회 */
export async function fetchNutrition(keyword: string, menuName: string): Promise<NutritionInfo> {
  const apiKey = process.env.FOOD_SAFETY_API_KEY;

  if (!apiKey) {
    return getEstimate(keyword, menuName);
  }

  try {
    const url = `http://openapi.foodsafetykorea.go.kr/api/${apiKey}/I2790/json/1/5/DESC_KOR=${encodeURIComponent(keyword)}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });

    if (!res.ok) throw new Error("Food safety API error");

    const data = (await res.json()) as FoodSafetyResponse;
    const row = data.I2790?.row?.[0];

    if (!row) return getEstimate(keyword, menuName);

    return {
      name: row.DESC_KOR ?? menuName,
      kcal: parseNum(row.NUTR_CONT1),
      protein: parseNum(row.NUTR_CONT3),
      carbs: parseNum(row.NUTR_CONT2),
      fat: parseNum(row.NUTR_CONT4),
      sodium: parseNum(row.NUTR_CONT6),
      servingSize: row.SERVING_SIZE ?? "100g",
      source: "api",
    };
  } catch {
    return getEstimate(keyword, menuName);
  }
}
