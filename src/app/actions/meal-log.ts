"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type LogMealInput = {
  menuName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  path?: string;
};

export async function logMealAction(input: LogMealInput) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false as const, error: "LOGIN_REQUIRED" };
  }

  const { error } = await supabase.from("meal_logs").insert({
    user_id: user.id,
    menu_name: input.menuName,
    calories: input.calories,
    protein: input.protein,
    carbs: input.carbs,
    fat: input.fat,
  });

  if (error) {
    return { ok: false as const, error: error.message };
  }

  if (input.path) {
    revalidatePath(input.path);
  }
  revalidatePath("/logs");
  revalidatePath("/advice");

  return { ok: true as const };
}
