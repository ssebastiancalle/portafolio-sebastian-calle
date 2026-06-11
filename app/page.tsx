import Header from "@/components/Header";
import HomeCarousel from "@/components/HomeCarousel";
import { getAlbums } from "@/lib/albums";
import type { AlbumSlim } from "@/lib/types";

export default async function Home() {
  const supabaseAlbums = await getAlbums();

  const albums: AlbumSlim[] = supabaseAlbums.length > 0
    ? supabaseAlbums.map((a) => ({
        id: a.slug,
        label: a.name,
        coverUrl: a.cover_url,
        photoCount: a.photos?.length ?? 0,
      }))
    : [];

  return (
    <>
      <Header />
      <HomeCarousel albums={albums.length > 0 ? albums : undefined} />
    </>
  );
}
