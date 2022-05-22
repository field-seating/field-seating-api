/*
  Warnings:

  - You are about to drop the column `thumbnail_path` on the `Photos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[path]` on the table `Photos` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `PasswordResetTokens` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `PasswordResetTokens` DROP FOREIGN KEY `PasswordResetTokens_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Photos` DROP FOREIGN KEY `Photos_recordId_fkey`;

-- AlterTable
ALTER TABLE `Fields` MODIFY `img` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `PasswordResetTokens` MODIFY `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Photos` DROP COLUMN `thumbnail_path`,
    MODIFY `recordId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Records` MODIFY `score` VARCHAR(10) NULL,
    MODIFY `comment` VARCHAR(255) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Photos_path_key` ON `Photos`(`path`);

-- AddForeignKey
ALTER TABLE `Photos` ADD CONSTRAINT `Photos_recordId_fkey` FOREIGN KEY (`recordId`) REFERENCES `Records`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PasswordResetTokens` ADD CONSTRAINT `PasswordResetTokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
