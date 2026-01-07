import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/profile";
import { updateProfile } from "./actions";

export default async function ProfilePage() {
  // 1) Ensure a profile exists for this user
  await ensureProfile();

  // 2) Create Supabase server client
  const supabase = await createSupabaseServer();

  // 3) Get the logged-in user
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;

  const user = authData.user;
  if (!user) throw new Error("Not authenticated");

  // 4) Load the user's profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (profileError) throw profileError;

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Your Profile</h1>

      <p style={{ marginTop: 8 }}>
        <Link href="/games">← Back to Games</Link>
      </p>

      <form
        action={updateProfile}
        style={{ marginTop: 20, display: "grid", gap: 12 }}
      >
        {/* Display Name */}
        <div>
          <label style={{ display: "block", fontWeight: 600 }}>
            Display name
          </label>
          <input
            name="display_name"
            defaultValue={profile.display_name}
            required
            style={{
              width: "100%",
              padding: 10,
              border: "1px solid #ccc",
              borderRadius: 8,
            }}
          />
        </div>

        {/* Skill Level */}
        <div>
          <label style={{ display: "block", fontWeight: 600 }}>
            Skill level
          </label>
          <select
            name="skill_level"
            defaultValue={profile.skill_level || "Casual"}
            style={{
              width: "100%",
              padding: 10,
              border: "1px solid #ccc",
              borderRadius: 8,
            }}
          >
            <option value="Beginner">Beginner</option>
            <option value="Casual">Casual</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Home Area */}
        <div>
          <label style={{ display: "block", fontWeight: 600 }}>
            Home area
          </label>
          <select
            name="home_area"
            defaultValue={profile.home_area || "DC"}
            style={{
        width: "100%",
        padding: 10,
        border: "1px solid #ccc",
        borderRadius: 8,
        }}
    >
        <option value="DC">DC</option>
        <option value="MD">MD</option>
        <option value="VA">VA</option>
        </select>
</div>

<div>
  <label style={{ display: "block", fontWeight: 600 }}>Position</label>

  <select
    name="position"
    defaultValue={(profile.positions && profile.positions[0]) || "Midfielder"}
    style={{
      width: "100%",
      padding: 10,
      border: "1px solid #ccc",
      borderRadius: 8,
    }}
  >
    <option value="Defense">Defense</option>
    <option value="Winger">Winger</option>
    <option value="Midfielder">Midfielder</option>
    <option value="Forward">Forward</option>
    <option value="Striker">Striker</option>
  </select>
</div>


        <button
          type="submit"
          style={{
            padding: 12,
            borderRadius: 10,
            border: "1px solid #333",
            background: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save Profile
        </button>
      </form>
    </main>
  );
}
