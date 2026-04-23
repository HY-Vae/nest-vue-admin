-- CreateTable
CREATE TABLE `sys_job` (
    `id` VARCHAR(36) NOT NULL,
    `job_name` VARCHAR(64) NOT NULL,
    `job_group` VARCHAR(64) NOT NULL,
    `invoke_target` VARCHAR(255) NOT NULL,
    `cron_expression` VARCHAR(50) NOT NULL,
    `misfire_policy` CHAR(1) NOT NULL DEFAULT '1',
    `concurrent` CHAR(1) NOT NULL DEFAULT '1',
    `status` CHAR(1) NOT NULL DEFAULT '0',
    `remark` VARCHAR(255) NULL,
    `create_by` VARCHAR(64) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_job_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `job_name` VARCHAR(64) NOT NULL,
    `job_group` VARCHAR(64) NOT NULL,
    `invoke_target` VARCHAR(255) NOT NULL,
    `status` CHAR(1) NOT NULL DEFAULT '0',
    `job_message` VARCHAR(255) NULL,
    `exception_info` TEXT NULL,
    `start_time` DATETIME(3) NULL,
    `end_time` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `sys_job_log_job_name_created_at_idx`(`job_name`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
