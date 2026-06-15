import { getAlbums } from "@/lib/albums";
import type { MetadataRoute } from "next";

const BASE_URL = "https://sebastiancalle.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const albums = await getAlbums();

  const albumRoutes = albums.map((album) => ({
    url: `${BASE_URL}/album/${album.slug}`,
    lastModified: new Date(album.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/portfolio`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    ...albumRoutes,
  ];
}
