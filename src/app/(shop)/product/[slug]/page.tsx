export const revalidate = 604800;

import NotFound from "../../category/not-found";
import { titleFont } from "@/config/fonts";

import ProductSlideshow from "@/components/product/slideshow/ProductSlideshow";
import ProductMobileSlideshow from "@/components/product/slideshow/ProductMobileSlideshow";

import { getProductbySlug } from "@/actions/products/get-product-by-slug";
import StockLabel from "@/components/product/stock-label/StockLabel";
import { Metadata, ResolvingMetadata } from "next";
import AddToCart from "./ui/AddToCart";


interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  // fetch data
  const product = await getProductbySlug(slug);

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product?.title ?? "Producto no encontrado",
    description: product?.description ?? "",

    openGraph: {
      title: product?.title ?? "Producto no encontrado",
      description: product?.description ?? "",
      images: [`/products/${product?.images[0]}`],
    },
  };
}

export default async function ProductDetails({ params }: Props) {
  const { slug } = params;
  const product = await getProductbySlug(slug);
  
  

  if (!product) {
    return (
      <div>
        <NotFound />
      </div>
    );
  }

  return (
    <div className="mt-5 mb-20 grid md:grid-cols-3 gap-3">
      <div className="col-span-1 md:col-span-2 ">
        <ProductMobileSlideshow
          title={product.title}
          images={product.images}
          className="block md:hidden"
        />
        <ProductSlideshow
          title={product.title}
          images={product.images}
          className="hidden md:block"
        />
      </div>
      <div className="col-span-1 px-5 ">
        <h1 className={`${titleFont} antialiased font-bold text-xl uppercase`}>
          {product.title}
        </h1>
        <div className="flex items-center">
        
          <StockLabel slug={product.slug} />
        </div>

        <AddToCart product={product}/>

        <h3 className="font-bold text-sm">Descripción</h3>
        <p className="font-light">{product.description}</p>

      </div>
    </div>
  );
}
