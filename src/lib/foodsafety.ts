import type { NutritionInfo } from "@/types";

type NutritionBase = Omit<NutritionInfo, "name" | "source" | "servingSize">;

const DEFAULT_NUTRITION: NutritionBase = {
  kcal: 560,
  protein: 20,
  carbs: 78,
  fat: 17,
  sodium: 920,
};

const INGREDIENT_RULES: Array<{
  pattern: RegExp;
  nutrition: NutritionBase;
}> = [
  { pattern: /돈까스|돈가스|까스|카츠/, nutrition: { kcal: 720, protein: 28, carbs: 82, fat: 30, sodium: 980 } },
  { pattern: /제육|돼지|불고기|갈비|고기/, nutrition: { kcal: 620, protein: 34, carbs: 58, fat: 24, sodium: 1100 } },
  { pattern: /닭|치킨|치즈닭|닭갈비/, nutrition: { kcal: 590, protein: 32, carbs: 54, fat: 23, sodium: 920 } },
  { pattern: /생선|고등어|삼치|가자미/, nutrition: { kcal: 520, protein: 31, carbs: 55, fat: 17, sodium: 850 } },
  { pattern: /비빔밥|덮밥|볶음밥|오므라이스|김치밥/, nutrition: { kcal: 650, protein: 21, carbs: 95, fat: 18, sodium: 1050 } },
  { pattern: /라면|우동|국수|파스타|스파게티|면/, nutrition: { kcal: 610, protein: 18, carbs: 92, fat: 16, sodium: 1450 } },
  { pattern: /찌개|전골|탕|국|국밥/, nutrition: { kcal: 480, protein: 23, carbs: 64, fat: 13, sodium: 1550 } },
  { pattern: /샐러드|야채|채소/, nutrition: { kcal: 360, protein: 16, carbs: 42, fat: 13, sodium: 520 } },
  { pattern: /김밥|주먹밥|유부초밥/, nutrition: { kcal: 430, protein: 13, carbs: 74, fat: 9, sodium: 820 } },
  { pattern: /떡볶이|튀김|만두/, nutrition: { kcal: 680, protein: 17, carbs: 103, fat: 21, sodium: 1250 } },
  { pattern: /죽|스프|스튜/, nutrition: { kcal: 380, protein: 13, carbs: 58, fat: 10, sodium: 760 } },
];

const SIDE_RULES: Array<{
  pattern: RegExp;
  delta: NutritionBase;
}> = [
  { pattern: /밥|쌀밥|흑미밥|잡곡밥/, delta: { kcal: 250, protein: 5, carbs: 55, fat: 1, sodium: 0 } },
  { pattern: /김치|깍두기/, delta: { kcal: 20, protein: 1, carbs: 4, fat: 0, sodium: 260 } },
  { pattern: /계란|달걀/, delta: { kcal: 80, protein: 7, carbs: 1, fat: 5, sodium: 70 } },
  { pattern: /치즈/, delta: { kcal: 70, protein: 4, carbs: 1, fat: 6, sodium: 130 } },
  { pattern: /소스|마요|드레싱/, delta: { kcal: 90, protein: 0, carbs: 7, fat: 7, sodium: 180 } },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function averageNutrition(values: NutritionBase[]) {
  const total = values.reduce(
    (acc, item) => ({
      kcal: acc.kcal + item.kcal,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
      sodium: acc.sodium + item.sodium,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0, sodium: 0 },
  );

  return {
    kcal: total.kcal / values.length,
    protein: total.protein / values.length,
    carbs: total.carbs / values.length,
    fat: total.fat / values.length,
    sodium: total.sodium / values.length,
  };
}

function analyzeMenuNutrition(menuName: string): NutritionBase {
  const matchedMains = INGREDIENT_RULES.filter((rule) => rule.pattern.test(menuName)).map(
    (rule) => rule.nutrition,
  );
  const base = matchedMains.length > 0 ? averageNutrition(matchedMains) : DEFAULT_NUTRITION;

  const withSides = SIDE_RULES.reduce(
    (acc, rule) => {
      if (!rule.pattern.test(menuName)) return acc;
      return {
        kcal: acc.kcal + rule.delta.kcal,
        protein: acc.protein + rule.delta.protein,
        carbs: acc.carbs + rule.delta.carbs,
        fat: acc.fat + rule.delta.fat,
        sodium: acc.sodium + rule.delta.sodium,
      };
    },
    { ...base },
  );

  const dishCount = menuName.split(/[+/·,]/).filter((part) => part.trim().length > 1).length;
  const multiDishScale = dishCount >= 3 ? 0.85 : 1;

  return {
    kcal: clamp(withSides.kcal * multiDishScale, 250, 1100),
    protein: clamp(withSides.protein * multiDishScale, 6, 55),
    carbs: clamp(withSides.carbs * multiDishScale, 20, 150),
    fat: clamp(withSides.fat * multiDishScale, 3, 45),
    sodium: clamp(withSides.sodium * multiDishScale, 250, 2300),
  };
}

/** 메뉴명을 기반으로 주재료와 조리법을 분석해 영양값을 추정한다. */
export async function fetchNutrition(_keyword: string, menuName: string): Promise<NutritionInfo> {
  const analyzed = analyzeMenuNutrition(menuName);

  return {
    name: menuName,
    ...analyzed,
    servingSize: "학식 1인분 추정",
    source: "analysis",
  };
}
