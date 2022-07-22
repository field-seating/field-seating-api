-- CreateTable
CREATE TABLE `Aisles` (
    `spaceId` INTEGER NOT NULL,
    `spaceType` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`spaceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Aisles` ADD CONSTRAINT `Aisles_spaceId_spaceType_fkey` FOREIGN KEY (`spaceId`, `spaceType`) REFERENCES `Spaces`(`id`, `spaceType`) ON DELETE RESTRICT ON UPDATE CASCADE;
