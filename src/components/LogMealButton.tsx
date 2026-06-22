"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { logMealAction } from "@/app/actions/meal-log";
import { ButtonColorful } from "@/components/ui/button-colorful";

type Props = {
  menuName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export function LogMealButton({ menuName, calories, protein, carbs, fat }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleLog() {
    setLoading(true);
    setError("");

    const result = await logMealAction({
      menuName,
      calories,
      protein,
      carbs,
      fat,
      path: pathname,
    });

    setLoading(false);

    if (!result.ok) {
      if (result.error === "LOGIN_REQUIRED") {
        router.push("/login?redirect=" + encodeURIComponent(pathname));
        return;
      }

      setError(
        result.error.includes("permission") || result.error.includes("policy")
          ? "저장 권한이 없어요. Supabase에서 supabase/fix-meal-logs.sql을 실행해 주세요."
          : "저장에 실패했어요. 잠시 후 다시 시도해 주세요.",
      );
      return;
    }

    setDone(true);
    router.refresh();
  }

  return (
    <div className="space-y-2">
      <ButtonColorful
        type="button"
        onClick={handleLog}
        disabled={loading || done}
        label={done ? "기록했어요!" : loading ? "저장 중..." : "식사 기록하기"}
        className="h-12 w-full rounded-xl disabled:opacity-60"
      />
      {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
