// Central place to read the Supabase environment variables. Both must be set
// in .env.local (see .env.example). Until then the app degrades gracefully
// instead of crashing — see isSupabaseConfigured().
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
