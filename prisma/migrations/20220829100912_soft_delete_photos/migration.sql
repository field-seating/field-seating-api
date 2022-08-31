/*
  Warnings:

  - You are about to alter the column `resolvedTime` on the `Reports` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `Photos` ADD COLUMN `deletedAt` DATETIME NULL,
    ADD COLUMN `isDeleted` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Reports` MODIFY `resolvedTime` DATETIME NULL;
