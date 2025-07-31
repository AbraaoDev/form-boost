/*
  Warnings:

  - You are about to drop the `answers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."answers" DROP CONSTRAINT "answers_versionSchemaId_fkey";

-- DropTable
DROP TABLE "public"."answers";
