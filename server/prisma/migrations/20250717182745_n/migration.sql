/*
  Warnings:

  - You are about to drop the `IndividualSalaryAdjustments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PayeTaxSlab` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payroll` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SalaryAdjustments` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Made the column `orgId` on table `Fingerprint` required. This step will fail if there are existing NULL values in that column.
  - Made the column `orgId` on table `Ingredient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `orgId` on table `Meal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `orgId` on table `MealType` required. This step will fail if there are existing NULL values in that column.
  - Made the column `orgId` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `orgId` on table `ScheduledMeal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organizationId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Payroll" DROP CONSTRAINT "Payroll_empId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organizationId_fkey";

-- AlterTable
ALTER TABLE "Fingerprint" ALTER COLUMN "orgId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ingredient" ALTER COLUMN "orgId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Meal" ALTER COLUMN "orgId" SET NOT NULL;

-- AlterTable
ALTER TABLE "MealType" ALTER COLUMN "orgId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "orgId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ScheduledMeal" ALTER COLUMN "orgId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "organizationId" SET NOT NULL;

-- DropTable
DROP TABLE "IndividualSalaryAdjustments";

-- DropTable
DROP TABLE "PayeTaxSlab";

-- DropTable
DROP TABLE "Payroll";

-- DropTable
DROP TABLE "SalaryAdjustments";

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
