import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { slugify } from "@/lib/albums";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  let { data, error } = await supabaseAdmin
    .from("albums")
    .select("id, name, title, slug, cover_url, visibility, created_at, description, photos(id, url, alt, order, width, height, scale, visibility, canvas_x, canvas_y, canvas_w, canvas_h)")
    .order("order", { ascending: true });

  // If the join fails (e.g. photos table issue), retry without it
  if (error) {
    const fallback = await supabaseAdmin
      .from("albums")
      .select("id, name, title, slug, cover_url, visibility, created_at")
      .order("order", { ascending: true });
    if (fallback.error) return NextResponse.json({ error: fallback.error.message }, { status: 500 });
    data = fallback.data?.map((a) => ({ ...a, description: (a as Record<string, unknown>).description ?? null, photos: [] })) ?? [];
  }

  return NextResponse.json({ albums: data });
}

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { albumOrder } = await req.json() as { albumOrder: string[] };
  if (!Array.isArray(albumOrder)) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  await Promise.all(
    albumOrder.map((id, i) => supabaseAdmin.from("albums").update({ order: i }).eq("id", id))
  );

  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  type PhotoPayload = {
    url: string;
    storagePath: string;
    filename: string;
    exif?: {
      taken_at?: string;
      lat?: number;
      lng?: number;
      altitude?: number;
      camera_make?: string;
      camera_model?: string;
      width?: number;
      height?: number;
      exif_raw?: Record<string, unknown>;
    };
  };

  const { name, description, photos: photoPayloads } = await req.json() as { name: string; description?: string; photos: PhotoPayload[] };

  if (!name || !photoPayloads?.length) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const slug = slugify(name);

  const { data: album, error: albumError } = await supabaseAdmin
    .from("albums")
    .insert({ title: name, name, slug, description, cover_url: photoPayloads[0].url })
    .select()
    .single();

  if (albumError) {
    return NextResponse.json({ error: albumError.message }, { status: 500 });
  }

  const photos = photoPayloads.map(({ url, storagePath, filename, exif }, i) => ({
    album_id: album.id,
    url,
    storage_path: storagePath,
    filename,
    mime_type: "image/webp",
    alt: `${name} ${i + 1}`,
    order: i,
    ...(exif?.taken_at && { taken_at: exif.taken_at }),
    ...(exif?.lat != null && { lat: exif.lat }),
    ...(exif?.lng != null && { lng: exif.lng }),
    ...(exif?.altitude != null && { altitude: exif.altitude }),
    ...(exif?.camera_make && { camera_make: exif.camera_make }),
    ...(exif?.camera_model && { camera_model: exif.camera_model }),
    ...(exif?.width && { width: exif.width }),
    ...(exif?.height && { height: exif.height }),
    ...(exif?.exif_raw && { exif_raw: exif.exif_raw }),
  }));

  const { error: photosError } = await supabaseAdmin.from("photos").insert(photos);

  if (photosError) {
    return NextResponse.json({ error: photosError.message }, { status: 500 });
  }

  return NextResponse.json({ album });
}
