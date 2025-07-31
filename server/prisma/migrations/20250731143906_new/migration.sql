/*
  Warnings:

  - You are about to drop the `Ingredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MealIngredient` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_orgId_fkey";

-- DropForeignKey
ALTER TABLE "MealIngredient" DROP CONSTRAINT "MealIngredient_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "MealIngredient" DROP CONSTRAINT "MealIngredient_mealId_fkey";

-- DropTable
DROP TABLE "Ingredient";

-- DropTable
DROP TABLE "MealIngredient";
