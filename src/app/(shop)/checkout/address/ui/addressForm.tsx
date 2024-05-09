"use client";

import { useAddressStore } from "@/store/ui/address/address-store";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FcCellPhone } from "react-icons/fc";
import { IoArrowForwardCircleOutline, IoPersonOutline, IoSaveOutline } from "react-icons/io5";


type Forminputs = {
  firstName: string;
  address: string;
  phone: string;
  campoboolean: boolean;
};

export const AddressForm = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { isValid },
    reset,
  } = useForm<Forminputs>({
    defaultValues: {
      // Todo:leer de la base de datos.
    },
  });
  const setAddress = useAddressStore((state) => state.setAddress);
  const localStoreAddress = useAddressStore((state) => state.address);

  useEffect(() => {
    if (localStoreAddress.firstName) {
      reset(localStoreAddress);
    }
  }, [localStoreAddress,reset]);

  const onSubmit = (data: Forminputs) => {
    const {campoboolean, ...restAddress } = data;
    setAddress(restAddress);
    router.push('/checkout');
  
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 sm:w-1/2 "
    >
      
      <span className="  pr-1 ">
        Si es para consumir en el local simplemente clickea:  <Link href='/checkout' className="flex items-center underline"> <span className="text-sm pr-1">Continuar</span> <IoArrowForwardCircleOutline size={16} ></IoArrowForwardCircleOutline></Link>
      </span>
      


      <div className="w-full h-px bg-gray-300 my-4 col-span-2" />
      <div className="flex mb-2">
      
        <span className=" pr-2">
          Quiero que me lo envien por delivery:
        </span>
     
          <label
            className="relative flex cursor-pointer items-center rounded-full"
            htmlFor="checkbox"
          >
            <input
              type="checkbox"
              className="border-gray-800  before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
              id="checkbox"
              {...register("campoboolean")}
            />
            <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </label>
       
      </div>
      
     
      <div className="flex flex-col mb-2">
        <div className="flex items-center pb-2">
          <IoPersonOutline size={30} />
          <span>Nombre</span>
        </div>

        <input
          type="text"
          className="p-2 border rounded-md bg-blue-200"
          {...register("firstName")}
          placeholder="Nos gustaria saber como te llamas!"
        />
      </div>

      <div className="flex flex-col mb-2">
        <div className="flex items-center pb-2">
          <FaMapMarkerAlt size={30}></FaMapMarkerAlt>
          <span>Dirección</span>
        </div>

        <input
          type="text"
          className="p-2 border rounded-md bg-blue-200 "
          {...register("address")}
          placeholder="Completalo si deseas que te llevemos el pedido,sino dejalo vacio :)"
        />
      </div>

      <div className="flex flex-col mb-2">
        <div className="flex items-center pb-2">
          <FcCellPhone size={30}></FcCellPhone>
          <span>N° de Celular </span>
        </div>

        <input
          type="text"
          className="p-2 border rounded-md bg-blue-200"
          {...register("phone")}
          placeholder="Completalo si deseas que te llevemos el pedido,sino dejalo vacio :)"
        />
      </div>
      <div className="flex gap-5 ">

        
      <button
        disabled={!isValid}
        type="submit"
      
        className={clsx({
          "btn-primary": isValid,
          "btn-disabled": !isValid,
        })}
      >
        <div className="flex justify-center"><IoSaveOutline size={19}></IoSaveOutline> <span className="pl-2">Confirmar dirección y Cel</span> </div>
      </button>

      </div>
    </form>
  );
};
