/*
  Warnings:

  - You are about to drop the `IndividualSalaryAdjustments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PayeTaxSlab` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payroll` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SalaryAdjustments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IndividualSalaryAdjustments" DROP CONSTRAINT "IndividualSalaryAdjustments_empId_fkey";

-- DropForeignKey
ALTER TABLE "IndividualSalaryAdjustments" DROP CONSTRAINT "IndividualSalaryAdjustments_orgId_fkey";

-- DropForeignKey
ALTER TABLE "PayeTaxSlab" DROP CONSTRAINT "PayeTaxSlab_orgId_fkey";

-- DropForeignKey
ALTER TABLE "Payroll" DROP CONSTRAINT "Payroll_empId_fkey";

-- DropForeignKey
ALTER TABLE "Payroll" DROP CONSTRAINT "Payroll_orgId_fkey";

-- DropForeignKey
ALTER TABLE "SalaryAdjustments" DROP CONSTRAINT "SalaryAdjustments_orgId_fkey";

-- DropTable
DROP TABLE "IndividualSalaryAdjustments";

-- DropTable
DROP TABLE "PayeTaxSlab";

-- DropTable
DROP TABLE "Payroll";

-- DropTable
DROP TABLE "SalaryAdjustments";
