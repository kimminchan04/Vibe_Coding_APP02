"use client";

import { useCallback, useEffect, useState } from "react";
import type { CafeteriaMenu } from "@/types";
import { isFavoriteMenu, loadFavorites, toggleFavorite } from "@/lib/favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<CafeteriaMenu[]>([]);

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  const toggle = useCallback((menu: CafeteriaMenu) => {
    setFavorites(toggleFavorite(menu));
  }, []);

  const isFavorite = useCallback(
    (menu: CafeteriaMenu) => isFavoriteMenu(menu, favorites),
    [favorites],
  );

  return { favorites, toggleFavorite: toggle, isFavorite };
}
