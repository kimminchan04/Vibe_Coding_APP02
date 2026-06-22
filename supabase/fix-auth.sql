-- 기존 미인증 계정 일괄 활성화 (개발·테스트용)
-- Supabase Dashboard > SQL Editor 에서 실행하세요.
-- Confirm email을 끈 뒤에도, 예전에 만든 계정은 인증되지 않은 상태로 남아 있을 수 있습니다.

UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, now())
WHERE email_confirmed_at IS NULL;
