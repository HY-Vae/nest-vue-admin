-- AlterTable
ALTER TABLE `sys_dept` ADD COLUMN `parent_id` VARCHAR(36) NULL,
    ADD COLUMN `remark` VARCHAR(255) NULL,
    ADD COLUMN `sort` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `sys_dept` ADD CONSTRAINT `sys_dept_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `sys_dept`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
