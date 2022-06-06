/*
  Warnings:

  - You are about to drop the column `zoneId` on the `Spaces` table. All the data in the column will be lost.
  - You are about to alter the column `colNumber` on the `Spaces` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Int`.
  - You are about to alter the column `rowNumber` on the `Spaces` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Int`.
  - Added the required column `positionColNumber` to the `Spaces` table without a default value. This is not possible if the table is not empty.
  - Added the required column `positionRowNumber` to the `Spaces` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Spaces` DROP FOREIGN KEY `Spaces_zoneId_fkey`;

-- DropIndex
DROP INDEX `Spaces_zoneId_version_colNumber_rowNumber_key` ON `Spaces`;

-- AlterTable
ALTER TABLE `Spaces` DROP COLUMN `zoneId`,
    ADD COLUMN `name` VARCHAR(40) NULL,
    ADD COLUMN `positionColNumber` INTEGER NOT NULL,
    ADD COLUMN `positionRowNumber` INTEGER NOT NULL,
    MODIFY `colNumber` INTEGER NULL,
    MODIFY `rowNumber` INTEGER NULL;

-- CreateTable
CREATE TABLE `Groups` (
    `spaceId` INTEGER NOT NULL,
    `spaceType` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`spaceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Groups` ADD CONSTRAINT `Groups_spaceId_spaceType_fkey` FOREIGN KEY (`spaceId`, `spaceType`) REFERENCES `Spaces`(`id`, `spaceType`) ON DELETE RESTRICT ON UPDATE CASCADE;
