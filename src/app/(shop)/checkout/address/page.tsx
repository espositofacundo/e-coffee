import Title from "@/components/ui/title/Title";
import Link from "next/link";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FcCellPhone } from "react-icons/fc";
import { IoPersonOutline } from "react-icons/io5";

export default function () {
  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">
      <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">
        <Title title="Dirección" subtitle="Contacto de entrega" />

        <div className="grid grid-cols-2 gap-2 sm:gap-5 sm:grid-cols-2">
          <div className="flex flex-col mb-2">
            <div className="flex items-center pb-2">
              <IoPersonOutline size={30} />
              <span>Nombre</span>
            </div>

            <input type="text" className="p-2 border rounded-md bg-blue-200" />
          </div>

          <div className="flex flex-col mb-2">
            <div className="flex items-center pb-2">
              <FaMapMarkerAlt size={30}></FaMapMarkerAlt>
              <span>Dirección</span>
            </div>

            <input type="text" className="p-2 border rounded-md bg-blue-200" />
          </div>

          <div className="flex flex-col mb-2">
            <div className="flex items-center pb-2">
              <FcCellPhone size={30}></FcCellPhone>
              <span>N° de Celular </span>
            </div>

            <input type="text" className="p-2 border rounded-md bg-blue-200" />
          </div>

          <div>

          </div>
          <div className="w-full h-px bg-gray-500 mt-4 col-span-2" />

          <div className="flex flex-col col-span-2 ">
            <Link
              href="/checkout"
              className="btn-primary flex w-full sm:w-1/2 justify-center "
            >
              Siguiente
            </Link>
          </div>

          
          
          
        </div>
      </div>
    </div>
  );
}
