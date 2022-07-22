/*
  Warnings:

  - You are about to drop the column `zoneId` on the `Spaces` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Spaces` DROP FOREIGN KEY `Spaces_zoneId_fkey`;

-- DropIndex
DROP INDEX `Spaces_zoneId_version_name_colNumber_rowNumber_key` ON `Spaces`;

-- AlterTable
ALTER TABLE `Spaces` DROP COLUMN `zoneId`;
