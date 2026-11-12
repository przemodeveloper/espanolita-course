import { getUserCached } from "@/server/auth/getUserCached";
import { Navbar } from "./navbar";

export async function NavbarContainer() {
  const user = await getUserCached();
  return <Navbar user={user} />;
}
