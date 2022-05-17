/*
  Warnings:

  - Added the required column `spaceId` to the `Photos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Photos` ADD COLUMN `spaceId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Photos` ADD CONSTRAINT `Photos_spaceId_fkey` FOREIGN KEY (`spaceId`) REFERENCES `Spaces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
