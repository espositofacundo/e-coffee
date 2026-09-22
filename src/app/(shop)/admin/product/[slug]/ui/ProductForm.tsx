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
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  product: Partial<Product> & { ProductImage?: ProductWithImage[] };
  categories: Category[];
}

interface FormInput {
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  unit: SaleUnit;
  price: number;
  priceHalf: string;
  variants: string;
  available: boolean;
  images?: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {
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
      price: product.price,
      priceHalf: product.priceHalf?.toString() ?? "",
      variants: product.variants?.join(", ") ?? "",
      available: product.available ?? true,
      images: undefined,
    },
  });

  const unit = watch("unit");

  const onSubmit = async (data: FormInput) => {
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
    formData.append("price", productToSave.price.toString());
    formData.append("priceHalf", productToSave.priceHalf);
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

        <div className="grid grid-cols-2 gap-3">
          {unit === "kg" && (
            <div>
              <label htmlFor="priceHalf" className="label">
                Precio ½ kg
              </label>
              <input
                id="priceHalf"
                type="number"
                min={0}
                className="input"
                placeholder="Vacío = no se vende por ½ kg"
                {...register("priceHalf")}
              />
            </div>
          )}
          <div>
            <label htmlFor="price" className="label">
              {unit === "kg" ? "Precio 1 kg" : "Precio por unidad"}
            </label>
            <input
              id="price"
              type="number"
              min={0}
              className="input"
              {...register("price", { required: true, min: 0 })}
            />
            {errors.price && <p className="text-sm text-red-600 mt-1">Ingresá el precio</p>}
          </div>
        </div>

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
