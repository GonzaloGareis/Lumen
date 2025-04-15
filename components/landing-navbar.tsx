"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const font = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

export const LandingNavbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <nav className="p-4 bg-[#A7D8F0] shadow-md flex items-center justify-between text-[#1E3A8A]">
      <Link href="/" className="flex items-center space-x-2">
        <div className="relative h-20 w-20">
          <Image fill alt="logo" src="/symbol.png" />
        </div>
        <h1
          className={cn(
            "text-4xl font-bold",
            font.className,
            "hidden md:block"
          )}
        >
          Lumen
        </h1>
      </Link>

      <div className="hidden md:flex items-center space-x-6 text-l sm:text-sm md:text-lg lg:text-xl font-medium">
        <Link
          href="/faq"
          className="hover:underline hover:opacity-80 transition"
        >
          Preguntas Frecuentes
        </Link>
        <Link
          href="/acerca"
          className="hover:underline hover:opacity-80 transition"
        >
          Acerca de
        </Link>
        <Link href={isSignedIn ? "/dashboard" : "/sign-in"}>
          <Button
            variant="outline"
            className="rounded-full border border-[#1E3A8A] text-[#1E3A8A] hover:bg-gradient-to-r hover:from-[#A7D8F0] hover:to-[#336DFF] hover:text-white transition px-4 py-2 text-sm sm:px-5 sm:py-3 sm:text-base md:px-6 md:py-4 md:text-lg"
          >
            {isSignedIn ? "Ir a tu agenda" : "Abrir sesión / Crear cuenta"}
          </Button>
        </Link>
      </div>

      {/* Mobile version of the navbar */}
      <div className="md:hidden flex items-center space-x-4">
        <Link
          href="/faq"
          className="hover:underline hover:opacity-80 transition text-sm"
        >
          Preguntas Frecuentes
        </Link>
        <Link
          href="/acerca"
          className="hover:underline hover:opacity-80 transition text-sm"
        >
          Acerca de
        </Link>
        <Link href={isSignedIn ? "/dashboard" : "/sign-in"}>
          <Button
            variant="outline"
            className="rounded-full border border-[#1E3A8A] text-[#1E3A8A] hover:bg-gradient-to-r hover:from-[#A7D8F0] hover:to-[#336DFF] hover:text-white transition text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 md:px-6 md:py-4 md:text-lg"
          >
            {isSignedIn ? "Ir a tu agenda" : "Abrir sesión / Crear cuenta"}
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default LandingNavbar;
