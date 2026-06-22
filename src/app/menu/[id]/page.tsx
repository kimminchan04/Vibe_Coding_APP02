import Link from "next/link";
import { notFound } from "next/navigation";
import { AdviceList } from "@/components/AdviceList";
import { LogMealButton } from "@/components/LogMealButton";
import { NutritionPanel } from "@/components/NutritionPanel";
import { fetchDaejinMenus } from "@/lib/bablabs";
import { extractSearchKeyword } from "@/lib/fallback-menus";
import { fetchNutrition } from "@/lib/foodsafety";
import { generateAiAdvice } from "@/lib/nutrition-ai";
import { createClient } from "@/lib/supabase/server";
import { MEAL_TYPE_LABEL } from "@/types";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function MenuDetailPage({ params }: Props) {
  const { id } = await params;
  const { menus } = await fetchDaejinMenus();
  const menu = menus.find((m) => m.id === id);
  if (!menu) notFound();

  const keyword = extractSearchKeyword(menu.name);
  const nutrition = await fetchNutrition(keyword, menu.name);

  let daily;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const today = new Date().toISOString().slice(0, 10);
    const { data: logs } = await supabase
      .from("meal_logs")
      .select("calories, protein, carbs, fat")
      .eq("user_id", user.id)
      .gte("logged_at", `${today}T00:00:00`);

    if (logs?.length) {
      daily = logs.reduce(
        (acc, l) => ({
          kcal: acc.kcal + (l.calories ?? 0),
          protein: acc.protein + (l.protein ?? 0),
          carbs: acc.carbs + (l.carbs ?? 0),
          fat: acc.fat + (l.fat ?? 0),
        }),
        { kcal: 0, protein: 0, carbs: 0, fat: 0 },
      );
    }
  }

  const advice = await generateAiAdvice(nutrition, menu.name, daily);

  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-primary px-5 py-4 text-white">
        <Link href="/" className="text-sm opacity-80">
          ← 검색
        </Link>
        <h1 className="mt-2 text-lg font-bold leading-snug">{menu.name}</h1>
        <p className="mt-1 text-sm opacity-90">
          {menu.cafeteria} · {MEAL_TYPE_LABEL[menu.mealType]} ·{" "}
          {menu.price.toLocaleString()}원
        </p>
      </header>

      <main className="space-y-5 px-4 py-5">
        <NutritionPanel nutrition={nutrition} />
        <AdviceList advice={advice} />
        <LogMealButton
          menuName={menu.name}
          calories={nutrition.kcal}
          protein={nutrition.protein}
          carbs={nutrition.carbs}
          fat={nutrition.fat}
        />
      </main>
    </div>
  );
}
