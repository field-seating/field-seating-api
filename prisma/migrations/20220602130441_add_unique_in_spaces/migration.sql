/*
  Warnings:

  - A unique constraint covering the columns `[zoneId,version,colNumber,rowNumber]` on the table `Spaces` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Pillars` ALTER COLUMN `spaceType` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Seats` ALTER COLUMN `spaceType` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `Spaces_zoneId_version_colNumber_rowNumber_key` ON `Spaces`(`zoneId`, `version`, `colNumber`, `rowNumber`);
