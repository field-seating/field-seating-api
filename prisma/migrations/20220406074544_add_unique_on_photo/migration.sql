/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `Photos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[thumbnail_path]` on the table `Photos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Photos_path_key` ON `Photos`(`path`);

-- CreateIndex
CREATE UNIQUE INDEX `Photos_thumbnail_path_key` ON `Photos`(`thumbnail_path`);
