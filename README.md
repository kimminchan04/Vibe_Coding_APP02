# 대진밥핏 - 대진대학교 학식 영양·열량 분석

대진대학교 학생을 위한 **학식 메뉴 검색 + 영양 분석 + AI 식단 조언** 웹앱입니다.

## 기술 스택

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Supabase (인증 · DB)
- 대진대학교 학식 페이지 웹 크롤링
- 메뉴명 기반 영양 분석

## 시작하기

```bash
npm install
cp .env.example .env.local
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)에 접속합니다.

## Supabase 설정

1. [Supabase](https://supabase.com)에서 프로젝트를 생성합니다.
2. `supabase/schema.sql`을 SQL Editor에서 실행합니다.
3. `.env.local`에 URL, anon key, **service_role key**를 입력합니다.
   - service_role: Dashboard > Project Settings > API > `service_role` (서버 전용, Git에 올리지 마세요)
4. **Authentication > Sign In / Providers > Email**에서 **Confirm email**을 끕니다.
5. 예전에 만든 계정으로 로그인이 안 되면 `supabase/fix-auth.sql`을 SQL Editor에서 실행합니다.
6. **Authentication > URL Configuration**에서 Site URL을 `http://localhost:3000`(배포 시 Vercel 도메인)으로 설정합니다.

## 환경변수

| 변수 | 용도 | 없을 때 |
|---|---|---|
| `DAEJIN_CAFETERIA_URL` | 대진대학교 학식 크롤링 대상 URL | 기본 후보 URL 시도 후 샘플 식단 사용 |
| `OPENAI_API_KEY` | AI 자연어 조언 | 규칙 기반 조언 사용 |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 연결 | 로그인/기록 기능 제한 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 공개 키 | 로그인/기록 기능 제한 |
| `SUPABASE_SERVICE_ROLE_KEY` | 서버 전용, 회원가입 즉시 활성화 | 회원가입 API 동작 안 함 |

영양 정보는 식품의약품안전처 API를 호출하지 않고, 메뉴명에서 주재료와 조리법을 분석해 학식 1인분 기준 추정값으로 계산합니다.

## 기획 문서

- `docs/서비스-기획안.md`
- `docs/PRD.md`
- `docs/디자인-시스템.md`
- `docs/유저플로우.md`
- `docs/기능정의서.md`

2026 대진대학교 바이브코딩
