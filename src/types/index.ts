export type MealType = "breakfast" | "lunch" | "dinner";

export type CafeteriaMenu = {
  id: string;
  name: string;
  price: number;
  cafeteria: string;
  mealType: MealType;
  date: string;
  corner?: string;
};

export type NutritionInfo = {
  name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
  servingSize: string;
  source: "api" | "estimate";
};

export type AiAdvice = {
  type: "success" | "warning" | "info";
  title: string;
  message: string;
};

export type MealLog = {
  id: string;
  user_id: string;
  menu_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  logged_at: string;
};

export type Profile = {
  id: string;
  name: string | null;
  department: string | null;
  calorie_goal: number | null;
  protein_goal: number | null;
};

export const MEAL_TYPE_LABEL: Record<MealType, string> = {
  breakfast: "조식",
  lunch: "중식",
  dinner: "석식",
};

export const CAFETERIA_LIST = [
  "학생회관 식당",
  "남자 기숙사 식당",
  "여자 기숙사 식당",
] as const;
