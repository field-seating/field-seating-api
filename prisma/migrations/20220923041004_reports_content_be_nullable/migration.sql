/*
  Warnings:

  - You are about to alter the column `deletedAt` on the `Photos` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `resolvedTime` on the `Reports` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `Photos` MODIFY `deletedAt` DATETIME NULL;

-- AlterTable
ALTER TABLE `Reports` MODIFY `content` VARCHAR(255) NULL,
    MODIFY `resolvedTime` DATETIME NULL;
