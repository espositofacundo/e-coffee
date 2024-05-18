/*
  Warnings:

  - The values [cafeteria,desayunos,batidos,licuados,tostadas,pasteleria,sandwiches,wraps,tartas,ensaladas,principales,postres,bebidas,promociones] on the enum `Rootcategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Rootcategory_new" AS ENUM ('coffee', 'delicias');
ALTER TABLE "Product" ALTER COLUMN "rootcategory" TYPE "Rootcategory_new" USING ("rootcategory"::text::"Rootcategory_new");
ALTER TYPE "Rootcategory" RENAME TO "Rootcategory_old";
ALTER TYPE "Rootcategory_new" RENAME TO "Rootcategory";
DROP TYPE "Rootcategory_old";
COMMIT;
