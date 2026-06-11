import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { slugify } from "@/lib/albums";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  if (!session || session !== process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { name, photoUrls } = await req.json() as { name: string; photoUrls: string[] };

  if (!name || !photoUrls?.length) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const slug = slugify(name);

  const { data: album, error: albumError } = await supabaseAdmin
    .from("albums")
    .insert({ name, slug, cover_url: photoUrls[0] })
    .select()
    .single();

  if (albumError) {
    return NextResponse.json({ error: albumError.message }, { status: 500 });
  }

  const photos = photoUrls.map((url, i) => ({
    album_id: album.id,
    url,
    alt: `${name} ${i + 1}`,
    order: i,
  }));

  const { error: photosError } = await supabaseAdmin.from("photos").insert(photos);

  if (photosError) {
    return NextResponse.json({ error: photosError.message }, { status: 500 });
  }

  return NextResponse.json({ album });
}
