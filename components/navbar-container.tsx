import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Navbar } from "./navbar";

export async function NavbarContainer() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const { user } = data || {};

  return <Navbar user={user} />;
}
