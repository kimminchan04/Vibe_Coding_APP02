"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  menuName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export function LogMealButton({ menuName, calories, protein, carbs, fat }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleLog() {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("meal_logs").insert({
      user_id: user.id,
      menu_name: menuName,
      calories,
      protein,
      carbs,
      fat,
    });

    setLoading(false);
    if (error) {
      alert("저장에 실패했어요. Supabase 설정을 확인해 주세요.");
      return;
    }
    setDone(true);
  }

  return (
    <button
      onClick={handleLog}
      disabled={loading || done}
      className="w-full rounded-xl bg-primary py-3.5 font-semibold text-white disabled:opacity-60"
    >
      {done ? "기록했어요!" : loading ? "저장 중..." : "식사 기록하기"}
    </button>
  );
}
