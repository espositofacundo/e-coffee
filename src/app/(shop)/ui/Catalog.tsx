"use client";

import type { CatalogCategory } from "@/actions/products/get-catalog";
import { slugify } from "@/utils/slugify";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { IoCloseCircle, IoSearchOutline } from "react-icons/io5";
import CartBar from "./CartBar";
import ProductRow from "./ProductRow";

interface Props {
  categories: CatalogCategory[];
}

const Catalog = ({ categories }: Props) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const visibleCategories = useMemo(() => {
    const term = slugify(search);
    return categories
      .filter((category) => !selectedCategory || category.id === selectedCategory)
      .map((category) => ({
        ...category,
        products: term
          ? category.products.filter((product) =>
              slugify(`${product.title} ${product.description} ${product.variants.join(" ")}`).includes(term)
            )
          : category.products,
      }))
      .filter((category) => category.products.length > 0);
  }, [categories, search, selectedCategory]);

  return (
    <>
      <div className="sticky top-16 z-[5] -mx-4 sm:-mx-6 px-4 sm:px-6 pt-4 pb-3 bg-brand-cream/95 backdrop-blur">
        <div className="relative">
          <IoSearchOutline
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar almendras, granola, mix..."
            className="input pl-10 pr-10 py-2.5"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Limpiar búsqueda"
            >
              <IoCloseCircle size={20} />
            </button>
          )}
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <CategoryChip
            label="Todo"
            active={selectedCategory === null}
            onClick={() => setSelectedCategory(null)}
          />
          {categories.map((category) => (
            <CategoryChip
              key={category.id}
              label={category.name}
              active={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
            />
          ))}
        </div>
      </div>

      {visibleCategories.length === 0 && (
        <div className="card mt-6 p-8 text-center text-gray-600">
          No encontramos productos para “{search}”.
        </div>
      )}

      {visibleCategories.map((category) => (
        <section key={category.id} className="mt-6">
          <h2 className="rounded-t-xl bg-brand-gold px-4 py-2.5 text-center font-bold text-white">
            {category.name}
          </h2>
          <div className="card rounded-t-none divide-y divide-brand-cream-dark">
            {category.products.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}

      <CartBar />
    </>
  );
};

const CategoryChip = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={clsx(
      "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium border transition-colors",
      active
        ? "bg-brand-green border-brand-green text-white"
        : "bg-white border-brand-cream-dark hover:border-brand-green"
    )}
  >
    {label}
  </button>
);

export default Catalog;
