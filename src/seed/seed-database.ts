import bcryptjs from "bcryptjs";
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

// Con SEED_ADMINS="tomi:clave1,valen:clave2" se crean solo esos administradores
// (para producción). Sin la variable, se crean los usuarios de prueba.
const getSeedUsers = () => {
  const admins = process.env.SEED_ADMINS?.trim();
  if (!admins) return initialData.users;

  return admins.split(",").map((entry) => {
    const separator = entry.indexOf(":");
    const email = (separator === -1 ? entry : entry.slice(0, separator))
      .trim()
      .toLowerCase();
    const password = separator === -1 ? "" : entry.slice(separator + 1);

    if (!email || password.length < 6) {
      throw new Error(
        `SEED_ADMINS inválido para "${email}": usá usuario:contraseña (mínimo 6 caracteres).`
      );
    }
    return { email, password: bcryptjs.hashSync(password), role: "admin" as const };
  });
};

const isLocalDatabase = () =>
  /@(localhost|127\.0\.0\.1)[:/]/.test(process.env.DATABASE_URL ?? "");

async function main() {
  // En una base remota con pedidos no se corre: borraría datos reales.
  if (!isLocalDatabase() && (await prisma.order.count()) > 0) {
    console.log(
      "La base ya tiene pedidos, así que el seed no se ejecutó para no borrarlos."
    );
    return;
  }

  const users = getSeedUsers();

  // borro toda la data previa
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  // Los pedidos vuelven a numerarse desde #0001.
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Order_number_seq" RESTART WITH 1`);

  const { categories } = initialData;

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
    `Seed ejecutado: ${categories.length} categorías, ${productCount} productos, ` +
      `usuarios: ${users.map((user) => user.email).join(", ")}.`
  );
}

(async () => {
  if (process.env.NODE_ENV === "production") return;
  try {
    await main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
