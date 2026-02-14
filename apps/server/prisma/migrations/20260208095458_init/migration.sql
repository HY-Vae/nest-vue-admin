-- CreateTable
CREATE TABLE `grade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `score` FLOAT NOT NULL,
    `create_by` VARCHAR(30) NULL,
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(30) NULL,
    `update_time` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
