/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Fields` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Levels` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Orientations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fieldId,name]` on the table `Zones` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Fields_name_key` ON `Fields`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Levels_name_key` ON `Levels`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Orientations_name_key` ON `Orientations`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Zones_fieldId_name_key` ON `Zones`(`fieldId`, `name`);
