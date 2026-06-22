import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="font-medium">로그인이 필요해요</p>
        <div className="mt-4 flex flex-col gap-2">
          <Link
            href="/login"
            className="rounded-xl bg-primary py-3 font-semibold text-white"
          >
            로그인
          </Link>
          <Link href="/signup" className="text-sm text-primary">
            회원가입
          </Link>
        </div>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

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
            className="w-full rounded-xl border border-gray-200 py-3 font-medium text-muted"
          >
            로그아웃
          </button>
        </form>
      </main>
    </div>
  );
}
