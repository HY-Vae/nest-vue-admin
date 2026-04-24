-- C2: 统一 create_by / update_by 字段长度为 VarChar(30)，与 sys_user.user_name 一致

ALTER TABLE `sys_user` MODIFY COLUMN `create_by` VarChar(30) NULL;
ALTER TABLE `sys_user` MODIFY COLUMN `update_by` VarChar(30) NULL;

ALTER TABLE `sys_role` MODIFY COLUMN `create_by` VarChar(30) NULL;
ALTER TABLE `sys_role` MODIFY COLUMN `update_by` VarChar(30) NULL;

ALTER TABLE `sys_menu` MODIFY COLUMN `create_by` VarChar(30) NULL;
ALTER TABLE `sys_menu` MODIFY COLUMN `update_by` VarChar(30) NULL;

ALTER TABLE `sys_dict` MODIFY COLUMN `create_by` VarChar(30) NULL;
ALTER TABLE `sys_dict` MODIFY COLUMN `update_by` VarChar(30) NULL;

ALTER TABLE `sys_dict_detail` MODIFY COLUMN `create_by` VarChar(30) NULL;
ALTER TABLE `sys_dict_detail` MODIFY COLUMN `update_by` VarChar(30) NULL;

ALTER TABLE `sys_dept` MODIFY COLUMN `create_by` VarChar(30) NULL;
ALTER TABLE `sys_dept` MODIFY COLUMN `update_by` VarChar(30) NULL;

ALTER TABLE `sys_post` MODIFY COLUMN `create_by` VarChar(30) NULL;
ALTER TABLE `sys_post` MODIFY COLUMN `update_by` VarChar(30) NULL;

ALTER TABLE `sys_notice` MODIFY COLUMN `create_by` VarChar(30) NULL;
ALTER TABLE `sys_notice` MODIFY COLUMN `update_by` VarChar(30) NULL;

ALTER TABLE `sys_todo` MODIFY COLUMN `create_by` VarChar(30) NULL;

ALTER TABLE `sys_job` MODIFY COLUMN `create_by` VarChar(30) NULL;
ALTER TABLE `sys_job` MODIFY COLUMN `update_by` VarChar(30) NULL;

-- C3: 统一 created_at / updated_at 为 NOT NULL（DateTime）

ALTER TABLE `temp` MODIFY COLUMN `created_at` DateTime NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `temp` MODIFY COLUMN `updated_at` DateTime NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE `sys_dept` MODIFY COLUMN `created_at` DateTime NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `sys_dept` MODIFY COLUMN `updated_at` DateTime NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE `sys_action_log` MODIFY COLUMN `created_at` DateTime NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE `auto_code` MODIFY COLUMN `created_at` DateTime NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `auto_code` MODIFY COLUMN `updated_at` DateTime NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE `file_upload` MODIFY COLUMN `created_at` DateTime NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `file_upload` MODIFY COLUMN `updated_at` DateTime NOT NULL DEFAULT CURRENT_TIMESTAMP;
