/*
  Warnings:

  - Made the column `type` on table `sys_menu_parameter` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `sys_menu_parameter` MODIFY `type` VARCHAR(10) NOT NULL,
    MODIFY `value` VARCHAR(191) NULL;
