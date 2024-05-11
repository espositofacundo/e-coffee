'use client';

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
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const page = parseInt(searchParams.page || '1');

  useEffect(() => {
      const fetchProducts = async () => {
          const data = await getPaginatedProductsWithImages({ page, categoryId: selectedCategoryId });
          setProducts(data.products);
          setCurrentPage(data.currentPage);
          setTotalPages(data.totalPages);
      };

      fetchProducts();
  }, [page, selectedCategoryId]);  // Recargar cuando cambia la página o la categoría seleccionada

  const handleCategoryChange = (categoryId: string | null) => {
      setSelectedCategoryId(categoryId);
  };

  return (
      <>
        <div className="r">
          
          <div className="p-2 overflow-hidden">
            <BanerSlideShowHome />
          </div>

          <div className="flex gap-2 p-4">
            <button className="btn-categories font-bold"  onClick={() => handleCategoryChange(null)}>Mostrar Todas</button>
            <button className="btn-categories" onClick={() => handleCategoryChange("2768b5c1-07e1-469a-a855-218dbc186ce2")}>Cafeteria</button>
            <button className="btn-categories"  onClick={() => handleCategoryChange("0e94ad77-a50d-4c7b-a653-3e3727fede58")}>Desayunos & Meriendas</button>
            <button className="btn-categories"  onClick={() => handleCategoryChange("d9ef0a11-2c30-41b6-a86a-54b7a6cb035d")}>Panes & Tostadas</button>
            <button className="btn-categories"  onClick={() => handleCategoryChange("c5625528-56a2-4280-9594-71a31c89209d")}>Licuados & Smoothies</button>
            <button className="btn-categories"  onClick={() => handleCategoryChange("468a1c80-2c3b-429c-a2e8-ddab5cfe1a3e")}>Pastelería</button>
          </div>
        </div>


        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 mb-10">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.slug}`}>
              <div className="rounded-md overflow-hidden fade-in h-32 sm:h-80">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full object-fill"
                  width={500}
                  height={500}
                />
              </div>
              <div className="p-4 flex flex-col">
                <span className="hover:text-blue-600">{product.title}</span>
                <span className="font-bold">${product.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
  );
}