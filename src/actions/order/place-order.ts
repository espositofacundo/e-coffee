"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth.config";
import type { Address, Size } from "@/interfaces/product.interface";


interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address
) => {
  const session = await auth();
  const userId = session?.user.id;

  // aca verifico la session del usuario
  if (!userId) {
    return {
      ok: false,
      message: "No hay sesión de usuario",
    };
  }

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map((p) => p.productId),
      },
    },
  });

  // calcular los montos

  const subTotal = productIds.reduce((subtotal, p) => {
    const productIdToFind = p.productId;
    const product = products.find((product) => product.id === productIdToFind);

    let price = product?.price || 0;

    // Ajustar el precio según el tamaño del producto
    if (p.size === "L") {
      price *= 1.25; // Aumento del 25% para tamaño 'L'
    } else if (p.size === "S") {
      price *= 0.8; // Reducción del 20% para tamaño 'S'
    }

    return subtotal + p.quantity * price;
  }, 0);

  let Delivery = 0;

  if (address.address !== "") {
    Delivery = 1000; // No uses 'const' aquí para actualizar la variable externa
  }

  const subtotaldelivery = subTotal + Delivery;

  const percentTax = 0.21;

  const tax = subtotaldelivery * percentTax;

  const total = subtotaldelivery + tax;

  const itemsInOrder = productIds.reduce((total, p) => {
    return total + p.quantity;
  }, 0);

  try {
    const prismaTX = await prisma.$transaction(async (tx) => {
      // 1. actualizar el stock de los productos.

      const updatedProductsPromises = products.map(async (product) => {
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => item.quantity + acc, 0);

        if (productQuantity === 0) {
          throw new Error(`${product.id}, no tiene cantidad definida`);
        }

        return tx.product.update({
          where: { id: product.id },
          data: {
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);

      //verificar valores negativos
      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(`${product.title} no tiene stock.`);
        }
      });

      // 2. crear la orden - encabezado- detalles.

      const order = await tx.order.create({
        data: {
          userId: userId,
          subtotal: subTotal,
          tax: tax,
          Delivery: Delivery,
          total: total,
          itemsInOrder: itemsInOrder,
          firstName: address.firstName,
          address: address.address,
          phone: address.phone,

          OrderItem: {
            createMany: {
              data: productIds.map((p) => {
                const product = products.find(
                  (product) => product.id === p.productId
                );
                if (!product) {
                  throw new Error(`Producto no encontrado: ${p.productId}`);
                }

                let price = product.price || 0;
                if (p.size === "L") {
                  price *= 1.25; // Aumento del 25% para tamaño 'L'
                } else if (p.size === "S") {
                  price *= 0.8; // Reducción del 20% para tamaño 'S'
                }

                return {
                  quantity: p.quantity,
                  size: p.size,
                  productId: p.productId,
                  price: price,
                };
              }),
            },
          },
        },
      });

      return {
        order: order,
        updateProducts: updatedProducts,
      };
    });

    return {
      ok: true,
      order: prismaTX.order,
      prismaTX: prismaTX,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message,
    };
  }
};
