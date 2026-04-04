/*
  Warnings:

  - You are about to drop the column `leader` on the `sys_dept` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sys_dept` DROP COLUMN `leader`,
    ADD COLUMN `leader_id` VARCHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `sys_dept` ADD CONSTRAINT `sys_dept_leader_id_fkey` FOREIGN KEY (`leader_id`) REFERENCES `sys_user`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;
