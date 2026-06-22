import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function LogsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="font-medium">로그인이 필요해요</p>
        <Link href="/login" className="mt-3 inline-block font-semibold text-primary">
          로그인하기 →
        </Link>
      </div>
    );
  }

  const { data: logs } = await supabase
    .from("meal_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false })
    .limit(30);

  return (
    <div>
      <header className="bg-primary px-5 py-6 text-white">
        <h1 className="text-xl font-bold">내 식사 기록</h1>
      </header>
      <main className="space-y-3 px-4 py-5">
        {!logs?.length ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="font-medium">기록이 없어요</p>
            <Link href="/" className="mt-2 inline-block text-sm text-primary">
              학식 메뉴 검색하기 →
            </Link>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="font-semibold">{log.menu_name}</p>
              <p className="mt-1 text-sm text-muted">
                {new Date(log.logged_at).toLocaleString("ko-KR")} · {log.calories}kcal ·
                단백질 {log.protein}g
              </p>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
