import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createSupabaseServer() {
  // In newer Next.js, cookies() is async, so we must await it.
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        // Supabase reads cookies to find the logged-in session
        getAll() {
          return cookieStore.getAll();
        },

        // Supabase may set cookies when it refreshes a session
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (err) {
            // Sometimes cookies are read-only in certain server contexts.
            // Catch prevents crashes.
          }
        },
      },
    }
  );
}
