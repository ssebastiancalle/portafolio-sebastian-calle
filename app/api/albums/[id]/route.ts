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
  const body = await req.json() as {
    visibility?: string;
    photoOrder?: string[];
    photoScales?: { id: string; scale: number; visibility: string }[];
    photoPositions?: { id: string; canvas_x: number; canvas_y: number; canvas_w: number; canvas_h: number; visibility: string }[];
  };

  if (body.photoPositions) {
    const updates = (body.photoPositions as { id: string; canvas_x: number | null; canvas_y: number | null; canvas_w: number | null; canvas_h: number | null; visibility: string }[]).map((p) =>
      supabaseAdmin.from("photos").update({
        canvas_x: p.canvas_x,
        canvas_y: p.canvas_y,
        canvas_w: p.canvas_w,
        canvas_h: p.canvas_h,
        visibility: p.visibility,
      }).eq("id", p.id).eq("album_id", id)
    );
    await Promise.all(updates);
    return NextResponse.json({ ok: true });
  }

  if (body.photoOrder) {
    const scales: Record<string, { scale: number; visibility: string }> = {};
    if (body.photoScales) {
      for (const s of body.photoScales) scales[s.id] = { scale: s.scale, visibility: s.visibility };
    }
    const updates = body.photoOrder.map((photoId, i) =>
      supabaseAdmin.from("photos").update({
        order: i,
        ...(scales[photoId] ? { scale: scales[photoId].scale, visibility: scales[photoId].visibility } : {}),
      }).eq("id", photoId).eq("album_id", id)
    );
    await Promise.all(updates);
    return NextResponse.json({ ok: true });
  }

  const albumUpdate: Record<string, string> = {};
  if (body.visibility) albumUpdate.visibility = body.visibility;
  if ((body as Record<string, unknown>).cover_url) albumUpdate.cover_url = (body as Record<string, unknown>).cover_url as string;

  if (Object.keys(albumUpdate).length) {
    const { error } = await supabaseAdmin.from("albums").update(albumUpdate).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
