-- AlterTable
ALTER TABLE `sys_login_log` ADD COLUMN `expire_at` DATETIME(3) NULL,
    ADD COLUMN `logout_at` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `sys_login_log_user_id_status_logout_at_idx` ON `sys_login_log`(`user_id`, `status`, `logout_at`);
