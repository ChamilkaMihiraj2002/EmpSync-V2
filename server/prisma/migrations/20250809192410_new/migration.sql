/*
  Warnings:

  - A unique constraint covering the columns `[empNo,organizationId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organizationId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passkeyRegeneratedAt" TIMESTAMP(3),
ADD COLUMN     "passkeyRegeneratedBy" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_empNo_organizationId_key" ON "User"("empNo", "organizationId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
