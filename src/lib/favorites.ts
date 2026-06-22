import type { CafeteriaMenu } from "@/types";

const STORAGE_KEY = "daejin-favorite-menus";

export function favoriteKey(menu: Pick<CafeteriaMenu, "name" | "cafeteria" | "mealType">) {
  return `${menu.name}::${menu.cafeteria}::${menu.mealType}`;
}

export function loadFavorites(): CafeteriaMenu[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CafeteriaMenu[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFavorites(menus: CafeteriaMenu[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(menus));
}

export function toggleFavorite(menu: CafeteriaMenu): CafeteriaMenu[] {
  const favorites = loadFavorites();
  const key = favoriteKey(menu);
  const next = favorites.some((item) => favoriteKey(item) === key)
    ? favorites.filter((item) => favoriteKey(item) !== key)
    : [...favorites, menu];

  saveFavorites(next);
  return next;
}

export function isFavoriteMenu(menu: CafeteriaMenu, favorites: CafeteriaMenu[]) {
  return favorites.some((item) => favoriteKey(item) === favoriteKey(menu));
}

export function resolveFavoriteMenu(favorite: CafeteriaMenu, menus: CafeteriaMenu[]) {
  return menus.find((menu) => favoriteKey(menu) === favoriteKey(favorite)) ?? favorite;
}

export function isMenuAvailableToday(favorite: CafeteriaMenu, menus: CafeteriaMenu[]) {
  return menus.some((menu) => favoriteKey(menu) === favoriteKey(favorite));
}
