import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";

// .env.local 포함 프로젝트 환경변수를 Next.js 서버·빌드 단계에서 먼저 로드
loadEnvConfig(process.cwd());

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
