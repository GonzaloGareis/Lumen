"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";
import { Button } from "./ui/button";

export const LandingHero = () => {
  const { isSignedIn } = useAuth();
  return (
    <div className="text-[#1E3A8A] font-bold py-36 text-center space-y-5">
      <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl space-y-2 font-extrabold">
        <div className="text-4xl">La aplicacion perfecta para gestionar</div>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#A7D8F0] via-[#5FA6F0] to-[#336DFF]">
          <Typewriter
            words={["Turnos", "Notas", "Contactos", "Fichas Clinicas"]}
            loop={0}
            cursor
            typeSpeed={90}
            deleteSpeed={80}
            delaySpeed={1000}
          />
        </div>
      </div>
      <div className="text-l md:text-2xl font-light text-[#336DFF]">
        Diseñada para profesionales de la salud mental
      </div>
      <div className="text-l md:text-2xl font-light text-zinc-400">
        Todo organizado en un mismo lugar
      </div>
      <div>
        <Link href={isSignedIn ? "/dashboard" : "/sign-in"}>
          <Button
            variant="premium"
            className="md:text-xl p-4 md:px-6 rounded-full hover:text-[#1E3A8A] transition"
          >
            Empezar ahora
          </Button>
        </Link>
      </div>
    </div>
  );
};
