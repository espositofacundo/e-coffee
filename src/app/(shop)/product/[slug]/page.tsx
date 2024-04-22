import { initialData } from "@/interfaces";
import NotFound from "../../category/not-found";
import { titleFont } from "@/config/fonts";

import SizeSelector from "@/components/product/size-selector/SizeSelector";
import QuantitySelector from "@/components/product/quantity-selector/QuantitySelector";
import ProductSlideshow from "@/components/product/slideshow/ProductSlideshow";
import ProductMobileSlideshow from "@/components/product/slideshow/ProductMobileSlideshow";
import Link from "next/link";

const allProducts = initialData.products;

interface Props {
  params: {
    slug: string;
  };
}

export default function ProductDetails({ params }: Props) {
  const { slug } = params;
  const product = allProducts.find((product) => product.slug === slug);

  if (!product) {
    return (
      <div>
        <NotFound></NotFound>
      </div>
    );
  }

  return (
    <div className="mt-5 mb-20 grid md:grid-cols-3 gap-3">
      <div className="col-span-1 md:col-span-2 ">

        
        <ProductMobileSlideshow title={product.title} images={product.images} className="block md:hidden"/>
        <ProductSlideshow title={product.title} images={product.images} className="hidden md:block"/>
        
      </div>
      <div className="col-span-1 px-5 ">
        <h1 className={`${titleFont} antialiased font-bold text-xl uppercase`}>
          {" "}
          {product.title}
        </h1>
        <p className="flex justify-center w-20  bg-green-200 text-center rounded-md">${product.price}</p>

        <SizeSelector
          selectedSize={product.sizes[1]}
          availableSizes={product.sizes}
        />

        <QuantitySelector
        quantity={2}
        />

        <button className="btn-primary my-5" >
        <Link href="/cart">Agregar al carrito</Link>
        </button>

        
        
        <h3 className="font-bold text-sm">Descripción</h3>
        <p className="font-light">{product.description}</p>
      </div>
    </div>
  );
}
