import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";

async function auth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await auth()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;

  // Delete storage files first
  const { data: photos } = await supabaseAdmin
    .from("photos")
    .select("storage_path")
    .eq("album_id", id);

  if (photos?.length) {
    await supabaseAdmin.storage
      .from("Albumes")
      .remove(photos.map((p) => p.storage_path).filter(Boolean));
  }

  const { error } = await supabaseAdmin.from("albums").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await auth()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  const { visibility } = await req.json() as { visibility: string };

  const { error } = await supabaseAdmin
    .from("albums")
    .update({ visibility })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
