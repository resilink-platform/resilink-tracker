import { createClient } from "@supabase/supabase-js";

// Supabase client — uses the public anon key (safe to expose in frontend)
// The anon key only has the permissions you set in Supabase dashboard
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

