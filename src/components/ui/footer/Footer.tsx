import Link from "next/link";
import React from "react";
import { CgCoffee } from "react-icons/cg";
import { titleFont } from "@/config/fonts";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BsWhatsapp } from "react-icons/bs";

export default function Footer() {
  return (
    <div className="grid grid-cols-1 w-full  text-xs mb-10">
      <Link href="/" className="flex justify-center">
        <span
          className={`${titleFont.className} antialiased font-bold flex items-center`}
        >
          <CgCoffee className="w-6 h-6 mr-1" />
        </span>
        <span className="mr-1">|</span>
        <span className="bg-green-200 p-1 rounded">E-coffee</span>
      </Link>
      <div className="flex justify-center pt-3 ">
      <span className="px-2">© {new Date().getFullYear()} . All rights reserved.  |  </span>
      <span className="px-2">Privacidad & legal  |  </span>
      <div className="flex px-2">
      <FaMapMarkerAlt />
      <span className="pl-2">Nuestra tienda  |  </span>
      </div>
      <div className="flex px-2">
      <BsWhatsapp />
      <span className="pl-2">Escribinos</span>
      </div>

      </div>
     
    </div>
  );
}
