import { notFound } from "next/navigation";
import AlbumView from "@/components/AlbumView";
import { getAlbums, getAlbumBySlug } from "@/lib/albums";
import { categories } from "@/data/categories";
import type { LightboxPhoto } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AlbumPage({ params }: Props) {
  const { id } = await params;

  // Try Supabase first
  const supabaseAlbum = await getAlbumBySlug(id);

  if (supabaseAlbum) {
    const allAlbums = await getAlbums();
    const idx = allAlbums.findIndex((a) => a.slug === id);
    const prev = idx > 0 ? { id: allAlbums[idx - 1].slug, label: allAlbums[idx - 1].name || allAlbums[idx - 1].title } : null;
    const next = idx < allAlbums.length - 1 ? { id: allAlbums[idx + 1].slug, label: allAlbums[idx + 1].name || allAlbums[idx + 1].title } : null;

    const photos: LightboxPhoto[] = (supabaseAlbum.photos ?? [])
      .filter((p) => p.url)
      .map((p) => {
        const extra = p as Record<string, unknown>;
        return {
          id: p.id,
          url: p.url!,
          alt: p.alt ?? "",
          width: p.width,
          height: p.height,
          scale: extra.scale as number | undefined,
          canvas_x: extra.canvas_x as number | null | undefined,
          canvas_y: extra.canvas_y as number | null | undefined,
          canvas_w: extra.canvas_w as number | null | undefined,
          canvas_h: extra.canvas_h as number | null | undefined,
        };
      });

    return (
      <AlbumView
        label={supabaseAlbum.name || supabaseAlbum.title}
        description={supabaseAlbum.description}
        albumIndex={idx}
        totalAlbums={allAlbums.length}
        photos={photos}
        prev={prev}
        next={next}
      />
    );
  }

  // Fall back to hardcoded categories
  const idx = categories.findIndex((c) => c.id === id);
  if (idx === -1) notFound();

  const cat = categories[idx];
  const prev = idx > 0 ? { id: categories[idx - 1].id, label: categories[idx - 1].label } : null;
  const next = idx < categories.length - 1 ? { id: categories[idx + 1].id, label: categories[idx + 1].label } : null;

  const photos: LightboxPhoto[] = cat.photos.map((p) => ({
    id: p.id,
    url: p.url,
    alt: p.alt,
    meta: { title: p.meta.title, publication: p.meta.publication },
  }));

  return (
    <AlbumView
      label={cat.label}
      albumIndex={idx}
      totalAlbums={categories.length}
      photos={photos}
      prev={prev}
      next={next}
    />
  );
}
