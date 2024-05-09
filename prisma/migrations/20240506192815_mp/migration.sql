-- CreateEnum
CREATE TYPE "metodoDePago" AS ENUM ('efectivo', 'transaccionbancaria', 'mp');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "metodoDePago" "metodoDePago";
