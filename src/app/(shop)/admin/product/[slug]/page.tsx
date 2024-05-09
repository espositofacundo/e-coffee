import { getProductbySlug } from "@/actions/products/get-product-by-slug";
import Title from "@/components/ui/title/Title";
import { redirect } from "next/navigation";
import { ProductForm } from "./ui/ProductForm";
import { getCategories } from "@/actions/category/get-category";


interface Props{
    params:{
       slug: string; 
    }
}

export default async function ProductPage({params}:Props) {

    const{slug} = params;

    const[product,categories] = await Promise.all([
        getProductbySlug(slug),
        getCategories(),
    ])



    if (!product && slug!== 'new') {
        redirect('/admin/products')
    }
    const title =(slug === 'new') ? 'Nuevo producto' : 'Editar Producto'
  return (
    <>
      <Title title={title}></Title>
      <ProductForm product={product ?? {}} categories={categories}/>
    </>
  );
}