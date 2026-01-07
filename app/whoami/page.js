import { createSupabaseServer } from "@/lib/supabase/server";

export default async function WhoAmIPage() {
  const supabase = await createSupabaseServer(); // ✅ await here

  const { data, error } = await supabase.auth.getUser();

  return (
    <main style={{ padding: 24 }}>
      <h1>Who Am I</h1>

      {error && (
        <pre style={{ color: "crimson" }}>
          {JSON.stringify(error, null, 2)}
        </pre>
      )}

      <pre>{JSON.stringify(data.user, null, 2)}</pre>
    </main>
  );
}
