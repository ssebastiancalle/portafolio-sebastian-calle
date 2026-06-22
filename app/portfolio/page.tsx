export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore Sebastian Calle's fashion, portrait, and editorial photography portfolio. Commercial and artistic work spanning Buenos Aires and Barcelona.",
  openGraph: {
    title: "Photography Portfolio | Sebastian Calle",
    description:
      "Explore Sebastian Calle's fashion, portrait, and editorial photography portfolio. Commercial and artistic work spanning Buenos Aires and Barcelona.",
    url: "https://sebastiancalle.com/portfolio",
  },
};
import PortfolioGrid from "@/components/PortfolioGrid";
import { getAlbums } from "@/lib/albums";
import { categories } from "@/data/categories";
import type { AlbumSlim } from "@/lib/types";

export default async function PortfolioPage() {
  const supabaseAlbums = await getAlbums();

  const albums: AlbumSlim[] = supabaseAlbums.length > 0
    ? supabaseAlbums
        .filter((a) => a.cover_url && (a.name || a.title))
        .map((a) => {
          const coverPhoto = a.photos?.find((p) => p.url === a.cover_url);
          const coverAspectRatio = coverPhoto?.width && coverPhoto?.height
            ? coverPhoto.width / coverPhoto.height
            : undefined;
          return {
            id: a.slug,
            label: (a.name || a.title)!,
            coverUrl: a.cover_url!,
            photoCount: a.photos?.length ?? 0,
            coverAspectRatio,
          };
        })
    : categories.map((c) => ({
        id: c.id,
        label: c.label,
        coverUrl: c.photos[0].url,
        photoCount: c.photos.length,
      }));

  return (
    <>
      <Header />
      <h1 className="sr-only">Photography Portfolio — Sebastian Calle</h1>
      <PortfolioGrid albums={albums} />
    </>
  );
}
