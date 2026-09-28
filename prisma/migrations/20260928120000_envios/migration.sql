-- CreateEnum
CREATE TYPE "DeliveryZone" AS ENUM ('centro', 'fuera');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "zone" "DeliveryZone" NOT NULL DEFAULT 'centro';

-- AlterTable
ALTER TABLE "StoreSetting" ADD COLUMN     "freeShippingFrom" DOUBLE PRECISION NOT NULL DEFAULT 20000,
ADD COLUMN     "freeZoneLabel" TEXT NOT NULL DEFAULT 'Juan B. Justo, Independencia, Libertad y la costa',
ADD COLUMN     "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 3000;
