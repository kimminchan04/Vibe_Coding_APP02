import { HomeSearch } from "@/components/HomeSearch";
import { fetchDaejinMenus } from "@/lib/daejin-crawler";

export default async function HomePage() {
  const { menus, source } = await fetchDaejinMenus();
  return <HomeSearch menus={menus} source={source} />;
}
