/*
  Warnings:

  - You are about to drop the column `description` on the `version_schemas` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `version_schemas` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `version_schemas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."version_schemas" DROP COLUMN "description",
DROP COLUMN "isActive",
DROP COLUMN "name";
