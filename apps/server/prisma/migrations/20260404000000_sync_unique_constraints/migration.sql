-- This migration was already applied via `prisma db push`
-- Adding it here to sync migration history with database state

-- Add unique constraint to temp.code
ALTER TABLE `temp` ADD UNIQUE INDEX `temp_code_key`(`code`);

-- Add unique constraint to sys_menu_btn (auth, sys_menu_id)
ALTER TABLE `sys_menu_btn` ADD UNIQUE INDEX `sys_menu_btn_auth_sys_menu_id_key`(`auth`, `sys_menu_id`);
