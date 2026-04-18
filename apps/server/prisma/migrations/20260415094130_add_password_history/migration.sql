-- AlterTable
ALTER TABLE `sys_user` ADD COLUMN `password_updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `sys_password_history` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `password_hash` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `sys_password_history_user_id_created_at_idx`(`user_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sys_password_history` ADD CONSTRAINT `sys_password_history_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `sys_user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
