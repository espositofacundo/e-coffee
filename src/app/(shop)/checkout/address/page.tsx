import Title from "@/components/ui/title/Title";

import { AddressForm } from "./ui/addressForm";


export default function Address() {
  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">
      <div className="w-full flex flex-col justify-center text-left">
        <Title title="Dirección" subtitle="Contacto de entrega" />

        <AddressForm/>

        
      </div>
    </div>
  );
}
