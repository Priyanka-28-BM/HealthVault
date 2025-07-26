import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// fixed use VITE_SUPABASE_ANON_KEY, instead of VITE_APP_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey);
