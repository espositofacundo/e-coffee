export const revalidate = 0;

import { getProductbySlug } from "@/actions/products/get-product-by-slug";
import ProductImage from "@/components/product/product-image/productImage";
import ProductMobileSlideshow from "@/components/product/slideshow/ProductMobileSlideshow";
import ProductSlideshow from "@/components/product/slideshow/ProductSlideshow";
import PageNotFound from "@/components/ui/not-found/PageNotFound";
import { titleFont } from "@/config/fonts";
import { Metadata } from "next";
import Link from "next/link";
import { IoChevronBack } from "react-icons/io5";
import AddToCart from "./ui/AddToCart";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductbySlug(params.slug);

  return {
    title: product?.title ?? "Producto no encontrado",
    description: product?.description ?? "",
    openGraph: {
      title: product?.title ?? "Producto no encontrado",
      description: product?.description ?? "",
      images: product?.images[0] ? [product.images[0]] : ["/logo.png"],
    },
  };
}

export default async function ProductDetails({ params }: Props) {
  const product = await getProductbySlug(params.slug);

  if (!product) {
    return <PageNotFound />;
  }

  return (
    <div className="mt-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-brand-green"
      >
        <IoChevronBack /> Volver al catálogo
      </Link>

      <div className="mt-4 grid md:grid-cols-2 gap-8">
        <div>
          {product.images.length > 0 ? (
            <>
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
            </>
          ) : (
            <ProductImage
              alt={product.title}
              width={600}
              height={450}
              className="w-full h-auto rounded-2xl"
            />
          )}
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-gold">
            {product.category.name}
          </p>
          <h1
            className={`${titleFont.className} mt-1 text-3xl font-bold text-brand-green`}
          >
            {product.title}
          </h1>
          {product.description && (
            <p className="mt-2 text-gray-700">{product.description}</p>
          )}

          <AddToCart product={product} />
        </div>
      </div>
    </div>
  );
}
