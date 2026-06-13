import type { Album } from "./types";

const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function getAlbums(): Promise<Album[]> {
  if (!supabaseConfigured) return [];
  const { supabaseAdmin } = await import("./supabase-admin");

  let { data, error } = await supabaseAdmin
    .from("albums")
    .select("*, photos(*)")
    .eq("visibility", "public")
    .order("order", { ascending: true })
    .order("order", { foreignTable: "photos", ascending: true });

  if (error) {
    // Fallback: fetch without photos join (foreign key may not be set up)
    const fallback = await supabaseAdmin
      .from("albums")
      .select("*")
      .eq("visibility", "public")
      .order("order", { ascending: true });
    if (fallback.error) {
      console.error("getAlbums error:", fallback.error.message);
      return [];
    }
    data = fallback.data?.map((a) => ({ ...a, photos: [] })) ?? [];
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
    .neq("photos.visibility", "private")
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
