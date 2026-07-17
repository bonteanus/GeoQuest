import PlaceholderScreen from "../components/PlaceholderScreen";
import { useGeoQuest } from "../context/GeoQuestContext";

export default function LogFindScreen({ route }) {
  const { caches } = useGeoQuest();

  const cacheID = Number(route.params?.cacheID);

  const cache = caches.find(
    (item) => item.CacheID === cacheID
  );

  return (
    <PlaceholderScreen
      title={`Log ${cache?.CacheName ?? "Cache"}`}
      message="This cache is unlocked. Camera evidence and discovery confirmation will be added in the next feature."
    />
  );
}