import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

type SignupBody = {
  email?: string;
  password?: string;
  name?: string;
  department?: string;
};

function mapSignupError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("already") || lower.includes("registered")) {
    return "이미 가입된 이메일입니다. 로그인하거나 Supabase에서 기존 계정을 삭제한 뒤 다시 시도해 주세요.";
  }

  if (lower.includes("password")) {
    return "비밀번호는 6자 이상이어야 합니다.";
  }

  if (lower.includes("email")) {
    return "올바른 이메일 형식을 입력해 주세요.";
  }

  return message;
}

export async function POST(request: Request) {
  const admin = createAdminClient();

  if (!admin) {
    return NextResponse.json(
      {
        error:
          "서버 설정이 완료되지 않았습니다. .env.local에 SUPABASE_SERVICE_ROLE_KEY를 추가해 주세요.",
      },
      { status: 500 },
    );
  }

  let body: SignupBody;

  try {
    body = (await request.json()) as SignupBody;
  } catch {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";
  const name = body.name?.trim() ?? "";
  const department = body.department?.trim() ?? "";

  if (!email || !password || !name) {
    return NextResponse.json({ error: "이메일, 비밀번호, 이름을 입력해 주세요." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "비밀번호는 6자 이상이어야 합니다." }, { status: 400 });
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      department,
    },
  });

  if (error) {
    return NextResponse.json({ error: mapSignupError(error.message) }, { status: 400 });
  }

  return NextResponse.json({ userId: data.user.id });
}
