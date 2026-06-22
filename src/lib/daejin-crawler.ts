import type { CafeteriaMenu, MealType } from "@/types";
import { getServerEnv } from "@/lib/env/server";
import { FALLBACK_MENUS } from "./fallback-menus";

function getDaejinMenuUrls() {
  const { daejinCafeteriaUrl } = getServerEnv();

  return [
    daejinCafeteriaUrl,
    "https://www.daejin.ac.kr/kor/CMS/MenuMgr/menuListOnBuilding.do?mCode=MN215",
    "https://www.daejin.ac.kr/kor/CMS/MenuMgr/menuList.do?mCode=MN215",
  ].filter(Boolean) as string[];
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#40;/g, "(")
    .replace(/&#41;/g, ")")
    .replace(/&#47;/g, "/")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function stripHtml(value: string) {
  return decodeHtml(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mealTypeFromText(text: string): MealType {
  if (/조식|아침|breakfast/i.test(text)) return "breakfast";
  if (/석식|저녁|dinner/i.test(text)) return "dinner";
  return "lunch";
}

function cafeteriaFromText(text: string) {
  if (/기숙사|생활관/.test(text)) return "기숙사 식당";
  if (/학생회관|학생 식당|학생식당/.test(text)) return "학생회관 식당";
  return "대진대학교 식당";
}

function priceFromText(text: string) {
  const match = text.match(/([1-9]\d{0,2}(?:,\d{3})+|[3-9]\d{3})\s*원?/);
  return match ? Number(match[1].replace(/,/g, "")) : 0;
}

function normalizeMenuName(text: string) {
  return text
    .replace(/\b\d{4}[.-]\d{1,2}[.-]\d{1,2}\b/g, " ")
    .replace(/\b\d{1,2}[./]\d{1,2}\b/g, " ")
    .replace(/조식|중식|석식|아침|점심|저녁/g, " ")
    .replace(/가격|원|학생회관|학생식당|기숙사|생활관|식당/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildMenu(rawText: string, index: number): CafeteriaMenu | null {
  const text = stripHtml(rawText);
  const name = normalizeMenuName(text);

  if (name.length < 2 || !/[가-힣]/.test(name)) return null;

  return {
    id: `crawl-${todayString()}-${index}`,
    name,
    price: priceFromText(text),
    cafeteria: cafeteriaFromText(text),
    mealType: mealTypeFromText(text),
    date: todayString(),
  };
}

function parseTableRows(html: string) {
  return [...html.matchAll(/<tr[\s\S]*?<\/tr>/gi)]
    .map((row) => stripHtml(row[0]))
    .filter((row) => /[가-힣]/.test(row) && !/구분|식당|메뉴|가격/.test(row))
    .map(buildMenu)
    .filter((menu): menu is CafeteriaMenu => Boolean(menu));
}

function parseLooseText(html: string) {
  return stripHtml(html)
    .split(/(?:\d{4}[.-]\d{1,2}[.-]\d{1,2}|조식|중식|석식|아침|점심|저녁)/)
    .map(buildMenu)
    .filter((menu): menu is CafeteriaMenu => Boolean(menu));
}

function dedupeMenus(menus: CafeteriaMenu[]) {
  const seen = new Set<string>();
  return menus.filter((menu) => {
    const key = `${menu.name}-${menu.cafeteria}-${menu.mealType}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function crawlDaejinMenuPage(url: string) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 daejin-babfit menu crawler",
      Accept: "text/html,application/xhtml+xml",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`Daejin menu crawl failed: ${res.status}`);

  const html = await res.text();
  return dedupeMenus([...parseTableRows(html), ...parseLooseText(html)]).slice(0, 30);
}

/** 대진대학교 학식 페이지를 웹 크롤링해 메뉴를 조회한다. 실패하면 샘플 식단을 사용한다. */
export async function fetchDaejinMenus(): Promise<{
  menus: CafeteriaMenu[];
  source: "crawler" | "fallback";
}> {
  for (const url of getDaejinMenuUrls()) {
    try {
      const menus = await crawlDaejinMenuPage(url);
      if (menus.length > 0) return { menus, source: "crawler" };
    } catch {
      // 다음 URL 시도
    }
  }

  return { menus: FALLBACK_MENUS, source: "fallback" };
}
