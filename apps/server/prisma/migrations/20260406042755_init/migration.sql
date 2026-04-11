-- CreateTable
CREATE TABLE `sys_todo` (
    `id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `content` TEXT NOT NULL,
    `bizType` VARCHAR(20) NOT NULL,
    `priority` VARCHAR(10) NOT NULL DEFAULT 'normal',
    `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
    `link` VARCHAR(255) NULL,
    `biz_id` VARCHAR(36) NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `create_by` VARCHAR(64) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `complete_by` VARCHAR(36) NULL,
    `completed_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sys_todo` ADD CONSTRAINT `sys_todo_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `sys_user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
