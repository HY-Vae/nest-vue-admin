-- AlterTable
ALTER TABLE `sys_dept` ADD COLUMN `ancestors` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `sys_role` ADD COLUMN `data_scope` VARCHAR(20) NOT NULL DEFAULT 'SELF',
    ADD COLUMN `is_super` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `_SysDeptToSysRole` (
    `A` VARCHAR(36) NOT NULL,
    `B` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `_SysDeptToSysRole_AB_unique`(`A`, `B`),
    INDEX `_SysDeptToSysRole_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_SysDeptToSysRole` ADD CONSTRAINT `_SysDeptToSysRole_A_fkey` FOREIGN KEY (`A`) REFERENCES `sys_dept`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SysDeptToSysRole` ADD CONSTRAINT `_SysDeptToSysRole_B_fkey` FOREIGN KEY (`B`) REFERENCES `sys_role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
