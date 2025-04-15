import { LandingHero } from "@/components/landing/landing-hero";
import LandingNavbar from "@/components/landing/landing-navbar";

const LandingPage = () => {
  return (
    <div className="h-full bg-gradient-to-b from-[#F0F4FF] to-white">
      <LandingNavbar />
      <LandingHero />

      <div className="absolute bottom-4 right-4 text-[#1E3A8A] font-medium bg-[#F0F4FF] rounded-full px-4 py-2 shadow-md">
        <a href="mailto:mail@mail.com" className="hover:underline">
          Contacto: contacto@lumenplanner.com
        </a>
      </div>
    </div>
  );
};

export default LandingPage;
