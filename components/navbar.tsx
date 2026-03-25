"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import logo from "@/public/logo.png";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { User } from "@supabase/supabase-js";
import { useLogout } from "@/queries/useLogout";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar({ user }: { user: User | null }) {
  const isAuthenticated = user?.aud === "authenticated";
  const { mutate: logout } = useLogout();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials =
    user?.user_metadata?.first_name?.[0] + user?.user_metadata?.last_name?.[0];

  const isLinkActive = (path: string) => pathname === path;

  const linkClass = (path: string) =>
    clsx(
      "text-sm font-medium transition-colors hover:text-foreground",
      isLinkActive(path) && "text-primary underline decoration-red-500",
    );

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-border bg-background">
      <div className="container flex min-h-[var(--navbar-height)] items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
          onClick={closeMobile}
        >
          <Image
            src={logo}
            alt="Logo"
            width={40}
            height={40}
            className="size-10 shrink-0"
          />
          <span className="truncate font-bold text-lg">
            Zadania Maturalne Españolita
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {!isAuthenticated && (
            <>
              <Link href="/login" className={linkClass("/login")}>
                Logowanie
              </Link>
              <Link href="/register" className={linkClass("/register")}>
                Rejestracja
              </Link>
            </>
          )}
          {isAuthenticated && (
            <Link href="/course" className="flex items-center gap-2">
              <span className={linkClass("/course")}>Panel użytkownika</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                {initials}
              </span>
            </Link>
          )}
          {!isAuthenticated && (
            <Link href="/checkout" className={linkClass("/checkout")}>
              Zakup zadań maturalnych
            </Link>
          )}
          {!isAuthenticated && (
            <Link
              href="https://espanolita.pl/o-szkole/"
              target="_blank"
              className="text-sm font-medium transition-colors hover:text-foreground"
            >
              O nas
            </Link>
          )}
          {!isAuthenticated && (
            <Link
              href="https://espanolita.pl/kontakt/"
              target="_blank"
              className="text-sm font-medium transition-colors hover:text-foreground"
            >
              Kontakt
            </Link>
          )}
          {isAuthenticated && (
            <Button variant="outline" size="sm" onClick={() => logout()}>
              Wyloguj się
            </Button>
          )}
        </nav>

        <div className="lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col gap-6">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu nawigacji</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-2">
                <Link
                  href="/"
                  className="flex min-w-0 items-center gap-3"
                  onClick={closeMobile}
                >
                  <Image
                    src={logo}
                    alt="Logo"
                    width={24}
                    height={24}
                    className="size-10 shrink-0"
                  />
                  <span className="truncate font-bold text-sm">
                    Zadania Maturalne Españolita
                  </span>
                </Link>
                {!isAuthenticated && (
                  <>
                    <Link
                      href="/login"
                      className={cn("font-semibold", linkClass("/login"))}
                      onClick={closeMobile}
                    >
                      Logowanie
                    </Link>
                    <Link
                      href="/register"
                      className={cn("font-semibold", linkClass("/register"))}
                      onClick={closeMobile}
                    >
                      Rejestracja
                    </Link>
                  </>
                )}
                {isAuthenticated && (
                  <Link
                    href="/course"
                    className="flex items-center gap-2 font-semibold"
                    onClick={closeMobile}
                  >
                    <span className={linkClass("/course")}>
                      Panel użytkownika
                    </span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                      {initials}
                    </span>
                  </Link>
                )}
                {!isAuthenticated && (
                  <Link
                    href="/checkout"
                    className={cn("font-semibold", linkClass("/checkout"))}
                    onClick={closeMobile}
                  >
                    Zakup zadań maturalnych
                  </Link>
                )}
                {isAuthenticated && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      logout();
                      closeMobile();
                    }}
                  >
                    Wyloguj się
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
