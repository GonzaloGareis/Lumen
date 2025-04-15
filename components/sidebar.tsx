"use client";
import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { UserButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

const Sidebar = () => {
  return (
    <div className="bg-[#E0F2FE] h-full w-16 flex flex-col items-center py-3 border-r border-[#cbe7f5] shadow-md">
      <Link
        href="/dashboard"
        className="flex flex-col items-center space-y-1 mb-6"
      >
        <div className="relative w-14 h-14">
          <Image fill alt="Logo" src="/symbol.png" />
        </div>
        <h1
          className={cn(
            "text-xs font-semibold text-[#1E3A8A] leading-tight",
            montserrat.className
          )}
        >
          Lumen
        </h1>
      </Link>
      <div className="bg-transparent flex items-center">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
        <div className="flex w-full justify-end">
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
