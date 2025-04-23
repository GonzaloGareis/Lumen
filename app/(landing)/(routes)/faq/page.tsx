import { LandingNavbar } from "@/components/landing/landing-navbar";
import { Button } from "@/components/ui/button";
import { Montserrat } from "next/font/google";
import Link from "next/link";

const font = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

const FAQPage = () => {
  return (
    <div className="h-full bg-gradient-to-b from-[#F0F4FF] to-white">
      {/* Navbar */}
      <LandingNavbar />

      {/* Hero Section */}
      <section className="bg-transparent py-10 px-4 text-center">
        <h1 className={`text-4xl font-bold ${font.className} text-[#1E3A8A]`}>
          Preguntas Frecuentes
        </h1>
        <p className="text-lg mt-4 text-[#4A4A4A]">
          Aquí encontrarás respuestas a las preguntas más comunes sobre la
          aplicación.
        </p>
      </section>

      {/* FAQ Section - Adjusted padding */}
      <section className="pt-6 pb-16 px-4 bg-transparent">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-[#1E3A8A]">
                ¿Cual es el limite de pacientes del que puedo tener registro?
              </h3>
              <p className="mt-2 text-[#4A4A4A]">
                No hay un límite en la cantidad de pacientes por profesional, de
                modo que vas a poder archivar en Lumen la información de todos
                tus pacientes, aun cuando terminen el tratamiento.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-[#1E3A8A]">
                ¿Cómo se protege la privacidad del paciente?
              </h3>
              <p className="mt-2 text-[#4A4A4A]">
                Todos los apuntes, notas y registros que tomes en la aplicación
                se guardan encriptados, con lo cual esta garantizado que nadie
                mas que vos va a tener acceso a tus apuntes.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-[#1E3A8A]">
                ¿Puedo modificar mis turnos?
              </h3>
              <p className="mt-2 text-[#4A4A4A]">
                Sí, podes modificar o cancelar tus turnos directamente desde el
                panel de control.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-[#1E3A8A]">
                ¿Qué hago si olvido mi contraseña?
              </h3>
              <p className="mt-2 text-[#4A4A4A]">
                Si olvidaste tu contraseña, puedes restablecerla fácilmente
                haciendo clic en el enlace "¿Olvidaste tu contraseña?" en la
                pantalla de inicio de sesión.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 px-4 text-center bg-[#A7D8F0] border-t-4 border-[#cbe7f5]">
        <h2 className="text-2xl font-semibold text-[#1E3A8A] mb-2">
          Si tenes más preguntas, no dudes en contactarnos.
        </h2>
        <a href="mailto:mail@mail.com" className="hover:underline">
          <div className="text-[#1E3A8A] font-normal text-lg md:text-xl">
            Contacto: contacto@agendalumen.com
          </div>
        </a>
      </section>
    </div>
  );
};

export default FAQPage;
