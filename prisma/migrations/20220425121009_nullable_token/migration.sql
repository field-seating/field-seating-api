-- AlterTable
ALTER TABLE `Users` MODIFY `tokenCreatedAt` DATETIME(3) NULL,
    MODIFY `verificationToken` VARCHAR(255) NULL;
