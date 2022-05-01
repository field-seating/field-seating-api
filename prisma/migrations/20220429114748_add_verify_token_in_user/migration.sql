/*
  Warnings:

  - A unique constraint covering the columns `[verificationToken]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Users` ADD COLUMN `tokenCreatedAt` DATETIME(3) NULL,
    ADD COLUMN `verificationToken` VARCHAR(255) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Users_verificationToken_key` ON `Users`(`verificationToken`);
