/*
  Warnings:

  - A unique constraint covering the columns `[userId,photoId]` on the table `Reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Reviews_userId_photoId_key` ON `Reviews`(`userId`, `photoId`);
