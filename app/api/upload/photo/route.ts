import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const formData = await req.formData();
  const photo = formData.get("photo") as File | null;

  if (!photo) {
    return NextResponse.json({ error: "Falta la foto" }, { status: 400 });
  }

  const buffer = await photo.arrayBuffer();
  const fileName = `${Date.now()}-${crypto.randomUUID()}.webp`;

  const { data, error } = await supabaseAdmin.storage
    .from("photos")
    .upload(fileName, buffer, { contentType: "image/webp", upsert: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from("photos")
    .getPublicUrl(data.path);

  return NextResponse.json({ url: publicUrl, storagePath: data.path, filename: fileName });
}
