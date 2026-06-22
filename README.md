# 대진밥핏 — 대진대학교 학식 영양·열량 분석

대진대학교 학생을 위한 **학식 메뉴 검색 + 영양 분석 + AI 식단 조언** 웹앱입니다.

## 기술 스택

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS (모바일 우선, 480px)
- Supabase (인증 · DB)
- Vercel 배포
- 밥대생 Open API · 식품의약품안전처 I2790 API

## 시작하기

```bash
npm install
cp .env.example .env.local
# .env.local 에 Supabase 키 등 입력
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## Supabase 설정

1. [Supabase](https://supabase.com)에서 프로젝트 생성
2. `supabase/schema.sql` 을 SQL Editor에서 실행
3. `.env.local`에 URL과 anon key 입력

## API 키 (선택)

| 키 | 용도 | 없을 때 |
|---|---|---|
| `BABLABS_API_KEY` | 밥대생 학식 데이터 | 샘플 식단 사용 |
| `FOOD_SAFETY_API_KEY` | 식약처 영양 DB | 추정 영양값 사용 |
| `OPENAI_API_KEY` | AI 자연어 조언 | 규칙 기반 조언만 |

## 기획 문서

- `docs/서비스-기획안.md`
- `docs/PRD.md`
- `docs/디자인-시스템.md`
- `docs/유저플로우.md`
- `docs/기능정의서.md`

## 배포 (Vercel)

1. GitHub 저장소 연결
2. Vercel Import → 환경변수 등록
3. Deploy

— 2026 대진대학교 바이브코딩
