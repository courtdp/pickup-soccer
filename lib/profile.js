import { createSupabaseServer } from "@/lib/supabase/server";

export async function ensureProfile() {
  const supabase = await createSupabaseServer();

  // 1) Who is logged in?
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;

  const user = authData.user;
  if (!user) throw new Error("Not authenticated");

  // 2) Do we already have a profile row?
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError) throw profileError;

  // 3) If profile exists, stop here
  if (profile) return;

  // 4) Otherwise, create it with defaults
  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    (user.email ? user.email.split("@")[0] : "Player");

  const { error: insertError } = await supabase.from("profiles").insert({
    user_id: user.id,
    display_name: displayName,
    skill_level: "Casual",
    positions: [],
    home_area: "DC",
  });

  if (insertError) throw insertError;
}
