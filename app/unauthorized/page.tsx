import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Nie jesteś zalogowany</h1>
      <p className="text-lg text-muted-foreground">
        Aby uzyskać dostęp do tej strony, musisz się zalogować.
      </p>
      <Button asChild variant="outline">
        <Link href="/login">Zaloguj się</Link>
      </Button>
    </div>
  );
}
