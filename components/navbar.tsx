import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-background border-b">
      <Link href="/">
        <Image
          src={logo}
          alt="Logo"
          width={100}
          height={100}
          className="w-10 h-10"
        />
      </Link>
      <ul className="flex gap-4">
        <li>
          <Link href="/login">Logowanie</Link>
        </li>
        <li>
          <Link href="/register">Rejestracja</Link>
        </li>
        <li>
          <Link href="/course">Kurs</Link>
        </li>
        <li>
          <Link href="/checkout">Zakup kursu</Link>
        </li>
      </ul>
    </nav>
  );
}
