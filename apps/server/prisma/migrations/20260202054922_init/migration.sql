-- CreateTable
CREATE TABLE `sys_user` (
    `id` VARCHAR(36) NOT NULL,
    `user_name` VARCHAR(30) NOT NULL,
    `avatar` VARCHAR(100) NULL,
    `email` VARCHAR(50) NULL,
    `nick_name` VARCHAR(30) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(11) NULL,
    `sex` CHAR(1) NULL DEFAULT '0',
    `status` CHAR(1) NULL DEFAULT '0',
    `user_type` VARCHAR(2) NULL,
    `remark` VARCHAR(255) NULL,
    `create_by` VARCHAR(64) NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL,
    `update_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sys_user_user_name_key`(`user_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_role` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(30) NOT NULL,
    `key` VARCHAR(30) NOT NULL,
    `sort` INTEGER NOT NULL DEFAULT 0,
    `status` CHAR(1) NOT NULL,
    `remark` VARCHAR(255) NULL,
    `create_by` VARCHAR(64) NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL,
    `update_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sys_role_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_menu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parent_id` INTEGER NULL,
    `path` VARCHAR(50) NOT NULL,
    `name` VARCHAR(30) NOT NULL,
    `auth` VARCHAR(30) NOT NULL,
    `hidden` BOOLEAN NOT NULL DEFAULT false,
    `component` VARCHAR(50) NULL,
    `status` CHAR(1) NOT NULL DEFAULT '0',
    `sort` INTEGER NOT NULL DEFAULT 0,
    `remark` VARCHAR(255) NULL,
    `create_by` VARCHAR(64) NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL,
    `update_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sys_menu_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_menu_meta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `active_name` VARCHAR(191) NULL,
    `keep_alive` BOOLEAN NOT NULL DEFAULT false,
    `default_menu` BOOLEAN NOT NULL DEFAULT false,
    `title` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `close_tab` BOOLEAN NOT NULL DEFAULT true,
    `sys_menu_id` INTEGER NULL,

    UNIQUE INDEX `sys_menu_meta_sys_menu_id_key`(`sys_menu_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_menu_parameter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(50) NULL,
    `key` VARCHAR(100) NULL,
    `value` TEXT NULL,
    `sys_menu_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_menu_btn` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` CHAR(30) NOT NULL,
    `auth` CHAR(30) NOT NULL,
    `sys_menu_id` INTEGER NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_dict` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `code` VARCHAR(30) NOT NULL,
    `sort` INTEGER NOT NULL,
    `status` CHAR(1) NOT NULL,
    `remark` VARCHAR(255) NULL,
    `create_by` VARCHAR(64) NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL,
    `update_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sys_dict_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_dict_detail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(30) NOT NULL,
    `value` VARCHAR(30) NOT NULL,
    `sort` INTEGER NOT NULL,
    `status` CHAR(1) NOT NULL,
    `remark` VARCHAR(255) NULL,
    `sys_dict_code` VARCHAR(30) NOT NULL,
    `create_by` VARCHAR(64) NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL,
    `update_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sys_dict_detail_value_sys_dict_code_key`(`value`, `sys_dict_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `temp` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(20) NOT NULL,
    `code` VARCHAR(20) NOT NULL,
    `temp_path` VARCHAR(30) NOT NULL,
    `create_by` VARCHAR(30) NULL,
    `create_time` DATETIME NULL,
    `update_by` VARCHAR(30) NULL,
    `update_time` DATETIME NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_dept` (
    `id` VARCHAR(36) NOT NULL,
    `dept_name` VARCHAR(30) NOT NULL,
    `dept_code` VARCHAR(20) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `create_by` VARCHAR(30) NULL,
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(30) NULL,
    `update_time` DATETIME(3) NULL,

    UNIQUE INDEX `sys_dept_dept_name_key`(`dept_name`),
    UNIQUE INDEX `sys_dept_dept_code_key`(`dept_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_action_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NULL,
    `action` VARCHAR(2) NULL,
    `method` VARCHAR(20) NULL,
    `ip` VARCHAR(20) NULL,
    `address` VARCHAR(100) NULL,
    `user_id` VARCHAR(36) NULL,
    `user_name` VARCHAR(30) NULL,
    `params` TEXT NULL,
    `result` TEXT NULL,
    `error_info` TEXT NULL,
    `status` VARCHAR(1) NULL,
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auto_code` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `name_zh` VARCHAR(50) NOT NULL,
    `model_name` VARCHAR(50) NOT NULL DEFAULT '',
    `web_path` VARCHAR(50) NOT NULL,
    `temp_id` VARCHAR(36) NOT NULL,
    `route_path` VARCHAR(50) NOT NULL,
    `fields` TEXT NOT NULL,
    `create_by` VARCHAR(30) NULL,
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(30) NULL,
    `update_time` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `file_upload` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `tag` VARCHAR(20) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `mime` VARCHAR(100) NOT NULL,
    `create_by` VARCHAR(30) NULL,
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(30) NULL,
    `update_time` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_action_log2` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NULL,
    `action` VARCHAR(2) NULL,
    `method` VARCHAR(20) NULL,
    `ip` VARCHAR(20) NULL,
    `address` VARCHAR(100) NULL,
    `user_id` VARCHAR(36) NULL,
    `user_name` VARCHAR(30) NULL,
    `params` TEXT NULL,
    `result` TEXT NULL,
    `error_info` TEXT NULL,
    `status` VARCHAR(1) NULL,
    `create_by` VARCHAR(30) NULL,
    `create_time` DATETIME(3) NULL,
    `update_by` VARCHAR(30) NULL,
    `update_time` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SysRoleToSysUser` (
    `A` VARCHAR(36) NOT NULL,
    `B` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `_SysRoleToSysUser_AB_unique`(`A`, `B`),
    INDEX `_SysRoleToSysUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SysMenuToSysRole` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `_SysMenuToSysRole_AB_unique`(`A`, `B`),
    INDEX `_SysMenuToSysRole_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SysMenuBtnToSysRole` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `_SysMenuBtnToSysRole_AB_unique`(`A`, `B`),
    INDEX `_SysMenuBtnToSysRole_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sys_menu` ADD CONSTRAINT `sys_menu_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `sys_menu`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sys_menu_meta` ADD CONSTRAINT `sys_menu_meta_sys_menu_id_fkey` FOREIGN KEY (`sys_menu_id`) REFERENCES `sys_menu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sys_menu_parameter` ADD CONSTRAINT `sys_menu_parameter_sys_menu_id_fkey` FOREIGN KEY (`sys_menu_id`) REFERENCES `sys_menu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sys_menu_btn` ADD CONSTRAINT `sys_menu_btn_sys_menu_id_fkey` FOREIGN KEY (`sys_menu_id`) REFERENCES `sys_menu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sys_dict_detail` ADD CONSTRAINT `sys_dict_detail_sys_dict_code_fkey` FOREIGN KEY (`sys_dict_code`) REFERENCES `sys_dict`(`code`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SysRoleToSysUser` ADD CONSTRAINT `_SysRoleToSysUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `sys_role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SysRoleToSysUser` ADD CONSTRAINT `_SysRoleToSysUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `sys_user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SysMenuToSysRole` ADD CONSTRAINT `_SysMenuToSysRole_A_fkey` FOREIGN KEY (`A`) REFERENCES `sys_menu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SysMenuToSysRole` ADD CONSTRAINT `_SysMenuToSysRole_B_fkey` FOREIGN KEY (`B`) REFERENCES `sys_role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SysMenuBtnToSysRole` ADD CONSTRAINT `_SysMenuBtnToSysRole_A_fkey` FOREIGN KEY (`A`) REFERENCES `sys_menu_btn`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SysMenuBtnToSysRole` ADD CONSTRAINT `_SysMenuBtnToSysRole_B_fkey` FOREIGN KEY (`B`) REFERENCES `sys_role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
