import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// Saved årsplaner (whole year plans) for the logged-in user. Cookie session +
// RLS (auth.uid() = user_id) scope every row to its owner. The week placements
// live in the `weeks` jsonb column; the rest are real columns.
export const dynamic = "force-dynamic";

function intOrNull(v: unknown): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

export async function GET() {
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

  // Enough to render the list + the "Fag · Klasse · År" fallback title.
  // The (larger) weeks blob is only fetched when a plan is opened.
  const { data, error } = await supabase
    .from("aarsplaner")
    .select("id, title, fag, klasse, start_aar, updated_at")
    .eq("archived", false)
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: Request) {
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

  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // title is optional — null means "use the auto-generated Fag · Klasse · År".
  const rawTitle = typeof body.title === "string" ? body.title.trim() : "";
  const row = {
    user_id: user.id,
    title: rawTitle || null,
    fag: typeof body.fag === "string" ? body.fag : "",
    klasse: typeof body.klasse === "string" ? body.klasse : "",
    start_uge: intOrNull(body.start_uge) ?? 0,
    slut_uge: intOrNull(body.slut_uge) ?? 0,
    start_aar: intOrNull(body.start_aar) ?? 0,
    weeks: Array.isArray(body.weeks) ? body.weeks : [],
  };

  const { data, error } = await supabase
    .from("aarsplaner")
    .insert(row)
    .select("id, title, fag, klasse, start_aar, updated_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
