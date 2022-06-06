/*
  Warnings:

  - A unique constraint covering the columns `[zoneId,version,name,colNumber,rowNumber]` on the table `Spaces` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `zoneId` to the `Spaces` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Spaces` ADD COLUMN `zoneId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Spaces_zoneId_version_name_colNumber_rowNumber_key` ON `Spaces`(`zoneId`, `version`, `name`, `colNumber`, `rowNumber`);

-- AddForeignKey
ALTER TABLE `Spaces` ADD CONSTRAINT `Spaces_zoneId_fkey` FOREIGN KEY (`zoneId`) REFERENCES `Zones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
