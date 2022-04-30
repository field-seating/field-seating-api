/*
  Warnings:

  - You are about to alter the column `name` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(80)`.
  - A unique constraint covering the columns `[name]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Users` MODIFY `name` VARCHAR(80) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Users_name_key` ON `Users`(`name`);
