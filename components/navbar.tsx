import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-white border-b">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Image
            src={logo}
            alt="Logo"
            width={100}
            height={100}
            className="w-10 h-10"
          />
        </Link>
        <span className="text-sm">Kurs maturalny Españolita</span>
      </div>

      <ul className="flex gap-4">
        <li>
          <Link href="/login">Logowanie</Link>
        </li>
        <li>
          <Link href="/register">Rejestracja</Link>
        </li>
        <li>
          <Link href="/course">Panel użytkownika</Link>
        </li>
        <li>
          <Link href="/checkout">Zakup kursu</Link>
        </li>
      </ul>
    </nav>
  );
}
