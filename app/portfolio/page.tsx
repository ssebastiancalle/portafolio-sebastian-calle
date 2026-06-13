import Header from "@/components/Header";
import PortfolioGrid from "@/components/PortfolioGrid";
import { getAlbums } from "@/lib/albums";
import { categories } from "@/data/categories";
import type { AlbumSlim } from "@/lib/types";

export default async function PortfolioPage() {
  const supabaseAlbums = await getAlbums();

  const albums: AlbumSlim[] = supabaseAlbums.length > 0
    ? supabaseAlbums
        .filter((a) => a.cover_url && (a.name || a.title))
        .map((a) => ({
          id: a.slug,
          label: (a.name || a.title)!,
          coverUrl: a.cover_url!,
          photoCount: a.photos?.length ?? 0,
        }))
    : categories.map((c) => ({
        id: c.id,
        label: c.label,
        coverUrl: c.photos[0].url,
        photoCount: c.photos.length,
      }));

  return (
    <>
      <Header />
      <PortfolioGrid albums={albums} />
    </>
  );
}
