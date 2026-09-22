export const revalidate = 0;

import { getCategories } from "@/actions/category/get-category";
import Title from "@/components/ui/title/Title";
import CategoriesManager from "./ui/CategoriesManager";

export const metadata = {
  title: "Categorías",
};

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-3xl">
      <Title
        title="Categorías"
        subtitle="El orden define cómo aparecen en el catálogo."
      />
      <CategoriesManager
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name,
          sortOrder: category.sortOrder,
          products: category._count.Product,
        }))}
      />
    </div>
  );
}
