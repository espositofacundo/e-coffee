import { initialData, SeedProduct } from "./seed";
import prisma from "../lib/prisma";
import { slugify } from "../utils/slugify";

// Si dos productos tienen el mismo nombre (ej. Almohaditas “Lasfor”), el slug
// se desambigua con el detalle o las variedades.
const uniqueSlug = (product: SeedProduct, used: Set<string>) => {
  let slug = slugify(product.title);
  if (used.has(slug)) {
    slug = slugify(
      `${product.title} ${product.description || product.variants?.join(" ")}`
    );
  }
  used.add(slug);
  return slug;
};

async function main() {
  // borro toda la data previa
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  // Los pedidos vuelven a numerarse desde #0001.
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Order_number_seq" RESTART WITH 1`);

  const { categories, users } = initialData;

  await prisma.user.createMany({ data: users });

  const usedSlugs = new Set<string>();

  for (let index = 0; index < categories.length; index++) {
    const category = categories[index];
    const dbCategory = await prisma.category.create({
      data: { name: category.name, sortOrder: index + 1 },
    });

    await prisma.product.createMany({
      data: category.products.map((product) => ({
        title: product.title,
        slug: uniqueSlug(product, usedSlugs),
        description: product.description ?? "",
        unit: product.unit ?? "kg",
        price: product.price,
        priceHalf: product.priceHalf ?? null,
        variants: product.variants ?? [],
        categoryId: dbCategory.id,
      })),
    });
  }

  const productCount = await prisma.product.count();
  console.log(
    `Seed ejecutado: ${categories.length} categorías, ${productCount} productos, ${users.length} usuarios.`
  );
}

(async () => {
  if (process.env.NODE_ENV === "production") return;
  await main();
  await prisma.$disconnect();
})();
