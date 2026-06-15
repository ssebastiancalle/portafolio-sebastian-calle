import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json() as { visibility?: string; alt?: string };

  const update: Record<string, unknown> = {};
  if (body.visibility !== undefined) update.visibility = body.visibility;
  if (body.alt !== undefined) update.alt = body.alt;

  const { error } = await supabaseAdmin.from("photos").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;

  const { data: photo } = await supabaseAdmin
    .from("photos")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (photo?.storage_path) {
    await supabaseAdmin.storage.from("Albumes").remove([photo.storage_path]);
  }

  const { error } = await supabaseAdmin.from("photos").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
