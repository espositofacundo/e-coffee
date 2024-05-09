"use client";

import React from "react";
import { BsInstagram, BsWhatsapp } from "react-icons/bs";
import { FaMoneyBillAlt } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { PiBankDuotone } from "react-icons/pi";
import { SiMercadopago } from "react-icons/si";

interface PaymentMethodsProps {
  id: string;
  total: number;
  address: string | null;  // Permitir que address sea string o null
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ id, total, address }) => {
  const handleWhatsAppClick = () => {
    const message = `Hola! Realice el pago de ${total} de la orden: ${id}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/5492236638423/?text=${encodedMessage}`;
    window.open(whatsappLink, "_blank");
  };
  const handleInstagramClick = () => {
    const message = `Hola! Realicé el pago de ${total} de la orden: ${id}`;
    const encodedMessage = encodeURIComponent(message);
    const igUsername = "facu.esposito"; // Tu nombre de usuario de Instagram
    const igLink = `https://www.instagram.com/${igUsername}/?text=${encodedMessage}`;
    window.open(igLink, "_blank");
  };
  const handleEmailClick = () => {
    const subject = "Pago de Orden"; // Asunto del correo electrónico
    const body = `Hola, Realicé el pago de ${total} de la orden: ${id}`; // Cuerpo del correo electrónico
    const email = "espositofacundo@hotmail.com"; // Tu dirección de correo electrónico
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const mailtoLink = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
    window.open(mailtoLink);
  };
  const handleWhatsAppClickDelivery = () => {
    const message = `Hola! Mi orden ${id} de un monto total de :$ ${total} no ha llegado a mi direccion ${address} `;
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/5492236638423/?text=${encodedMessage}`;
    window.open(whatsappLink, "_blank");
  };
  const handleInstagramClickDelivery = () => {
    const message = `Hola! Mi orden ${id} de un monto total de :$ ${total} no ha llegado a mi direccion ${address}`;
    const encodedMessage = encodeURIComponent(message);
    const igUsername = "facu.esposito"; // Tu nombre de usuario de Instagram
    const igLink = `https://www.instagram.com/${igUsername}/?text=${encodedMessage}`;
    window.open(igLink, "_blank");
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="flex justify-between items-center mb-8"></div>

      <h2 className="text-lg font-bold py-4">Informa tu pago</h2>

      <div className="flex gap-4 pb-4">
        <button
          onClick={handleWhatsAppClick}
          className="flex items-center px-3 py-2 rounded-md bg-green-500 text-white"
        >
          <BsWhatsapp className="mr-2" />
          WhatsApp
        </button>
        <button
          onClick={handleInstagramClick}
          className="flex items-center px-3 py-2 rounded-md bg-red-500 text-white"
        >
          <BsInstagram className="mr-2" />
          Instagram
        </button>
        <button
          onClick={handleEmailClick}
          className="flex items-center px-3 py-2 rounded-md bg-blue-500 text-white"
        >
          <HiOutlineMail className="mr-2" />
          E-mail
        </button>
      </div>
      <h2 className="text-lg font-bold py-4">Métodos de pago disponibles</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Método de Pago: Mercado Pago */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
          <SiMercadopago className="text-4xl mb-4" />
          <h3 className="text-lg font-bold">Mercado Pago</h3>
          <p className="text-sm text-gray-600">
            Paga con Mercado Pago mediante un enlace.
          </p>
        </div>

        {/* Método de Pago: Transacción Bancaria */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
          <PiBankDuotone className="text-4xl mb-4" />
          <h3 className="text-lg font-bold">Transacción Bancaria</h3>
          <p className="text-sm text-gray-600">
            <span className="font-bold">CBU:</span> 3333-3333-3333-3333
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-bold">Alias:</span> pepito.113.
          </p>
        </div>

        {/* Método de Pago: Efectivo */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
          <FaMoneyBillAlt className="text-4xl mb-4" />
          <h3 className="text-lg font-bold">Efectivo</h3>
          <p className="text-sm text-gray-600">
            Paga tu pedido en efectivo al recibirlo.
          </p>
        </div>
      </div>

      <h2 className="text-lg font-bold py-4 flex"> <MdOutlineDeliveryDining size={30} />Si tu pedido no llega contactate con nosotros:</h2>

      <div className="flex gap-4 pb-4">
      
        <button
          onClick={handleWhatsAppClickDelivery}
          className="flex items-center px-3 py-2 rounded-md bg-green-500 text-white"
        >
          <BsWhatsapp className="mr-2" />
          WhatsApp
        </button>
        <button
          onClick={handleInstagramClickDelivery}
          className="flex items-center px-3 py-2 rounded-md bg-red-500 text-white"
        >
          <BsInstagram className="mr-2" />
          Instagram
        </button>
        
      </div>
    </div>
  );
};

export default PaymentMethods;
