/*
  Warnings:

  - You are about to alter the column `name` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(40)`.

*/
-- AlterTable
ALTER TABLE `Users` MODIFY `name` VARCHAR(40) NOT NULL;
