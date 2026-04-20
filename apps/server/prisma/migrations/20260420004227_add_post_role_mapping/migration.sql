-- CreateTable
CREATE TABLE `_SysPostToSysRole` (
    `A` VARCHAR(36) NOT NULL,
    `B` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `_SysPostToSysRole_AB_unique`(`A`, `B`),
    INDEX `_SysPostToSysRole_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_SysPostToSysRole` ADD CONSTRAINT `_SysPostToSysRole_A_fkey` FOREIGN KEY (`A`) REFERENCES `sys_post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SysPostToSysRole` ADD CONSTRAINT `_SysPostToSysRole_B_fkey` FOREIGN KEY (`B`) REFERENCES `sys_role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
