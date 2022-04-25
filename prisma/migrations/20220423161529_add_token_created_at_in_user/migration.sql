/*
  Warnings:

  - You are about to drop the column `verification_token` on the `Users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[verificationToken]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tokenCreatedAt` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verificationToken` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Users_verification_token_key` ON `Users`;

-- AlterTable
ALTER TABLE `Users` DROP COLUMN `verification_token`,
    ADD COLUMN `tokenCreatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `verificationToken` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Users_verificationToken_key` ON `Users`(`verificationToken`);
