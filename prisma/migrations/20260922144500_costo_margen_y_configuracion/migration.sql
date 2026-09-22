-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "cost" DOUBLE PRECISION,
ADD COLUMN     "markup" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "StoreSetting" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "halfKgSurcharge" DOUBLE PRECISION NOT NULL DEFAULT 3.7,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreSetting_pkey" PRIMARY KEY ("id")
);
