-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "isPaid" SET DEFAULT false,
ALTER COLUMN "isOkforCook" SET DEFAULT false,
ALTER COLUMN "isReadyForDelivery" SET DEFAULT false,
ALTER COLUMN "isDelivered" SET DEFAULT false;
