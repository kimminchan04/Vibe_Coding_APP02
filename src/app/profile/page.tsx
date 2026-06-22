import Link from "next/link";
import { redirect } from "next/navigation";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { Button } from "@/components/ui/button";
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
            <div className="mt-4 space-y-2">
              <Link href="/login" className="block">
                <ButtonColorful label="로그인" className="h-12 w-full rounded-xl" type="button" />
              </Link>
              <Button variant="outline" className="h-11 w-full rounded-xl" asChild>
                <Link href="/signup">회원가입</Link>
              </Button>
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

        <Link href="/profile/edit" className="block">
          <ButtonColorful label="프로필 수정" className="h-12 w-full rounded-xl" type="button" />
        </Link>

        <form action={signOut}>
          <Button
            type="submit"
            variant="outline"
            className="h-11 w-full rounded-xl border-accent/15 text-muted"
          >
            로그아웃
          </Button>
        </form>
      </main>
    </div>
  );
}
