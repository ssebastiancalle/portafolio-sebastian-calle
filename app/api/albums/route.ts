import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { slugify } from "@/lib/albums";
import { createClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  type PhotoPayload = {
    url: string;
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

  const photos = photoPayloads.map(({ url, exif }, i) => ({
    album_id: album.id,
    url,
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
