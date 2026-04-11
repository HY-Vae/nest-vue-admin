-- CreateTable
CREATE TABLE `sys_login_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(30) NOT NULL,
    `user_id` VARCHAR(36) NULL,
    `ip` VARCHAR(50) NULL,
    `location` VARCHAR(100) NULL,
    `browser` VARCHAR(50) NULL,
    `os` VARCHAR(50) NULL,
    `status` CHAR(1) NOT NULL,
    `message` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
