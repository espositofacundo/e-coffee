import { getPaginatedProductsWithImages } from "@/actions/products/product-pagination";
import BanerSlideShowHome from "@/components/product/slideshow/BanerSlideshow";
import Pagination from "@/components/ui/pagination/Pagination";
import Title from "@/components/ui/title/Title";
import Image from "next/image";

import Link from "next/link";
import { redirect } from "next/navigation";

interface Props {
  searchParams: {
    page?: string;
  };
}

export default async function Home({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { products,currentPage,totalPages } = await getPaginatedProductsWithImages({ page });
  


  if (products.length === 0) {
    redirect('/');
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-4 items-center">
        <div>
          <Title
            title="Home"
            subtitle="Lo mejor de lo nuestro"
          />
        </div>
        <div className="col-span-3 p-2 overflow-hidden">
          <BanerSlideShowHome/>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 mb-10">
        {products.map((product) => (
          <>
          <Link href={`/product/${product.slug}`}>
            <div>
              <div className="rounded-md overflow-hidden fade-in h-2/3 ">

              
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full object-fill"
                  width={500}
                  height={500}
                />
                
              </div>
              <div className="p-4 flex flex-col">
                <span
                 
                  className="hover:text-blue-600"
                >
                  {product.title}
                </span>
                <span className="font-bold">${product.price}</span>
              </div>
            </div>
            </Link>
                


          </>
        ))}
      </div>
      <Pagination totalPages={totalPages} />
    </>
  );
}
