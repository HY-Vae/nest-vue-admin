/*
  Warnings:

  - You are about to drop the column `leader_id` on the `sys_dept` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `sys_dept` DROP FOREIGN KEY `sys_dept_leader_id_fkey`;

-- DropIndex
DROP INDEX `sys_dept_leader_id_fkey` ON `sys_dept`;

-- AlterTable
ALTER TABLE `sys_dept` DROP COLUMN `leader_id`;

-- AlterTable
ALTER TABLE `sys_user` ADD COLUMN `post_id` VARCHAR(36) NULL;

-- CreateTable
CREATE TABLE `sys_post` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(30) NOT NULL,
    `code` VARCHAR(30) NOT NULL,
    `dept_id` VARCHAR(36) NULL,
    `is_leader` BOOLEAN NOT NULL DEFAULT false,
    `sort` INTEGER NOT NULL DEFAULT 0,
    `status` CHAR(1) NOT NULL,
    `remark` VARCHAR(255) NULL,
    `create_by` VARCHAR(64) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sys_post_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sys_user` ADD CONSTRAINT `sys_user_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `sys_post`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sys_post` ADD CONSTRAINT `sys_post_dept_id_fkey` FOREIGN KEY (`dept_id`) REFERENCES `sys_dept`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;
