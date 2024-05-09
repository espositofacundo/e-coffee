"use client";

import Image from "next/image";
import { useCartStore } from "@/store/ui/cart/cart-store";
import React, { useEffect, useState } from "react";

const ProductsInCart = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  },[]);

  const productsInCartCheckout = useCartStore((state) => state.cart);
  if (!loaded) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {productsInCartCheckout.map((product) => (
        <div
          key={`${product.slug}-${product.size}`}
          className="flex  my-4 bg-blue-100 shadow-xl "
        >
          <Image
            src={`/products/${product.image}`}
            width={100}
            height={100}
            alt={product.title}
            className="mr-5 rounded"
          />
          <div className="w-full">
            <span>
              <p className="font-bold"> {product.title} </p>
            </span>

            <p className="">Tamaño: {product.size}</p>
            <p>
            SubTotal: {product.quantity} x $ 
              {product.size === "L"
                ? product.price * 1.25
                : product.size === "S"
                ? product.price * 0.8
                : product.price}{" "}
               = <span className="font-bold">${product.size === "L"
                ? product.price * 1.25 * product.quantity
                : product.size === "S"
                ? product.price * 0.8 * product.quantity
                : product.price * product.quantity}
                </span>
            </p>
            
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductsInCart;
