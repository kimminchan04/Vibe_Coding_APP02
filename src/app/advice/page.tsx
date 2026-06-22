import Link from "next/link";
import { AdviceList } from "@/components/AdviceList";
import { DAILY_GOALS, generateAiAdvice } from "@/lib/nutrition-ai";
import { createClient } from "@/lib/supabase/server";

export default async function AdvicePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let daily = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
  let logCount = 0;

  if (user) {
    const today = new Date().toISOString().slice(0, 10);
    const { data: logs } = await supabase
      .from("meal_logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("logged_at", `${today}T00:00:00`)
      .order("logged_at", { ascending: false });

    logCount = logs?.length ?? 0;
    if (logs?.length) {
      daily = logs.reduce(
        (acc, l) => ({
          kcal: acc.kcal + (l.calories ?? 0),
          protein: acc.protein + (l.protein ?? 0),
          carbs: acc.carbs + (l.carbs ?? 0),
          fat: acc.fat + (l.fat ?? 0),
        }),
        daily,
      );
    }
  }

  const mockNutrition = {
    name: "오늘 누적",
    kcal: daily.kcal,
    protein: daily.protein,
    carbs: daily.carbs,
    fat: daily.fat,
    sodium: 0,
    servingSize: "1일",
    source: "estimate" as const,
  };

  const advice = await generateAiAdvice(mockNutrition, "오늘 식단", daily);

  return (
    <div>
      <header className="bg-primary px-5 py-6 text-white">
        <h1 className="text-xl font-bold">AI 영양 조언</h1>
        <p className="mt-1 text-sm opacity-90">오늘 식단을 분석해 드려요</p>
      </header>

      <main className="space-y-5 px-4 py-5">
        {!user ? (
          <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
            <p className="font-medium">로그인하면 개인화 조언을 받을 수 있어요</p>
            <Link href="/login" className="mt-3 inline-block font-semibold text-primary">
              로그인하기 →
            </Link>
          </div>
        ) : logCount === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
            <p className="font-medium">아직 오늘 기록이 없어요</p>
            <p className="mt-1 text-sm text-muted">학식을 먹고 기록하면 AI가 분석해요</p>
            <Link href="/" className="mt-3 inline-block font-semibold text-primary">
              메뉴 검색하기 →
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-bold">오늘 누적 ({logCount}끼)</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>
                칼로리 <strong>{Math.round(daily.kcal)}</strong> / {DAILY_GOALS.kcal}kcal
              </p>
              <p>
                단백질 <strong>{Math.round(daily.protein)}</strong> / {DAILY_GOALS.protein}g
              </p>
            </div>
          </div>
        )}

        <AdviceList advice={advice} />
      </main>
    </div>
  );
}
