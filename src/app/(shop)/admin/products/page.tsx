export const revalidate = 0;

import Title from "@/components/ui/title/Title";



import Pagination from "@/components/ui/pagination/Pagination";
import { getPaginatedProductsWithImages } from "@/actions";
import Link from "next/link";
import Image from "next/image";
import ProductImage from "@/components/product/product-image/productImage";

interface Props {
  searchParams: {
    page?: string;
  };
}

export default async function ProductPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { products, currentPage, totalPages } =
    await getPaginatedProductsWithImages({ page });

  return (
    <>
      <Title title="Products" />
      <div className="flex justify-end mb-5">
        <Link href="/admin/product/new" className="btn-primary">
          Nuevo producto
        </Link>
      </div>

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 pl-1 py-4 text-left"
              >
                Imagen
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 pl-1 py-4 text-left"
              >
                Titulo
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 pl-1 py-4 text-left"
              >
                precio
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 pl-1 py-4 text-left"
              >
                categoria
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 pl-1 py-4 text-left"
              >
                Stock
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 pl-1 py-4 text-left"
              >
                tamaños disponibles
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
              >
                <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <Link href={`/product/${product.slug}`}>
               
                    <ProductImage
                      src={product.ProductImage[0]?.url}
                      width={80}
                      height={80}
                      alt={product.title}
                      className="w-20 h-20 object-cover rounded"
                    ></ProductImage>
                  </Link>
                </td>
                <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <Link className="hover:underline" href={`/admin/product/${product.slug}`}>
                    {product.title}
                  </Link>
                </td>
                <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${product.price}
                </td>
                <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.rootcategory}
                </td>
                <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.inStock}
                </td>
                <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.sizes.join(', ')}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination totalPages={totalPages}></Pagination>
    </>
  );
}
