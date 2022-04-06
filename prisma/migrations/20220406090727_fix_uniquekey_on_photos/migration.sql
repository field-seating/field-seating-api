/*
  Warnings:

  - A unique constraint covering the columns `[spaceId,path]` on the table `Photos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[spaceId,thumbnail_path]` on the table `Photos` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Photos_path_key` ON `Photos`;

-- DropIndex
DROP INDEX `Photos_thumbnail_path_key` ON `Photos`;

-- CreateIndex
CREATE UNIQUE INDEX `Photos_spaceId_path_key` ON `Photos`(`spaceId`, `path`);

-- CreateIndex
CREATE UNIQUE INDEX `Photos_spaceId_thumbnail_path_key` ON `Photos`(`spaceId`, `thumbnail_path`);
