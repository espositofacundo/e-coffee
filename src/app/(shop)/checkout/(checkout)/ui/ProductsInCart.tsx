"use client";

import { useCartStore } from "@/store/ui/cart/cart-store";
import React, { useEffect, useState } from "react";
import ProductImage from "@/components/product/product-image/productImage";

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
          className="flex max-h-20 my-4 bg-white rounded-xl shadow-xl "
        >
           <ProductImage
            src={product.image}
            width={100}
            height={100}
            style={{
              width:"auto",
              height:"full",
              objectFit:'cover'
              
   
            }}
            alt={product.title}
            className="mr-5 rounded"
            priority={true}   
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
