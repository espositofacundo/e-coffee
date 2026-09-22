export const revalidate = 0;

import { getCatalog } from "@/actions/products/get-catalog";
import { titleFont } from "@/config/fonts";
import { store } from "@/config/store";
import Image from "next/image";
import { IoLeafOutline } from "react-icons/io5";
import { MdOutlineLocalShipping } from "react-icons/md";
import Catalog from "./ui/Catalog";

export default async function Home() {
  const categories = await getCatalog();

  return (
    <>
      <section className="mt-6 rounded-2xl bg-brand-green text-white px-5 py-6 sm:px-8 sm:py-8 flex flex-col sm:flex-row sm:items-center gap-5">
        <Image
          src="/logo.png"
          alt={store.name}
          width={300}
          height={234}
          className="rounded-xl w-24 sm:w-32 h-auto"
          priority
        />
        <div className="flex-1">
          <h1 className={`${titleFont.className} text-3xl sm:text-4xl font-bold`}>
            {store.name}
          </h1>
          <p className="mt-1 text-white/85 uppercase tracking-wide text-xs sm:text-sm">
            {store.tagline}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1">
              <MdOutlineLocalShipping size={18} /> Envío a domicilio gratis
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1">
              <IoLeafOutline size={16} /> Precios por ½ kg y por kilo
            </span>
          </div>
        </div>
      </section>

      <Catalog categories={categories} />
    </>
  );
}
