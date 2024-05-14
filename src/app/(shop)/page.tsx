"use client";

import { useState, useEffect } from "react";
import { getPaginatedProductsWithImages } from "@/actions/products/product-pagination";
import BanerSlideShowHome from "@/components/product/slideshow/BanerSlideshow";
import Pagination from "@/components/ui/pagination/Pagination";
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
        <div className="p-2 overflow-hidden">
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
              handleCategoryChange("2768b5c1-07e1-469a-a855-218dbc186ce2")
            }
          >
            Cafeteria
          </button>
          <button
            className="btn-categories"
            onClick={() =>
              handleCategoryChange("0e94ad77-a50d-4c7b-a653-3e3727fede58")
            }
          >
            Desayunos & Meriendas
          </button>
          <button
            className="btn-categories"
            onClick={() =>
              handleCategoryChange("d9ef0a11-2c30-41b6-a86a-54b7a6cb035d")
            }
          >
            Panes & Tostadas
          </button>
          <button
            className="btn-categories"
            onClick={() =>
              handleCategoryChange("c5625528-56a2-4280-9594-71a31c89209d")
            }
          >
            Licuados & Smoothies
          </button>
          <button
            className="btn-categories"
            onClick={() =>
              handleCategoryChange("468a1c80-2c3b-429c-a2e8-ddab5cfe1a3e")
            }
          >
            Pastelería
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
