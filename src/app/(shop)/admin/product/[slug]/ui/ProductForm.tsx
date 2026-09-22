"use client";

import { createdUpdateProduct } from "@/actions/products/create-update-product";
import { deleteProduct } from "@/actions/products/delete-product";
import { deleteProductImage } from "@/actions/products/delete-product-image";
import ProductImage from "@/components/product/product-image/productImage";
import type { Category } from "@/interfaces/category.interface";
import type {
  Product,
  ProductImage as ProductWithImage,
  SaleUnit,
} from "@/interfaces/product.interface";
import { currencyFormat } from "@/utils/currency";
import {
  formatMarkup,
  formatSheetNumber,
  halfKgPrice,
  isValidMarkup,
  parseSheetNumber,
  priceFromCost,
} from "@/utils/pricing";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  product: Partial<Product & { cost: number | null; markup: number | null }> & {
    ProductImage?: ProductWithImage[];
  };
  categories: Category[];
  halfKgSurcharge: number;
}

interface FormInput {
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  unit: SaleUnit;
  cost: string;
  markup: string;
  price: string;
  sellsHalf: boolean;
  variants: string;
  available: boolean;
  images?: FileList;
}

export const ProductForm = ({ product, categories, halfKgSurcharge }: Props) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<FormInput>({
    defaultValues: {
      title: product.title ?? "",
      slug: product.slug ?? "",
      description: product.description ?? "",
      categoryId: product.categoryId ?? "",
      unit: product.unit ?? "kg",
      cost: product.cost != null ? formatSheetNumber(product.cost) : "",
      markup: product.markup != null ? formatMarkup(product.markup) : "",
      price: product.price ? formatSheetNumber(product.price) : "",
      // Un producto nuevo por kilo arranca vendiéndose también por ½ kg.
      sellsHalf: product.id ? product.priceHalf != null : true,
      variants: product.variants?.join(", ") ?? "",
      available: product.available ?? true,
      images: undefined,
    },
  });

  const unit = watch("unit");
  const sellsHalf = watch("sellsHalf");
  const cost = parseSheetNumber(watch("cost"));
  const markup = parseSheetNumber(watch("markup"));
  const markupError = markup !== null && !isValidMarkup(markup);
  // Con costo y margen, el precio sale de la fórmula (como en la planilla).
  const usesFormula = cost !== null && cost > 0 && markup !== null && !markupError;
  const price = usesFormula ? priceFromCost(cost, markup) : parseSheetNumber(watch("price"));

  const onSubmit = async (data: FormInput) => {
    if (markupError) return;
    setIsSaving(true);
    setErrorMessage("");

    const formData = new FormData();
    const { images, ...productToSave } = data;

    if (product.id) formData.append("id", product.id);
    formData.append("title", productToSave.title);
    formData.append("slug", productToSave.slug);
    formData.append("description", productToSave.description);
    formData.append("categoryId", productToSave.categoryId);
    formData.append("unit", productToSave.unit);
    formData.append("cost", cost?.toString() ?? "");
    formData.append("markup", cost !== null ? markup?.toString() ?? "" : "");
    formData.append("price", price?.toString() ?? "");
    formData.append("sellsHalf", String(productToSave.unit === "kg" && productToSave.sellsHalf));
    formData.append("variants", productToSave.variants);
    formData.append("available", String(productToSave.available));

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    }

    const resp = await createdUpdateProduct(formData);
    setIsSaving(false);

    if (!resp.ok) {
      if (!resp.product) {
        setErrorMessage(resp.message ?? "No se pudo guardar el producto");
        return;
      }
      // Se guardó el producto pero falló la subida de fotos.
      alert(resp.message);
    }

    router.replace(`/admin/product/${resp.product?.slug}?guardado=1`);
    router.refresh();
  };

  const onDelete = async () => {
    if (!product.id) return;
    if (!confirm(`¿Eliminar "${product.title}"? No se puede deshacer.`)) return;

    const resp = await deleteProduct(product.id);
    if (!resp.ok) {
      setErrorMessage(resp.message ?? "No se pudo eliminar el producto");
      return;
    }
    router.replace("/admin/products");
    router.refresh();
  };

  const onDeleteImage = async (image: ProductWithImage) => {
    const resp = await deleteProductImage(image.id, image.url);
    if (!resp.ok) {
      setErrorMessage(resp.message ?? "No se pudo eliminar la imagen");
      return;
    }
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-6 lg:grid-cols-[1fr_360px] items-start"
    >
      <div className="card p-5 sm:p-6 space-y-4">
        <div>
          <label htmlFor="title" className="label">
            Nombre
          </label>
          <input
            id="title"
            className="input"
            placeholder="Nuez Mariposa Extra Light"
            {...register("title", { required: true })}
          />
          {errors.title && <p className="text-sm text-red-600 mt-1">El nombre es obligatorio</p>}
        </div>

        <div>
          <label htmlFor="description" className="label">
            Detalle <span className="font-normal text-gray-500">(opcional)</span>
          </label>
          <input
            id="description"
            className="input"
            placeholder="Almendra, nuez, cajú y avellanas"
            {...register("description")}
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="label">
            Categoría
          </label>
          <select
            id="categoryId"
            className="input"
            {...register("categoryId", { required: true })}
          >
            <option value="">Elegí una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-sm text-red-600 mt-1">Elegí una categoría</p>
          )}
        </div>

        <fieldset>
          <legend className="label">Se vende por</legend>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["kg", "Kilo (y ½ kg)"],
                ["unidad", "Unidad / paquete"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={clsx(
                  "cursor-pointer rounded-lg border px-3 py-2 text-center font-medium",
                  unit === value
                    ? "border-brand-green bg-brand-green-light text-brand-green"
                    : "border-brand-cream-dark bg-white"
                )}
              >
                <input type="radio" value={value} className="sr-only" {...register("unit")} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-lg border border-brand-cream-dark p-4">
          <legend className="label px-1 mb-0">Precio</legend>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="cost" className="label">
                Costo
              </label>
              <input
                id="cost"
                inputMode="decimal"
                className="input"
                placeholder="12.711"
                {...register("cost")}
              />
            </div>
            <div>
              <label htmlFor="markup" className="label">
                Margen
              </label>
              <input
                id="markup"
                inputMode="decimal"
                className={clsx("input", markupError && "border-red-500")}
                placeholder="1,350"
                {...register("markup")}
              />
            </div>
            <div>
              <label htmlFor="price" className="label">
                {unit === "kg" ? "Precio 1 kg" : "Precio unidad"}
              </label>
              {usesFormula ? (
                <p className="px-3 py-2 rounded-lg bg-brand-green-light font-bold text-brand-green">
                  {currencyFormat(price ?? 0)}
                </p>
              ) : (
                <input
                  id="price"
                  inputMode="decimal"
                  className="input"
                  placeholder="17.160"
                  {...register("price")}
                />
              )}
            </div>
          </div>
          {markupError ? (
            <p className="text-sm text-red-600 mt-2">
              El margen va como en la planilla: entre 1 y 10 (1,350 = 35 %).
            </p>
          ) : (
            <p className="text-xs text-gray-500 mt-2">
              Con costo y margen el precio se calcula solo (costo × margen). Sin costo, escribí el
              precio a mano; si cargás costo y precio, el margen se calcula al guardar.
            </p>
          )}

          {unit === "kg" && (
            <label className="mt-3 flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="h-4 w-4 accent-brand-green" {...register("sellsHalf")} />
              <span className="font-medium">Se vende por ½ kg</span>
              {sellsHalf && price ? (
                <span className="text-sm text-gray-600">
                  → {currencyFormat(halfKgPrice(price, halfKgSurcharge))} (kilo ×{" "}
                  {formatMarkup(0.5 + halfKgSurcharge / 100)})
                </span>
              ) : null}
            </label>
          )}
        </fieldset>

        <div>
          <label htmlFor="variants" className="label">
            Variedades <span className="font-normal text-gray-500">(opcional, separadas por coma)</span>
          </label>
          <input
            id="variants"
            className="input"
            placeholder="Original, Vainilla, Coco"
            {...register("variants")}
          />
          <p className="text-xs text-gray-500 mt-1">
            Si cargás variedades, el cliente tiene que elegir una al pedir.
          </p>
        </div>

        <div>
          <label htmlFor="slug" className="label">
            Dirección web <span className="font-normal text-gray-500">(se genera sola si la dejás vacía)</span>
          </label>
          <input id="slug" className="input" placeholder="nuez-mariposa" {...register("slug")} />
        </div>

        <label className="flex items-center gap-2 font-medium cursor-pointer">
          <input type="checkbox" className="h-4 w-4 accent-brand-green" {...register("available")} />
          Disponible para pedir
        </label>
      </div>

      <div className="space-y-4">
        <div className="card p-5">
          <label htmlFor="images" className="label">
            Fotos <span className="font-normal text-gray-500">(opcional)</span>
          </label>
          <input
            id="images"
            type="file"
            multiple
            accept="image/png, image/jpeg, image/webp, image/avif"
            className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand-cream-dark file:px-3 file:py-2 file:font-semibold"
            {...register("images")}
          />

          {product.ProductImage && product.ProductImage.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {product.ProductImage.map((image) => (
                <div key={image.id} className="space-y-1">
                  <ProductImage
                    alt={product.title ?? ""}
                    src={image.url}
                    width={200}
                    height={200}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                  <button
                    onClick={() => onDeleteImage(image)}
                    type="button"
                    className="w-full text-sm text-red-600 hover:underline"
                  >
                    Eliminar foto
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {errorMessage && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className={clsx("w-full py-3", isSaving ? "btn-disabled" : "btn-primary")}
        >
          {isSaving ? "Guardando…" : "Guardar producto"}
        </button>

        {product.id && (
          <button type="button" onClick={onDelete} className="w-full text-sm text-red-600 hover:underline">
            Eliminar producto
          </button>
        )}
      </div>
    </form>
  );
};
