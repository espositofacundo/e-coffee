"use client";

import QuantitySelector from "@/components/product/quantity-selector/QuantitySelector";
import SizeSelector from "@/components/product/size-selector/SizeSelector";
import type {
  CartProduct,
  Product,
  Size,
} from "@/interfaces/product.interface";
import { useCartStore } from "@/store/ui/cart/cart-store";

import Link from "next/link";
import React, { useState } from "react";
import { IoCartOutline } from "react-icons/io5";

interface Props {
  product: Product;
}

const AddToCart = ({ product }: Props) => {
  const addProductToCart = useCartStore((state) => state.addProductToCart);

  const [size, setSize] = useState<Size | undefined>("M");
  const [quantity, setQuantity] = useState<number>(1);

  const addtocart = () => {
    if (!size) return;
 

    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity: quantity,
      size: size,
      image: product.images[0],
    };

    addProductToCart(cartProduct);
    setQuantity(1);
    setSize("M");
  };

  return (
    <>
      <span className="w-fit p-1 mt-3 bg-green-200 text-center rounded-md">
        $
        {size === "L"
          ? product.price * 1.25
          : size === "S"
          ? product.price * 0.8
          : product.price}
      </span>

      <SizeSelector
        selectedSize={size}
        availableSizes={product.sizes}
        onSizeChanged={(size) => setSize(size)}
      />

      <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />

      <button
        onClick={addtocart}
        className="btn-primary my-5 flex justify-center items-center"
        
      >
        <IoCartOutline className="w-6 h-6 " />
        <Link href="/cart" className="pl-2">
          Agregar al carrito
        </Link>
      </button>
    </>
  );
};

export default AddToCart;
