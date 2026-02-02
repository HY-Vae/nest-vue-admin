/*
  Warnings:

  - You are about to alter the column `create_time` on the `temp` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `update_time` on the `temp` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `sys_action_log2` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `temp` MODIFY `create_time` DATETIME NULL,
    MODIFY `update_time` DATETIME NULL;

-- DropTable
DROP TABLE `sys_action_log2`;
