"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { createClient } from "@/lib/supabase/client";

function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function withTimeout<T>(promise: PromiseLike<T>, ms = 10000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("요청 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.")), ms),
    ),
  ]);
}

export function SignupPageClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!hasSupabaseEnv()) {
      setError("Supabase 환경변수가 설정되지 않았습니다. .env.local을 확인해 주세요.");
      return;
    }

    setLoading(true);

    try {
      const trimmedEmail = email.trim();
      const trimmedName = name.trim();
      const trimmedDepartment = department.trim();

      const signupResponse = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          password,
          name: trimmedName,
          department: trimmedDepartment,
        }),
      });

      const signupResult = (await signupResponse.json()) as { error?: string; userId?: string };

      if (!signupResponse.ok) {
        setError(signupResult.error ?? "회원가입에 실패했습니다.");
        return;
      }

      const supabase = createClient();
      const { error: signInError } = await withTimeout(
        supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        }),
      );

      if (signInError) {
        setError(getAuthErrorMessage(signInError, "login"));
        return;
      }

      if (signupResult.userId) {
        await supabase
          .from("profiles")
          .update({
            name: trimmedName,
            department: trimmedDepartment || null,
            calorie_goal: 2000,
            protein_goal: 60,
          })
          .eq("id", signupResult.userId);
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-xl border border-accent/15 px-4 py-3"
          placeholder="홍길동"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">학과 (선택)</label>
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full rounded-xl border border-accent/15 px-4 py-3"
          placeholder="AI융합학부"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-xl border border-accent/15 px-4 py-3"
          placeholder="student@daejin.ac.kr"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">비밀번호 (6자 이상)</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full rounded-xl border border-accent/15 px-4 py-3"
        />
      </div>
      {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-accent py-3.5 font-semibold text-white disabled:opacity-60"
      >
        {loading ? "가입 중..." : "회원가입"}
      </button>
      <p className="text-center text-sm text-muted">
        이미 계정이 있나요?{" "}
        <Link href="/login" className="font-semibold text-accent">
          로그인
        </Link>
      </p>
    </form>
  );
}
