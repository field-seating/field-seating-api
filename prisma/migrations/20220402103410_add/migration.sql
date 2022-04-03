-- AlterTable
ALTER TABLE `Fields` MODIFY `img` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `Records` MODIFY `score` VARCHAR(10) NULL,
    MODIFY `comment` VARCHAR(255) NULL;
