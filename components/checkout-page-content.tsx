"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCheckout } from "@/queries/useCheckout";

const benefits = [
  {
    title: "Dostęp na zawsze",
    description: "Dostęp do arkusza i zadań bonusowych na zawsze.",
  },
  {
    title: "12 zadań",
    description:
      "Arkusz składa się z 12 zadań, które pomogą Ci zdać maturę z języka hiszpańskiego.",
  },
  {
    title: "Zadania bonusowe",
    description:
      "Dostępne są również zadania bonusowe, które pomogą Ci dodatkowo przećwiczyć sprawdzić swoją wiedzę przed egzaminem.",
  },
  {
    title: "Wsparcie AI przy pisaniu wypracowania",
    description:
      "Dostępne jest wsparcie AI przy pisaniu wypracowania, które pomogą Ci napisać wypracowanie w sposób sprawny i zrozumiały.",
  },
];

export function CheckoutPageContent() {
  const { mutate } = useCheckout();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Zadania Maturalne Españolita
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-lg text-gray-600 max-w-2xl"
        >
          Kup Zadania Maturalne Españolita i zacznij naukę już dziś.
        </motion.p>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 pb-24">
        {/* Benefits */}
        <div className="md:col-span-2 space-y-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Purchase Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="sticky top-24 h-fit"
        >
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-6 space-y-6">
              <div>
                <p className="text-sm text-gray-500">
                  Dostęp do arkusza i zadań bonusowych
                </p>
                <p className="text-3xl font-bold">199 zł</p>
              </div>

              <ul className="space-y-3 text-sm text-gray-600">
                <li>✔ Dostęp na zawsze</li>
                <li>✔ 12 zadań</li>
                <li>✔ Zadania bonusowe</li>
                <li>✔ Wsparcie AI przy pisaniu wypracowania</li>
              </ul>

              <Button
                className="w-full rounded-xl text-base py-6"
                onClick={() => mutate()}
              >
                Kup Zadania Maturalne Españolita
              </Button>

              <p className="text-xs text-center text-gray-400">
                14-dniowa gwarancja zwrotu pieniędzy (obowiązują warunki i
                regulamin)
              </p>
              <p className="text-xs text-center text-gray-400">
                Dokonując zakupu akceptujesz warunki i regulamin.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
