"use client";

import { deleteCategory, saveCategory } from "@/actions/category/save-category";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { IoAdd, IoTrashOutline } from "react-icons/io5";

interface CategoryRow {
  id: string;
  name: string;
  sortOrder: number;
  products: number;
}

interface Props {
  categories: CategoryRow[];
}

const CategoriesManager = ({ categories }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const [newName, setNewName] = useState("");

  const run = (action: () => Promise<{ ok: boolean; message?: string }>, onOk?: () => void) => {
    setErrorMessage("");
    startTransition(async () => {
      const resp = await action();
      if (!resp.ok) {
        setErrorMessage(resp.message ?? "No se pudo guardar");
        return;
      }
      onOk?.();
      router.refresh();
    });
  };

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const nextOrder = Math.max(0, ...categories.map((c) => c.sortOrder)) + 1;
    run(() => saveCategory({ name: newName, sortOrder: nextOrder }), () => setNewName(""));
  };

  return (
    <div className={isPending ? "opacity-60 pointer-events-none" : ""}>
      <div className="card divide-y divide-brand-cream-dark">
        {categories.map((category) => (
          <CategoryItem
            key={`${category.id}-${category.name}-${category.sortOrder}`}
            category={category}
            onSave={(name, sortOrder) =>
              run(() => saveCategory({ id: category.id, name, sortOrder }))
            }
            onDelete={() => {
              if (confirm(`¿Eliminar la categoría "${category.name}"?`)) {
                run(() => deleteCategory(category.id));
              }
            }}
          />
        ))}
        {categories.length === 0 && (
          <p className="p-6 text-center text-gray-600">Todavía no hay categorías.</p>
        )}
      </div>

      {errorMessage && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>
      )}

      <form onSubmit={onCreate} className="card mt-4 p-4 flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nueva categoría (ej. Snacks salados)"
          className="input"
        />
        <button type="submit" disabled={!newName.trim()} className="btn-primary shrink-0 disabled:opacity-50">
          <IoAdd size={20} /> Agregar
        </button>
      </form>
    </div>
  );
};

const CategoryItem = ({
  category,
  onSave,
  onDelete,
}: {
  category: CategoryRow;
  onSave: (name: string, sortOrder: number) => void;
  onDelete: () => void;
}) => {
  const [name, setName] = useState(category.name);
  const [sortOrder, setSortOrder] = useState(category.sortOrder);
  const changed = name !== category.name || sortOrder !== category.sortOrder;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(name, sortOrder);
      }}
      className="flex flex-wrap items-center gap-2 px-4 py-3"
    >
      <input
        type="number"
        min={0}
        value={sortOrder}
        onChange={(e) => setSortOrder(Number(e.target.value))}
        className="input w-16 text-center"
        aria-label="Orden"
      />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input flex-1 min-w-[10rem]"
        aria-label="Nombre"
      />
      <span className="text-sm text-gray-500 w-24 text-right">
        {category.products} productos
      </span>
      {changed && (
        <button type="submit" className="btn-primary py-1.5">
          Guardar
        </button>
      )}
      <button
        type="button"
        onClick={onDelete}
        className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-30"
        disabled={category.products > 0}
        title={
          category.products > 0
            ? "Tiene productos: no se puede eliminar"
            : "Eliminar categoría"
        }
      >
        <IoTrashOutline size={20} />
      </button>
    </form>
  );
};

export default CategoriesManager;
