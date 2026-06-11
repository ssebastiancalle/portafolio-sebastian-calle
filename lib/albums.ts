import type { Album } from "./types";

const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function getAlbums(): Promise<Album[]> {
  if (!supabaseConfigured) return [];
  const { supabaseAdmin } = await import("./supabase-admin");
  const { data, error } = await supabaseAdmin
    .from("albums")
    .select("*, photos(*)")
    .order("order", { ascending: true })
    .order("order", { foreignTable: "photos", ascending: true });
  if (error) {
    console.error("getAlbums error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getAlbumBySlug(slug: string): Promise<Album | null> {
  if (!supabaseConfigured) return null;
  const { supabaseAdmin } = await import("./supabase-admin");
  const { data, error } = await supabaseAdmin
    .from("albums")
    .select("*, photos(*)")
    .eq("slug", slug)
    .order("order", { foreignTable: "photos", ascending: true })
    .single();
  if (error) return null;
  return data;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}
