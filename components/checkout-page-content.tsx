"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCheckout } from "@/queries/useCheckout";
import Link from "next/link";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import { CURRENT_TERMS_VERSION } from "@/lib/terms";

const benefits = [
  {
    title: "6-miesięczny dostęp",
    description: "Dostęp do arkusza i zadań bonusowych przez 6 miesięcy.",
  },
  {
    title: "Matura na próbę",
    description:
      "Arkusz składa się z typowych zadań, które są podobne do tych, które pojawią się na maturze.",
  },
  {
    title: "Zadania bonusowe",
    description: "Dostępne są również zadania bonusowe.",
  },
  {
    title: "Wsparcie AI przy pisaniu wypracowania",
    description:
      "Dostępne jest wsparcie AI przy pisaniu wypracowania, które pomoże Ci napisać wypracowanie w sposób sprawny i zrozumiały.",
  },
  {
    title: "Przyszłe aktualizacje - nowe arkusze i zadania bonusowe",
    description:
      "Przyszłe aktualizacje - nowe arkusze i zadania bonusowe, które pomogą Ci dodatkowo sprawdzić swoją wiedzę przed egzaminem.",
  },
];

export function CheckoutPageContent() {
  const { mutate } = useCheckout();
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuy = () => {
    if (!isTermsAccepted) {
      setError(
        "Musisz zaakceptować warunki i regulamin oraz politykę prywatności",
      );
      return;
    }
    setError(null);
    mutate({ termsVersion: CURRENT_TERMS_VERSION });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-semibold mb-4"
        >
          Matura Españolita
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
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
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
                <p className="text-3xl font-semibold">159,99 zł</p>
              </div>

              <ul className="space-y-3 text-sm text-gray-600">
                <li>✔ 6-miesięczny dostęp</li>
                <li>✔ Matura na próbę</li>
                <li>✔ Zadania bonusowe</li>
                <li>✔ Wsparcie AI przy pisaniu wypracowania</li>
                <li>
                  ✔ Przyszłe aktualizacje - nowe arkusze i zadania bonusowe
                </li>
              </ul>

              <Button
                className="w-full rounded-xl text-base py-6"
                onClick={handleBuy}
              >
                Kup Zadania Maturalne Españolita
              </Button>

              <p className="text-xs text-center text-gray-400">
                14-dniowa gwarancja zwrotu pieniędzy (obowiązują warunki i
                regulamin)
              </p>
              <FieldGroup>
                <Field orientation="horizontal">
                  <Checkbox
                    className={error ? "border-red-500" : ""}
                    id="terms-checkbox-2"
                    name="terms-checkbox-2"
                    checked={isTermsAccepted}
                    onCheckedChange={(checked) =>
                      setIsTermsAccepted(checked === true)
                    }
                  />

                  <FieldContent>
                    <FieldLabel htmlFor="terms-checkbox-2">
                      Akceptuję warunki i regulamin
                    </FieldLabel>
                    <FieldDescription>
                      Dokonując zakupu akceptujesz{" "}
                      <Link
                        className="text-blue-500 underline"
                        target="_blank"
                        href="https://coffee-hayley-30.tiiny.site/regulamin-kursu.pdf"
                      >
                        regulamin
                      </Link>{" "}
                      oraz{" "}
                      <Link
                        className="text-blue-500 underline"
                        target="_blank"
                        href="https://coffee-hayley-30.tiiny.site/polityka-prywatności.pdf"
                      >
                        politykę prywatności
                      </Link>
                      .
                    </FieldDescription>
                    {error && <FieldError>{error}</FieldError>}
                  </FieldContent>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
