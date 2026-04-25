import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-100 py-4">
      <div className="container mx-auto">
        <p className="text-center text-gray-500">
          &copy; {new Date().getFullYear()} Szkoła językowa Españolita. Wszelkie
          prawa zastrzeżone.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            target="_blank"
            href="https://coffee-hayley-30.tiiny.site/regulamin-kursu.pdf"
            className="text-sm text-blue-500 underline"
          >
            Regulamin
          </Link>
          <Link
            target="_blank"
            href="https://coffee-hayley-30.tiiny.site/polityka-prywatności.pdf"
            className="text-sm text-blue-500 underline"
          >
            Polityka prywatności
          </Link>
        </div>
        <p className="text-center text-gray-500 text-sm">
          Developed by{" "}
          <Link
            target="_blank"
            href="https://pgdeveloper.net/"
            className="text-blue-500"
          >
            Przemysław Górecki
          </Link>
        </p>
      </div>
    </footer>
  );
}
