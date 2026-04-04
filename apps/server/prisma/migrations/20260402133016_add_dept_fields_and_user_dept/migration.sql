-- AlterTable
ALTER TABLE `sys_dept` ADD COLUMN `email` VARCHAR(50) NULL,
    ADD COLUMN `leader` VARCHAR(30) NULL,
    ADD COLUMN `phone` VARCHAR(11) NULL;

-- AlterTable
ALTER TABLE `sys_user` ADD COLUMN `dept_id` VARCHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `sys_user` ADD CONSTRAINT `sys_user_dept_id_fkey` FOREIGN KEY (`dept_id`) REFERENCES `sys_dept`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;
