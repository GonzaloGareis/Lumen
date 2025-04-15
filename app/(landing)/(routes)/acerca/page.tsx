import { LandingNavbar } from "@/components/landing-navbar";

const AcercaPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F0F4FF] to-white">
      <LandingNavbar />
      <div className="mx-auto max-w-screen-xl px-4 py-16 text-center flex-grow">
        <h2 className="text-4xl font-bold text-[#1E3A8A] mt-12 mb-6">
          Acerca de Lumen
        </h2>
        <p className="text-lg sm:text-xl text-gray-700 mb-8">
          Lumen es una plataforma digital pensada para profesionales de la salud
          que buscan una forma clara, ordenada y eficiente de gestionar su
          práctica clínica. Psicólogos, psiquiatras, psicopedagogos,
          fonoaudiólogos y otros especialistas pueden registrar citas, tomar
          notas en tiempo real durante las sesiones, mantener historias clínicas
          organizadas y acceder a la información de cualquier paciente, actual o
          antiguo, desde cualquier dispositivo, con apenas unos clics.
        </p>
        <p className="text-lg sm:text-xl text-gray-700 mb-8">
          Además de permitir la gestión de agenda, la sección de apuntes de
          Lumen te ayuda a llevar un registro detallado de la evolución de cada
          paciente: notas, resultados de tests, medicaciones indicadas,
          observaciones y más, todo reunido en un mismo lugar.
        </p>
        <p className="text-lg sm:text-xl text-gray-700 mb-8">
          Nos esforzamos por crear un servicio que sea fácil de usar, accesible
          desde cualquier lugar y que ofrezca todas las funcionalidades
          necesarias para la gestión efectiva de consultas y agendas en el
          ámbito sanitario.
        </p>
        <p className="text-lg sm:text-xl text-gray-700">
          Lumen busca facilitar tu trabajo cotidiano y permitirte enfocarte en
          lo que realmente importa: brindar atención de calidad.
        </p>
      </div>

      <section className="py-4 px-4 text-center bg-[#A7D8F0] border-t-4 border-[#cbe7f5] shadow-inner">
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

export default AcercaPage;
