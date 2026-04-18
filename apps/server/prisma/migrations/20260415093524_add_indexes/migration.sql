-- CreateIndex
CREATE INDEX `sys_action_log_user_id_created_at_idx` ON `sys_action_log`(`user_id`, `created_at`);

-- CreateIndex
CREATE INDEX `sys_login_log_user_name_created_at_idx` ON `sys_login_log`(`user_name`, `created_at`);

-- CreateIndex
CREATE INDEX `sys_todo_user_id_status_idx` ON `sys_todo`(`user_id`, `status`);

-- CreateIndex
CREATE INDEX `sys_user_phone_idx` ON `sys_user`(`phone`);

-- CreateIndex
CREATE INDEX `sys_user_status_idx` ON `sys_user`(`status`);

-- RenameIndex
ALTER TABLE `sys_dept` RENAME INDEX `sys_dept_parent_id_fkey` TO `sys_dept_parent_id_idx`;

-- RenameIndex
ALTER TABLE `sys_menu` RENAME INDEX `sys_menu_parent_id_fkey` TO `sys_menu_parent_id_idx`;

-- RenameIndex
ALTER TABLE `sys_user` RENAME INDEX `sys_user_dept_id_fkey` TO `sys_user_dept_id_idx`;
