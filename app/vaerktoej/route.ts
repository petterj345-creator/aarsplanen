import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// The planning tool lives outside /public so it can't be reached without auth.
// This handler verifies the session, then serves the HTML document.
export const dynamic = "force-dynamic";

const NOT_CONFIGURED = `<!DOCTYPE html><html lang="da"><head><meta charset="UTF-8">
<title>Årsplanen</title><style>body{font-family:system-ui,sans-serif;background:#F2EDE2;color:#1C1B17;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;padding:24px;text-align:center}</style></head>
<body><div><h1>Supabase er ikke konfigureret endnu</h1><p>Tilføj <code>NEXT_PUBLIC_SUPABASE_URL</code> og <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> i <code>.env.local</code> og genstart serveren.</p></div></body></html>`;

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return new NextResponse(NOT_CONFIGURED, {
      status: 503,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let html = readFileSync(join(process.cwd(), "content", "aarsplan.html"), "utf8");

  // Add a "Log ud" button into the existing action bar (uses the tool's own
  // .btn styling and doesn't collide with the page's own scripts).
  html = html.replace(
    '<div class="config-actions">',
    '<div class="config-actions"><a href="/logout" class="btn">Log ud</a>'
  );

  return new NextResponse(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
