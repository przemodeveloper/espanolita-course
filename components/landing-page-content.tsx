"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Target,
  Users,
  TrendingUp,
  GraduationCap,
  Globe,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function LandingPageContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
            Przygotuj się do matury z pewnością siebie <br /> dzięki zadaniom
            maturalnym Españolita
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            Skuteczne przygotowanie do matury z hiszpańskiego — wszystkie typy
            zadań, które pojawią się na maturze.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild className="px-8 py-6 text-base rounded-xl">
              <Link href="/checkout">Zacznij już dziś</Link>
            </Button>
            <Button asChild variant="outline" className="px-8 py-6 rounded-xl">
              <Link href="/our-tasks">Nasze zadania</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <Image
            src="/spanish-stairs.jpg"
            alt="Hero"
            width={1000}
            height={1000}
            loading="eager"
            className="rounded-3xl w-full h-[600px] object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>
      </section>

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              value: "81%",
              label: "zdawalność matury z hiszpańskiego",
            },
            {
              icon: Users,
              value: "5 000+",
              label: "maturzystów wybiera hiszpański co roku",
            },
            {
              icon: TrendingUp,
              value: "50%",
              label: "wzrost popularności w 5 lat",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.value}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="h-full"
            >
              <Card className="rounded-2xl shadow-sm text-center h-full">
                <CardContent className="p-8">
                  <stat.icon className="w-8 h-8 text-red-500 mx-auto mb-4" />
                  <p className="text-4xl font-semibold mb-2">{stat.value}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY SPANISH */}
      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-semibold text-center mb-16"
          >
            Dlaczego warto zdawać maturę z hiszpańskiego?
          </motion.h2>

          <div className="space-y-6">
            {[
              {
                icon: TrendingUp,
                title: "Większe szanse na wysoki wynik",
                text: "Hiszpański uchodzi za jeden z najlepiej zdawanych języków obcych na maturze.",
              },
              {
                icon: GraduationCap,
                title: "Dostęp do studiów w UE",
                text: "Znajomość hiszpańskiego otwiera drzwi do uczelni w Hiszpanii i Ameryce Łacińskiej.",
              },
              {
                icon: Globe,
                title: "Język globalny",
                text: "Hiszpański to drugi najczęściej używany język ojczysty na świecie.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className="rounded-2xl shadow-sm">
                  <CardContent className="p-6 flex gap-4">
                    <item.icon className="w-8 h-8 text-red-500" />
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-gray-600">{item.text}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6"
        >
          <Card className="rounded-3xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl">
            <CardContent className="p-12 text-center">
              <CheckCircle className="mx-auto mb-4 w-10 h-10" />
              <h2 className="text-3xl font-semibold mb-4">
                Chcesz zdać maturę bez stresu?
              </h2>
              <p className="text-white/90 mb-8">
                Sprawdź nasze zadania i naucz się dokładnie tego, co pojawi się
                na maturze.
              </p>
              <Button
                asChild
                className="bg-white text-red-600 p-4 rounded-md hover:bg-red-700 hover:text-white transition-all duration-200"
              >
                <Link href="/checkout">Zakup zadań maturalnych</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
