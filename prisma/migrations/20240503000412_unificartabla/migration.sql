/*
  Warnings:

  - You are about to drop the column `orderAddressId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `OrderAddress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderAddress" DROP CONSTRAINT "OrderAddress_OrderID_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderAddressId",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "phone" TEXT;

-- DropTable
DROP TABLE "OrderAddress";
