import { HomeSearch } from "@/components/HomeSearch";
import { fetchDaejinMenus } from "@/lib/bablabs";

export default async function HomePage() {
  const { menus, source } = await fetchDaejinMenus();
  return <HomeSearch menus={menus} source={source} />;
}
