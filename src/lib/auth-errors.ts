import type { AuthError } from "@supabase/supabase-js";

export function getAuthErrorMessage(error: AuthError, context: "login" | "signup"): string {
  const code = error.code ?? "";
  const message = error.message.toLowerCase();

  if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
    return "이 계정은 아직 활성화되지 않았습니다. Supabase SQL Editor에서 supabase/fix-auth.sql을 실행하거나, Authentication > Users에서 Confirm user를 눌러 주세요.";
  }

  if (code === "invalid_credentials" || message.includes("invalid login credentials")) {
    return "이메일 또는 비밀번호를 확인해 주세요.";
  }

  if (code === "user_already_exists" || message.includes("already registered")) {
    return "이미 가입된 이메일입니다.";
  }

  if (code === "weak_password" || message.includes("password")) {
    return "비밀번호는 6자 이상이어야 합니다.";
  }

  if (context === "login") {
    return "로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.";
  }

  return error.message;
}
