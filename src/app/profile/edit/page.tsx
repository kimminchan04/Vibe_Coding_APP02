import Link from "next/link";
import { redirect } from "next/navigation";
import { ProfileEditForm } from "@/components/ProfileEditForm";
import { createClient } from "@/lib/supabase/server";

function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default async function ProfileEditPage() {
  if (!hasSupabaseEnv()) {
    redirect("/profile");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/profile/edit");
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

  return (
    <div>
      <header className="bg-primary px-5 py-6 text-white">
        <Link href="/profile" className="text-sm opacity-80">
          ← 프로필
        </Link>
        <h1 className="mt-2 text-xl font-bold">프로필 수정</h1>
        <p className="mt-1 text-sm opacity-90">이름 · 학과 · 이메일 · 일일 목표</p>
      </header>
      <main className="px-4 py-5">
        <ProfileEditForm
          initial={{
            name: profile?.name ?? "",
            department: profile?.department ?? "",
            email: user.email ?? "",
            calorieGoal: profile?.calorie_goal ?? 2000,
            proteinGoal: profile?.protein_goal ?? 60,
          }}
        />
      </main>
    </div>
  );
}
