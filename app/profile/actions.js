"use server";

import { createSupabaseServer } from "@/lib/supabase/server";

export async function updateProfile(formData) {
  // 1) Create Supabase server client (has the user's cookies)
  const supabase = await createSupabaseServer();

  // 2) Get current logged-in user
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;

  const user = authData.user;
  if (!user) throw new Error("Not authenticated");

  // 3) Read fields from the form submission
  const display_name = String(formData.get("display_name") || "").trim();
  const home_area = String(formData.get("home_area") || "").trim();

  // skill_level comes in as text, so convert to a number
  const skill_level = String(formData.get("skill_level") || "Casual");


  // Positions typed like: "CM, CB, ST"
const positions = formData.getAll("positions");


  // 4) Update the user's profile row
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      display_name,
      home_area,
      skill_level,
      positions,
    })
    .eq("user_id", user.id);

  if (updateError) throw updateError;
}
