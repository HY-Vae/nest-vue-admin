/*
  Warnings:

  - You are about to alter the column `create_time` on the `temp` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `update_time` on the `temp` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `sys_action_log` MODIFY `create_time` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `temp` MODIFY `create_time` DATETIME NULL,
    MODIFY `update_time` DATETIME NULL;
