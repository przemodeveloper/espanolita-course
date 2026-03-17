"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";
import { useLogout } from "@/queries/useLogout";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export function Navbar({ user }: { user: User | null }) {
  const isAuthenticated = user?.aud === "authenticated";
  const { mutate: logout } = useLogout();
  const pathname = usePathname();
  const initials =
    user?.user_metadata?.first_name?.[0] + user?.user_metadata?.last_name?.[0];

  const isLinkActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex flex-wrap justify-between items-center p-4 bg-white border-b border-gray-300">
      <div className="flex items-center flex-wrap gap-4">
        <Link href="/">
          <Image
            src={logo}
            alt="Logo"
            width={100}
            height={100}
            className="w-10 h-10"
          />
        </Link>
        <span className="font-bold text-lg">Kurs maturalny Españolita</span>
      </div>

      <ul className="flex flex-wrap items-center gap-4">
        {!isAuthenticated && (
          <>
            <li>
              <Link
                href="/login"
                className={clsx(
                  isLinkActive("/login") &&
                    "text-primary underline decoration-red-500",
                )}
              >
                Logowanie
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className={clsx(
                  isLinkActive("/register") &&
                    "text-primary underline decoration-red-500",
                )}
              >
                Rejestracja
              </Link>
            </li>
          </>
        )}
        {isAuthenticated && (
          <li>
            <Link href="/course" className="flex items-center">
              <span
                className={clsx(
                  isLinkActive("/course") &&
                    "text-primary text-primary underline decoration-red-500",
                )}
              >
                Panel użytkownika
              </span>{" "}
              <span className="text-xs ml-2 bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center">
                {initials}
              </span>
            </Link>
          </li>
        )}
        {!isAuthenticated && (
          <li>
            <Link
              href="/checkout"
              className={clsx(
                isLinkActive("/checkout") &&
                  "text-primary underline decoration-red-500",
              )}
            >
              Zakup kursu
            </Link>
          </li>
        )}
        {isAuthenticated && (
          <li>
            <Button variant="outline" onClick={() => logout()}>
              Wyloguj się
            </Button>
          </li>
        )}
      </ul>
    </nav>
  );
}
