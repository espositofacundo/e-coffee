import BanerSlideShowHome from "@/components/product/slideshow/BanerSlideshow";

import Title from "@/components/ui/title/Title";
import { initialData } from "@/interfaces";
import Image from "next/image";

import Link from "next/link";



const products = initialData.products;

export default function Home() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-4 items-center bg-slate-200">
        <div>
          <Title title="Home" subtitle="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi" />
        </div>
        <div className="col-span-3 p-2 overflow-hidden">
          <BanerSlideShowHome></BanerSlideShowHome>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 mb-10">
        {products.map((product) => (
          <>
            <div>
              <div className="rounded-md overflow-hidden fade-in">
                <Image
                  src={`/products/${product.images[0]} `}
                  alt={product.title}
                  className="w-full object-cover}"
                  width={500}
                  height={500}
                />
              </div>
              <div className="p-4 flex flex-col">
                <Link
                  href={`/product/${product.slug}`}
                  className="hover:text-blue-600"
                >
                  {product.title}
                </Link>
                <span className="font-bold">${product.price}</span>
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  );
}
