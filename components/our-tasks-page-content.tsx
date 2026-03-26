"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Sparkles } from "lucide-react";

const tasks = [
  {
    src: "/task_one.jpg",
    title: "Zadanie 1",
    blurb:
      "Ćwicz rozumienie tekstu i słuchu — materiał dopasowany do struktury matury.",
  },
  {
    src: "/task_two.jpg",
    title: "Zadanie 2",
    blurb:
      "Powtarzalne schematy odpowiedzi, żebyś nie tracił czasu na egzaminie.",
  },
  {
    src: "/task_three.jpg",
    title: "Zadanie 3",
    blurb:
      "Zadania gramatyczne w kontekście — nie sucha teoria, tylko praktyka.",
  },
  {
    src: "/task_four.jpg",
    title: "Zadanie 4",
    blurb: "Fragmenty autentycznych tekstów, tak jak w arkuszu CKE.",
  },
  {
    src: "/task_five.jpg",
    title: "Zadanie 5",
    blurb: "Ćwiczenia na słownictwo i frazy, które często wracają na maturze.",
  },
  {
    src: "/task_six.jpg",
    title: "Zadanie 6",
    blurb:
      "Zadania otwarte z jasnymi kryteriami oceny — wiesz, czego się trzymać.",
  },
  {
    src: "/task_seven.jpg",
    title: "Zadanie 7",
    blurb: "Przygotowanie pod część ustną i pisaną — spójnie z resztą kursu.",
  },
  {
    src: "/task_eight.jpg",
    title: "Zadanie 8",
    blurb:
      "Wypracowanie i dłuższe formy — z podpowiedziami i wzorcami odpowiedzi.",
  },
] as const;

export function OurTasksPageContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="flex flex-col md:flex-row md:items-start md:justify-between gap-8"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 text-red-700 px-4 py-1.5 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" aria-hidden />
              Pełny arkusz maturalny
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Nasze zadania maturalne
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Oto fragmenty materiałów Españolita — każde zadanie odwzorowuje
              format i poziom trudności egzaminu. To placeholder opisu: możesz
              tu później dodać dokładniejszy opis pakietu, liczbę zadań i
              korzyści dla ucznia.
            </p>
            <p className="mt-4 text-gray-600">
              Drugi akapit marketingowy (placeholder): np. dostęp online,
              aktualizacje pod nowe arkusze, wsparcie przy pisaniu — dopasuj
              tekst do swojej oferty.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="shrink-0 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm max-w-sm w-full"
          >
            <ClipboardList className="w-10 h-10 text-red-500 mb-4" />
            <p className="font-semibold text-lg">12 zadań w pakiecie</p>
            <p className="mt-2 text-sm text-gray-600">
              Poniżej zobaczysz przykładowe wizualizacje zadań (task_one —
              task_eight). Uzupełnij ten box konkretnymi liczbami i USP.
            </p>
          </motion.div>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-2 gap-8">
          {tasks.map((task, i) => (
            <motion.article
              key={task.src}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: Math.min(i * 0.06, 0.36) }}
            >
              <Card className="overflow-hidden rounded-2xl shadow-sm border-gray-100 h-full flex flex-col">
                <div className="relative aspect-[4/3] w-full bg-gray-100">
                  <Image
                    src={task.src}
                    alt={task.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-semibold">{task.title}</h2>
                  <p className="mt-2 text-gray-600 text-sm leading-relaxed flex-1">
                    {task.blurb}
                  </p>
                </CardContent>
              </Card>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
