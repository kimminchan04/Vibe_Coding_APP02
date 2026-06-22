"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateProfileAction } from "@/app/actions/profile";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { Button } from "@/components/ui/button";

type Props = {
  initial: {
    name: string;
    department: string;
    email: string;
    calorieGoal: number;
    proteinGoal: number;
  };
};

const fieldClass =
  "w-full rounded-xl border border-accent/15 bg-white px-4 py-3 text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";

export function ProfileEditForm({ initial }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [department, setDepartment] = useState(initial.department);
  const [email, setEmail] = useState(initial.email);
  const [calorieGoal, setCalorieGoal] = useState(String(initial.calorieGoal));
  const [proteinGoal, setProteinGoal] = useState(String(initial.proteinGoal));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const result = await updateProfileAction({
      name,
      department,
      email,
      calorieGoal: Number(calorieGoal),
      proteinGoal: Number(proteinGoal),
    });

    setLoading(false);

    if (!result.ok) {
      if (result.error === "LOGIN_REQUIRED") {
        router.push("/login?redirect=/profile/edit");
        return;
      }
      setError(result.error);
      return;
    }

    setSuccess(
      result.emailChanged
        ? "저장했어요. 이메일을 바꾼 경우 확인 메일을 확인해 주세요."
        : "프로필을 저장했어요.",
    );
    router.refresh();
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
          className={fieldClass}
          placeholder="홍길동"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">학과</label>
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className={fieldClass}
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
          className={fieldClass}
          placeholder="student@daejin.ac.kr"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">일일 칼로리 목표 (kcal)</label>
          <input
            type="number"
            min={500}
            max={10000}
            value={calorieGoal}
            onChange={(e) => setCalorieGoal(e.target.value)}
            required
            className={fieldClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">단백질 목표 (g)</label>
          <input
            type="number"
            min={10}
            max={500}
            value={proteinGoal}
            onChange={(e) => setProteinGoal(e.target.value)}
            required
            className={fieldClass}
          />
        </div>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      {success && (
        <p className="rounded-xl bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>
      )}

      <ButtonColorful
        type="submit"
        disabled={loading}
        label={loading ? "저장 중..." : "저장하기"}
        className="h-12 w-full rounded-xl disabled:opacity-60"
      />

      <Button type="button" variant="outline" className="h-11 w-full rounded-xl" asChild>
        <Link href="/profile">프로필로 돌아가기</Link>
      </Button>
    </form>
  );
}
