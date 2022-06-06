/*
  Warnings:

  - You are about to drop the column `zone` on the `Spaces` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[zoneId,version,name,colNumber,rowNumber]` on the table `Spaces` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Spaces` DROP COLUMN `zone`;

-- CreateIndex
CREATE UNIQUE INDEX `Spaces_zoneId_version_name_colNumber_rowNumber_key` ON `Spaces`(`zoneId`, `version`, `name`, `colNumber`, `rowNumber`);

-- AddForeignKey
ALTER TABLE `Spaces` ADD CONSTRAINT `Spaces_zoneId_fkey` FOREIGN KEY (`zoneId`) REFERENCES `Zones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
