/*
  Warnings:

  - Made the column `userId` on table `PasswordResetTokens` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `PasswordResetTokens` DROP FOREIGN KEY `PasswordResetTokens_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Photos` DROP FOREIGN KEY `Photos_recordId_fkey`;

-- AlterTable
ALTER TABLE `PasswordResetTokens` MODIFY `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Photos` MODIFY `recordId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Photos` ADD CONSTRAINT `Photos_recordId_fkey` FOREIGN KEY (`recordId`) REFERENCES `Records`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PasswordResetTokens` ADD CONSTRAINT `PasswordResetTokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
