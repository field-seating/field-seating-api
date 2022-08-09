-- DropForeignKey
ALTER TABLE `Photos` DROP FOREIGN KEY `Photos_userId_fkey`;

-- AlterTable
ALTER TABLE `Photos` MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Photos` ADD CONSTRAINT `Photos_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
