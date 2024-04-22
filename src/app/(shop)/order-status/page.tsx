import React from 'react';

const OrderTracker = () => {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="relative flex items-center justify-between">
        {/* Etapas */}
        <div className="w-full h-0.5 bg-gray-300 absolute top-4"></div>
        <div className="flex justify-between w-full">
          <div className="w-1/4 text-center">
            <div className="rounded-full w-8 h-8 bg-blue-500 text-white flex items-center justify-center">1</div>
            <p className="mt-1 text-sm">Pedido confirmado</p>
          </div>
          <div className="w-1/4 text-center">
            <div className="rounded-full w-8 h-8 bg-blue-500 text-white flex items-center justify-center">2</div>
            <p className="mt-1 text-sm">En proceso</p>
          </div>
          <div className="w-1/4 text-center">
            <div className="rounded-full w-8 h-8 bg-blue-500 text-white flex items-center justify-center">3</div>
            <p className="mt-1 text-sm">Pendiente de envío</p>
          </div>
          <div className="w-1/4 text-center">
            <div className="rounded-full w-8 h-8 bg-blue-500 text-white flex items-center justify-center">4</div>
            <p className="mt-1 text-sm">Entregado</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracker;