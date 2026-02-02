/*
  Warnings:

  - You are about to drop the column `status` on the `file_upload` table. All the data in the column will be lost.
  - You are about to alter the column `create_time` on the `temp` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `update_time` on the `temp` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `sys_operate_log` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `file_upload` DROP COLUMN `status`;

-- AlterTable
ALTER TABLE `temp` MODIFY `create_time` DATETIME NULL,
    MODIFY `update_time` DATETIME NULL;

-- DropTable
DROP TABLE `sys_operate_log`;

-- CreateTable
CREATE TABLE `sys_action_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NULL,
    `action` VARCHAR(2) NULL,
    `method` VARCHAR(20) NULL,
    `ip` VARCHAR(20) NULL,
    `address` VARCHAR(100) NULL,
    `user_id` VARCHAR(36) NULL,
    `user_name` VARCHAR(30) NULL,
    `params` TEXT NULL,
    `result` TEXT NULL,
    `error_info` TEXT NULL,
    `status` VARCHAR(1) NULL,
    `create_by` VARCHAR(30) NULL,
    `create_time` DATETIME(3) NULL,
    `update_by` VARCHAR(30) NULL,
    `update_time` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
