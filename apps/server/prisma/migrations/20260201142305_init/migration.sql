/*
  Warnings:

  - You are about to drop the column `create_by` on the `sys_action_log` table. All the data in the column will be lost.
  - You are about to drop the column `update_by` on the `sys_action_log` table. All the data in the column will be lost.
  - You are about to drop the column `update_time` on the `sys_action_log` table. All the data in the column will be lost.
  - You are about to alter the column `create_time` on the `temp` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `update_time` on the `temp` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `sys_action_log` DROP COLUMN `create_by`,
    DROP COLUMN `update_by`,
    DROP COLUMN `update_time`;

-- AlterTable
ALTER TABLE `temp` MODIFY `create_time` DATETIME NULL,
    MODIFY `update_time` DATETIME NULL;
