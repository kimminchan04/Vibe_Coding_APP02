import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default async function ProfilePage() {
  let user = null;
  let profile: {
    name: string | null;
    department: string | null;
    calorie_goal: number | null;
    protein_goal: number | null;
  } | null = null;

  if (hasSupabaseEnv()) {
    try {
      const supabase = await createClient();
      const auth = await supabase.auth.getUser();
      user = auth.data.user;

      if (user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
        profile = data;
      }
    } catch {
      user = null;
    }
  }

  if (!user) {
    return (
      <div>
        <header className="bg-primary px-5 py-6 text-white">
          <h1 className="text-xl font-bold">프로필</h1>
        </header>
        <main className="px-4 py-10 text-center">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="font-medium">프로필을 보려면 로그인이 필요해요</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link href="/login" className="rounded-xl bg-accent py-3 font-semibold text-white">
                로그인
              </Link>
              <Link
                href="/signup"
                className="rounded-xl bg-primary/10 py-3 font-semibold text-primary"
              >
                회원가입
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  }

  return (
    <div>
      <header className="bg-primary px-5 py-6 text-white">
        <h1 className="text-xl font-bold">프로필</h1>
      </header>
      <main className="space-y-4 px-4 py-5">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-muted">이름</p>
          <p className="text-lg font-semibold">{profile?.name ?? "미설정"}</p>
          <p className="mt-3 text-sm text-muted">학과</p>
          <p className="font-medium">{profile?.department ?? "미설정"}</p>
          <p className="mt-3 text-sm text-muted">이메일</p>
          <p className="font-medium">{user.email}</p>
          <p className="mt-3 text-sm text-muted">일일 목표</p>
          <p className="font-medium">
            {profile?.calorie_goal ?? 2000}kcal · 단백질 {profile?.protein_goal ?? 60}g
          </p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="w-full rounded-xl border border-accent/15 bg-white py-3 font-medium text-muted"
          >
            로그아웃
          </button>
        </form>
      </main>
    </div>
  );
}
