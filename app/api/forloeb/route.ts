import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  FORLOEB_COLUMNS,
  parseForloebBody,
  toClient,
  type ForloebRow,
} from "@/lib/forloeb";

// CRUD for the user's forløbsbibliotek. The session lives in httpOnly cookies,
// so these handlers read it via the server client and rely on RLS
// (auth.uid() = user_id) to scope every row to the logged-in user.
export const dynamic = "force-dynamic";

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

  const { data, error } = await supabase
    .from("forloeb")
    .select(FORLOEB_COLUMNS)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json((data as ForloebRow[]).map(toClient));
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

  const parsed = parseForloebBody(await request.json().catch(() => null));
  if (!parsed) {
    return NextResponse.json({ error: "title_required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("forloeb")
    .insert({ ...parsed, user_id: user.id })
    .select(FORLOEB_COLUMNS)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(toClient(data as ForloebRow), { status: 201 });
}
