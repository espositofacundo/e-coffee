"use client";

import { getStockBySlug } from "@/actions/products/get-stock-by-slug";

import React, { useEffect, useState } from "react";

interface Props {
  slug: string;
}

const StockLabel = ({ slug }: Props) => {
  const [Stock, setStock] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStock();
  }, []);

  const getStock = async () => {
    const inStock = await getStockBySlug(slug);
    setStock(inStock);
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <span className="text-xs animate-pulse bg-gray-200">&nbsp;</span>
      ) : (
     
        <span className="text-xs ">({Stock} disponibles)</span>
      )}
    </>
  );
};

export default StockLabel;
