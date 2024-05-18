"use client";

import { useState, useEffect } from "react";
import { getPaginatedProductsWithImages } from "@/actions/products/product-pagination";
import BanerSlideShowHome from "@/components/product/slideshow/BanerSlideshow";

import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  description: string;
  inStock: number;
  price: number;
  sizes: string[];
  slug: string;
  tags: string[];
  rootcategory: string;
  categoryId: string;
  images: string[];
}

interface Props {
  searchParams: {
    page?: string;
  };
}

export default function Home({ searchParams }: Props) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const page = parseInt(searchParams.page || "1");

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getPaginatedProductsWithImages({
        page,
        categoryId: selectedCategoryId,
      });
      setProducts(data.products);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    };

    fetchProducts();
  }, [page, selectedCategoryId]); // Recargar cuando cambia la página o la categoría seleccionada

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <>
      <div className="r">
        <div className="overflow-hidden">
          <BanerSlideShowHome />
        </div>

        <div className="flex gap-3 flex-wrap p-4">
          <button
            className="btn-categories font-bold"
            onClick={() => handleCategoryChange(null)}
          >
            Mostrar Todas
          </button>
          <button
            className="btn-categories"
            onClick={() =>
              handleCategoryChange("0ab04a40-4ba7-4669-93de-4092f7661f9b")
            }
          >
            Cervezas
          </button>
          
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 sm:gap-10 gap-3 mx-3 mb-10">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.slug}`}>
            <div className="rounded-lg overflow-hidden shadow-lg transform transition duration-500 hover:scale-105">
              <div className="image-container">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-4 bg-gray-950 rounded-b-lg flex flex-col">
                <span className="text-lg h-14 font-semibold text-gray-100 hover:underline">
                  {product.title}
                </span>
                <span className="text-lg font-bold text-gray-300">
                  $ {product.price}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
