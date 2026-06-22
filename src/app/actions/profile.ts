"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ProfileFormInput = {
  name: string;
  department: string;
  email: string;
  calorieGoal: number;
  proteinGoal: number;
};

export async function updateProfileAction(input: ProfileFormInput) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false as const, error: "LOGIN_REQUIRED" };
  }

  const name = input.name.trim();
  const department = input.department.trim();
  const email = input.email.trim();
  const calorieGoal = Math.min(10000, Math.max(500, Math.round(input.calorieGoal)));
  const proteinGoal = Math.min(500, Math.max(10, Math.round(input.proteinGoal)));

  if (!name) {
    return { ok: false as const, error: "이름을 입력해 주세요." };
  }

  if (!email) {
    return { ok: false as const, error: "이메일을 입력해 주세요." };
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    name,
    department: department || null,
    calorie_goal: calorieGoal,
    protein_goal: proteinGoal,
  });

  if (profileError) {
    return { ok: false as const, error: profileError.message };
  }

  const authPayload: { email?: string; data: { name: string; department: string } } = {
    data: { name, department },
  };

  if (email !== user.email) {
    authPayload.email = email;
  }

  const { error: userError } = await supabase.auth.updateUser(authPayload);

  if (userError) {
    return { ok: false as const, error: userError.message };
  }

  revalidatePath("/profile");
  revalidatePath("/profile/edit");
  revalidatePath("/advice");

  return {
    ok: true as const,
    emailChanged: email !== user.email,
  };
}
