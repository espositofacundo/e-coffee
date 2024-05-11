import { getPaginatedProductsWithImages } from "@/actions/products/product-pagination";
import BanerSlideShowHome from "@/components/product/slideshow/BanerSlideshow";
import Pagination from "@/components/ui/pagination/Pagination";
import Title from "@/components/ui/title/Title";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { redirect } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
  searchParams: {
    page?: string;
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, currentPage, totalPages } =
    await getPaginatedProductsWithImages({ page });

  const { id } = params;
  const productsFilter = products.filter(
    (product) => product.rootcategory === id
  );

  if (id !== "coffee" && id !== "delicias") {
    notFound();
  }
  if (products.length === 0) {
    redirect(`/category/${id}`);
  }
  console.log(productsFilter.length);
  console.log(productsFilter);

  return (
    <>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-4 items-center">
          <div>
            <Title
              title={`${id}`}
              subtitle="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi"
            />
          </div>
          <div className="col-span-3 p-2 overflow-hidden">
            <BanerSlideShowHome></BanerSlideShowHome>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 mb-10">
          {productsFilter.map((product) => (
            <>
              <Link href={`/product/${product.slug}`}>
                <div>
                  <div className="rounded-md overflow-hidden fade-in h-32 sm:h-80">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full object-cover"
                      width={500}
                      height={500}
                    />
                  </div>
                  <div className="p-4 flex flex-col">
                    <span className="hover:text-blue-600">{product.title}</span>
                    <span className="font-bold">${product.price}</span>
                  </div>
                </div>
              </Link>
            </>
          ))}
        </div>
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
