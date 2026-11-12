import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Deduplicates supabase.auth.getUser() within a single RSC/request render.
 */
export const getUserCached = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
