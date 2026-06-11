import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  if (!session || session !== process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

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

  return NextResponse.json({ url: publicUrl });
}
