export function Footer() {
  return (
    <footer className="bg-gray-100 py-4">
      <div className="container mx-auto">
        <p className="text-center text-gray-500">
          &copy; {new Date().getFullYear()} Szkoła językowa Españolita. Wszelkie
          prawa zastrzeżone.
        </p>
      </div>
    </footer>
  );
}
