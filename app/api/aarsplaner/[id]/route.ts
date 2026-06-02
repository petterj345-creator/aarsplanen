import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// Read / update / delete a single saved årsplan. RLS keeps the id-based
// queries safe: a user can only reach their own rows.
export const dynamic = "force-dynamic";

function intOrNull(v: unknown): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { data, error } = await supabase
    .from("aarsplaner")
    .select("id, title, fag, klasse, start_uge, slut_uge, start_aar, weeks, updated_at")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  // title present in body => set it (empty/whitespace clears to null => fallback)
  if ("title" in body) {
    const t = typeof body.title === "string" ? body.title.trim() : "";
    patch.title = t || null;
  }
  if (typeof body.fag === "string") patch.fag = body.fag;
  if (typeof body.klasse === "string") patch.klasse = body.klasse;
  if ("start_uge" in body) patch.start_uge = intOrNull(body.start_uge) ?? 0;
  if ("slut_uge" in body) patch.slut_uge = intOrNull(body.slut_uge) ?? 0;
  if ("start_aar" in body) patch.start_aar = intOrNull(body.start_aar) ?? 0;
  if (Array.isArray(body.weeks)) patch.weeks = body.weeks;

  const { data, error } = await supabase
    .from("aarsplaner")
    .update(patch)
    .eq("id", id)
    .select("id, title, fag, klasse, start_aar, updated_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { error } = await supabase.from("aarsplaner").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return new NextResponse(null, { status: 204 });
}
