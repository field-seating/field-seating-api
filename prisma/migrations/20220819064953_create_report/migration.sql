-- CreateTable
CREATE TABLE `Reports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `photoId` INTEGER NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `content` VARCHAR(255) NOT NULL,
    `resolvedTime` DATETIME NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reports` ADD CONSTRAINT `Reports_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reports` ADD CONSTRAINT `Reports_photoId_fkey` FOREIGN KEY (`photoId`) REFERENCES `Photos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
