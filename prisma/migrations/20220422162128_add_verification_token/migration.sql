/*
  Warnings:

  - A unique constraint covering the columns `[verification_token]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `verification_token` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Users` ADD COLUMN `verification_token` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Users_verification_token_key` ON `Users`(`verification_token`);
