BEGIN;
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES ('0af7ee60-211d-492c-9cb6-31ca828641d8', '31fd58c5d936bee551d725b8cbe5a8f1c3e39eea4a515beb3d59e70652ce44e9', '2026-02-02 05:51:07.681', '20260202055107_init', NULL, NULL, '2026-02-02 05:51:07.679', 1);
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES ('0ccbf2e6-95fa-45e6-ad01-05680bd9e93f', 'd86df8303dfb30d071c314f4ff50c7c1970736cb2cc695500241417248a91ac9', '2026-02-02 05:49:23.028', '20260202054922_init', NULL, NULL, '2026-02-02 05:49:22.908', 1);
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES ('6e22253f-d104-4930-8ccf-cce82a77de43', '7bac2ec57b1f7775301d6e658e740e34762b08a44368ecd698c2bebdad93048e', '2026-02-02 06:45:55.549', '20260202064555_init', NULL, NULL, '2026-02-02 06:45:55.540', 1);
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES ('93c98b22-3ba2-441b-897b-23f95558bc65', '23862195cd516b7f3336c57c7cbe316bc89d2328e8215ecd1c29177b6adcc7c7', '2026-02-02 06:57:35.481', '20260202065735_init', NULL, NULL, '2026-02-02 06:57:35.476', 1);
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES ('a4ad9f03-8138-44f2-b765-f35010a98d80', 'd44ccf018bd5404dbbf5d2f64b37f3a73dc02a1a181043caaca10888ac4009b9', '2026-02-02 06:10:25.590', '20260202061025_init', NULL, NULL, '2026-02-02 06:10:25.580', 1);
COMMIT;



BEGIN;
INSERT INTO `_SysMenuToSysRole` (`A`, `B`) VALUES (7, '51928e3f6bc64451bb1664cecaaf2734');
INSERT INTO `_SysMenuToSysRole` (`A`, `B`) VALUES (8, '51928e3f6bc64451bb1664cecaaf2734');
INSERT INTO `_SysMenuToSysRole` (`A`, `B`) VALUES (10, '51928e3f6bc64451bb1664cecaaf2734');
INSERT INTO `_SysMenuToSysRole` (`A`, `B`) VALUES (11, '51928e3f6bc64451bb1664cecaaf2734');
INSERT INTO `_SysMenuToSysRole` (`A`, `B`) VALUES (12, '51928e3f6bc64451bb1664cecaaf2734');
INSERT INTO `_SysMenuToSysRole` (`A`, `B`) VALUES (22, '51928e3f6bc64451bb1664cecaaf2734');
INSERT INTO `_SysMenuToSysRole` (`A`, `B`) VALUES (24, '51928e3f6bc64451bb1664cecaaf2734');
COMMIT;


-- ----------------------------
-- Records of _SysRoleToSysUser
-- ----------------------------
BEGIN;
INSERT INTO `_SysRoleToSysUser` (`A`, `B`) VALUES ('7ba3d7f686e14b9ba14f767ec00e77a4', '3cee5ca890d544c8984e436be7c0be94');
COMMIT;


BEGIN;
INSERT INTO `sys_dept` (`id`, `dept_name`, `dept_code`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES ('0845dee88abd433282c2d22042f8e7c8', '1', '1', '0', 'nva', NULL, NULL, NULL);
INSERT INTO `sys_dept` (`id`, `dept_name`, `dept_code`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES ('915ae3ec02874a8a8ed4fe2cf9db6161', '财务部', 'finance', '0', 'nva', NULL, NULL, NULL);
INSERT INTO `sys_dept` (`id`, `dept_name`, `dept_code`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES ('fddfcc0c1a8746a799d8f680e496b518', '3', '3', '0', 'nva', NULL, NULL, NULL);
COMMIT;


-- ----------------------------
-- Records of sys_dict
-- ----------------------------
BEGIN;
INSERT INTO `sys_dict` (`id`, `name`, `code`, `sort`, `status`, `remark`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (1, '启用状态', 'enableStatus', 0, '0', '', 'nva', '2025-11-05 07:28:00.275', NULL, '2025-11-05 07:28:00.275');
INSERT INTO `sys_dict` (`id`, `name`, `code`, `sort`, `status`, `remark`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (2, '性别', 'sexStatus', 1, '0', '', 'nva', '2025-11-18 01:47:07.416', NULL, '2025-11-18 01:47:07.416');
INSERT INTO `sys_dict` (`id`, `name`, `code`, `sort`, `status`, `remark`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (3, '请求结果', 'requestStatus', 3, '0', '', 'nva', '2026-02-01 12:20:34.224', NULL, '2026-02-01 12:20:34.224');
COMMIT;

-- ----------------------------
-- Records of sys_dict_detail
-- ----------------------------
BEGIN;
INSERT INTO `sys_dict_detail` (`id`, `label`, `value`, `sort`, `status`, `remark`, `sys_dict_code`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (1, '已启用', '0', 0, '0', '', 'enableStatus', 'nva', '2025-11-05 07:28:21.648', NULL, '2025-11-05 07:28:21.648');
INSERT INTO `sys_dict_detail` (`id`, `label`, `value`, `sort`, `status`, `remark`, `sys_dict_code`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (2, '已停用', '1', 1, '0', '', 'enableStatus', 'nva', '2025-11-05 07:28:36.039', NULL, '2025-11-05 07:28:36.039');
INSERT INTO `sys_dict_detail` (`id`, `label`, `value`, `sort`, `status`, `remark`, `sys_dict_code`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (3, '男', '0', 0, '0', '', 'sexStatus', 'nva', '2025-11-18 01:56:15.640', NULL, '2025-11-18 01:56:15.640');
INSERT INTO `sys_dict_detail` (`id`, `label`, `value`, `sort`, `status`, `remark`, `sys_dict_code`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (4, '女', '1', 1, '0', '', 'sexStatus', 'nva', '2025-11-18 02:24:43.266', NULL, '2025-11-18 02:24:43.266');
INSERT INTO `sys_dict_detail` (`id`, `label`, `value`, `sort`, `status`, `remark`, `sys_dict_code`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (5, '请求成功', '0', 0, '0', '', 'requestStatus', 'nva', '2026-02-01 12:20:56.380', NULL, '2026-02-01 12:20:56.380');
INSERT INTO `sys_dict_detail` (`id`, `label`, `value`, `sort`, `status`, `remark`, `sys_dict_code`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (6, '请求失败', '1', 1, '0', '', 'requestStatus', 'nva', '2026-02-01 12:21:07.326', NULL, '2026-02-01 12:21:07.326');
COMMIT;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
BEGIN;
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `auth`, `hidden`, `component`, `status`, `sort`, `remark`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (7, NULL, '/sys', 'sys', 'sys', 0, 'views/layout/basic.vue', '0', 1, '', 'nva', '2025-11-03 06:52:00.686', 'nva', '2025-11-27 09:04:51.235');
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `auth`, `hidden`, `component`, `status`, `sort`, `remark`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (8, 7, '/sys/menu', 'menu', 'sys:menu', 0, 'views/sys/menu/menu.vue', '0', 0, '', 'nva', '2025-11-03 06:54:29.901', 'nva', '2025-11-27 08:24:48.662');
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `auth`, `hidden`, `component`, `status`, `sort`, `remark`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (10, 7, '/sys/dict', 'dict', 'sys:dict', 0, 'views/sys/dict/dict.vue', '0', 2, '', 'nva', '2025-11-06 00:31:54.110', 'nva', '2025-11-27 08:28:10.557');
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `auth`, `hidden`, `component`, `status`, `sort`, `remark`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (11, 7, '/sys/dict-detail/:code', 'dict-detail', 'sys:dictDetail', 1, 'views/sys/dictDetail/dictDetail.vue', '0', 2, '', 'nva', '2025-11-06 00:33:39.482', 'nva', '2025-11-27 08:31:39.123');
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `auth`, `hidden`, `component`, `status`, `sort`, `remark`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (12, 7, '/sys/role', 'role', 'sys:role', 0, 'views/sys/role/role.vue', '0', 1, '', 'nva', '2025-11-06 03:19:44.642', 'nva', '2025-11-27 08:35:09.235');
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `auth`, `hidden`, `component`, `status`, `sort`, `remark`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (13, NULL, '/tool', 'tool', 'tool', 0, 'views/layout/basic.vue', '0', 2, '', 'nva', '2025-11-07 09:28:40.428', 'nva', '2025-11-25 01:30:07.446');
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `auth`, `hidden`, `component`, `status`, `sort`, `remark`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (14, 13, '/tool/temp', 'temp', 'tool:temp', 0, 'views/tool/temp/temp.vue', '0', 0, '', 'nva', '2025-11-07 09:29:57.743', 'nva', '2025-11-19 01:08:20.255');
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `auth`, `hidden`, `component`, `status`, `sort`, `remark`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (15, 13, '/tool/gen', 'gen', 'tool:gen', 0, 'views/tool/gen/gen.vue', '0', 1, '', 'nva', '2025-11-11 00:21:51.822', 'nva', '2025-11-18 08:25:24.716');
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `auth`, `hidden`, `component`, `status`, `sort`, `remark`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (22, 7, '/sys/dept', 'sys-dept', 'sys:dept', 0, 'views/sys/dept/sysDept.vue', '0', 5, NULL, '自动生成', '2025-11-12 07:45:11.940', 'nva', '2025-11-27 08:36:20.086');
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `auth`, `hidden`, `component`, `status`, `sort`, `remark`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (23, 13, '/tool/auto-code', 'auto-code', 'tool:auto-code', 0, 'views/tool/auto-code/autoCode.vue', '0', 5, NULL, '自动生成', '2025-11-12 08:57:44.528', 'nva', '2025-11-19 01:08:27.854');
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `auth`, `hidden`, `component`, `status`, `sort`, `remark`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (24, 7, '/sys/user', 'user', 'sys:user', 0, 'views/sys/user/user.vue', '0', 0, '', 'nva', '2025-11-17 07:14:55.818', 'nva', '2025-11-27 08:25:22.356');
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `auth`, `hidden`, `component`, `status`, `sort`, `remark`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (25, NULL, '/upload', 'upload', 'upload', 0, 'views/layout/basic.vue', '0', 3, NULL, 'nva', '2025-11-19 08:20:03.530', 'nva', '2025-11-27 08:39:15.072');
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `auth`, `hidden`, `component`, `status`, `sort`, `remark`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (26, 25, '/upload/file', 'file-upload', 'upload:file:list', 0, 'views/upload/file/fileUpload.vue', '0', 5, NULL, '自动生成', '2025-11-19 08:38:11.637', 'nva', '2025-11-27 08:38:52.482');
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `auth`, `hidden`, `component`, `status`, `sort`, `remark`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (27, NULL, '/welcome', 'welcome', 'welcome', 0, 'views/welcome/welcome.vue', '0', 0, '', 'nva', '2025-11-25 01:29:52.138', 'nva', '2025-11-27 09:04:00.403');
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `auth`, `hidden`, `component`, `status`, `sort`, `remark`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (36, NULL, 'https://jsutil.cn', 'https://jsutil.cn', 'js-util', 0, '/', '0', 0, '', 'nva', '2026-01-19 21:51:57.930', 'nva', '2026-01-19 21:59:40.069');
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `auth`, `hidden`, `component`, `status`, `sort`, `remark`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES (37, 7, '/sys/sys-action-log', 'sys-action-log', 'sys:sys-action-log:list', 0, 'views/sys/sys-action-log/sysActionLog.vue', '0', 5, NULL, '自动生成', '2026-02-01 12:26:03.382', 'nva', '2026-02-02 02:55:18.269');
COMMIT;


-- ----------------------------
-- Records of sys_menu_btn
-- ----------------------------
BEGIN;
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (90, '新增生成代码', 'tool:gen:create', 15, '2025-11-18 08:25:24.716', '2025-11-18 08:25:24.716');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (91, '删除单个生成代码', 'tool:gen:remove', 15, '2025-11-18 08:25:24.716', '2025-11-18 08:25:24.716');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (92, '批量删除生成代码', 'tool:gen:removes', 15, '2025-11-18 08:25:24.716', '2025-11-18 08:25:24.716');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (93, '编辑生成代码', 'tool:gen:update', 15, '2025-11-18 08:25:24.716', '2025-11-18 08:25:24.716');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (94, '查询生成代码列表', 'tool:gen:list', 15, '2025-11-18 08:25:24.716', '2025-11-18 08:25:24.716');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (95, '查询生成代码详情', 'tool:gen:detail', 15, '2025-11-18 08:25:24.716', '2025-11-18 08:25:24.716');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (120, '新增模板管理', 'tool:temp:create', 14, '2025-11-19 01:08:20.255', '2025-11-19 01:08:20.255');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (121, '删除单个模板管理', 'tool:temp:remove', 14, '2025-11-19 01:08:20.255', '2025-11-19 01:08:20.255');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (122, '批量删除模板管理', 'tool:temp:removes', 14, '2025-11-19 01:08:20.255', '2025-11-19 01:08:20.255');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (123, '编辑模板管理', 'tool:temp:update', 14, '2025-11-19 01:08:20.255', '2025-11-19 01:08:20.255');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (124, '查询模板管理列表', 'tool:temp:list', 14, '2025-11-19 01:08:20.255', '2025-11-19 01:08:20.255');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (125, '查询模板管理详情', 'tool:temp:detail', 14, '2025-11-19 01:08:20.255', '2025-11-19 01:08:20.255');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (126, '新增生成列表', 'tool:auto-code:create', 23, '2025-11-19 01:08:27.854', '2025-11-19 01:08:27.854');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (127, '单个删除生成列表', 'tool:auto-code:remove', 23, '2025-11-19 01:08:27.854', '2025-11-19 01:08:27.854');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (128, '批量删除生成列表', 'tool:auto-code:removes', 23, '2025-11-19 01:08:27.854', '2025-11-19 01:08:27.854');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (129, '编辑生成列表', 'tool:auto-code:update', 23, '2025-11-19 01:08:27.854', '2025-11-19 01:08:27.854');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (130, '查询生成列表列表', 'tool:auto-code:list', 23, '2025-11-19 01:08:27.854', '2025-11-19 01:08:27.854');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (131, '查询生成列表详情', 'tool:auto-code:detail', 23, '2025-11-19 01:08:27.854', '2025-11-19 01:08:27.854');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (153, '新增', 'system:menu:create', 8, '2025-11-27 08:24:48.662', '2025-11-27 08:24:48.662');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (154, '单个删除', 'system:menu:remove', 8, '2025-11-27 08:24:48.662', '2025-11-27 08:24:48.662');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (155, '批量删除', 'system:menu:removes', 8, '2025-11-27 08:24:48.662', '2025-11-27 08:24:48.662');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (156, '编辑', 'system:menu:update', 8, '2025-11-27 08:24:48.662', '2025-11-27 08:24:48.662');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (157, '查询列表', 'system:menu:list', 8, '2025-11-27 08:24:48.662', '2025-11-27 08:24:48.662');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (158, '查询详情', 'sys:menu:detail', 8, '2025-11-27 08:24:48.662', '2025-11-27 08:24:48.662');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (159, '新增用户管理', 'sys:user:create', 24, '2025-11-27 08:25:22.356', '2025-11-27 08:25:22.356');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (160, '删除单个用户管理', 'sys:user:remove', 24, '2025-11-27 08:25:22.356', '2025-11-27 08:25:22.356');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (161, '批量删除用户管理', 'sys:user:removes', 24, '2025-11-27 08:25:22.356', '2025-11-27 08:25:22.356');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (162, '编辑用户管理', 'sys:user:update', 24, '2025-11-27 08:25:22.356', '2025-11-27 08:25:22.356');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (163, '查询用户管理列表', 'sys:user:list', 24, '2025-11-27 08:25:22.356', '2025-11-27 08:25:22.356');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (164, '查询用户管理详情', 'sys:user:detail', 24, '2025-11-27 08:25:22.356', '2025-11-27 08:25:22.356');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (171, '新增字典表', 'sys:dict:create', 10, '2025-11-27 08:28:10.557', '2025-11-27 08:28:10.557');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (172, '删除单个字典表', 'sys:dict:remove', 10, '2025-11-27 08:28:10.557', '2025-11-27 08:28:10.557');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (173, '批量删除字典表', 'sys:dict:removes', 10, '2025-11-27 08:28:10.557', '2025-11-27 08:28:10.557');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (174, '编辑字典表', 'sys:dict:update', 10, '2025-11-27 08:28:10.557', '2025-11-27 08:28:10.557');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (175, '查询字典表列表', 'sys:dict:list', 10, '2025-11-27 08:28:10.557', '2025-11-27 08:28:10.557');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (176, '查询字典表详情', 'sys:dict:detail', 10, '2025-11-27 08:28:10.557', '2025-11-27 08:28:10.557');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (183, '新增字典表详情', 'sys:dictDetail:create', 11, '2025-11-27 08:31:39.123', '2025-11-27 08:31:39.123');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (184, '删除单个字典表详情', 'sys:dictDetail:remove', 11, '2025-11-27 08:31:39.123', '2025-11-27 08:31:39.123');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (185, '批量删除字典表详情', 'sys:dictDetail:removes', 11, '2025-11-27 08:31:39.123', '2025-11-27 08:31:39.123');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (186, '编辑字典表详情', 'sys:dictDetail:update', 11, '2025-11-27 08:31:39.123', '2025-11-27 08:31:39.123');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (187, '查询字典表详情列表', 'sys:dictDetail:list', 11, '2025-11-27 08:31:39.123', '2025-11-27 08:31:39.123');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (188, '查询字典表详情', 'sys:dictDetail:detail', 11, '2025-11-27 08:31:39.123', '2025-11-27 08:31:39.123');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (189, '新增角色管理', 'sys:role:create', 12, '2025-11-27 08:35:09.235', '2025-11-27 08:35:09.235');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (190, '删除单个角色管理', 'sys:role:remove', 12, '2025-11-27 08:35:09.235', '2025-11-27 08:35:09.235');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (191, '批量删除角色管理', 'sys:role:removes', 12, '2025-11-27 08:35:09.235', '2025-11-27 08:35:09.235');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (192, '编辑角色管理', 'sys:role:update', 12, '2025-11-27 08:35:09.235', '2025-11-27 08:35:09.235');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (193, '查询角色管理列表', 'sys:role:list', 12, '2025-11-27 08:35:09.235', '2025-11-27 08:35:09.235');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (194, '查询角色管理详情', 'sys:role:detail', 12, '2025-11-27 08:35:09.235', '2025-11-27 08:35:09.235');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (195, '新增部门', 'sys:dept:create', 22, '2025-11-27 08:36:20.086', '2025-11-27 08:36:20.086');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (196, '单个删除部门', 'sys:dept:remove', 22, '2025-11-27 08:36:20.086', '2025-11-27 08:36:20.086');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (197, '批量删除部门', 'sys:dept:removes', 22, '2025-11-27 08:36:20.086', '2025-11-27 08:36:20.086');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (198, '编辑部门', 'sys:dept:update', 22, '2025-11-27 08:36:20.086', '2025-11-27 08:36:20.086');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (199, '查询部门列表', 'sys:dept:list', 22, '2025-11-27 08:36:20.086', '2025-11-27 08:36:20.086');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (200, '查询部门详情', 'sys:dept:detail', 22, '2025-11-27 08:36:20.086', '2025-11-27 08:36:20.086');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (201, '新增附件上传', 'upload:file:create', 26, '2025-11-27 08:38:52.482', '2025-11-27 08:38:52.482');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (202, '单个删除附件上传', 'upload:file:remove', 26, '2025-11-27 08:38:52.482', '2025-11-27 08:38:52.482');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (203, '批量删除附件上传', 'upload:file:removes', 26, '2025-11-27 08:38:52.482', '2025-11-27 08:38:52.482');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (204, '编辑附件上传', 'upload:file:update', 26, '2025-11-27 08:38:52.482', '2025-11-27 08:38:52.482');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (205, '查询附件上传列表', 'upload:file:list', 26, '2025-11-27 08:38:52.482', '2025-11-27 08:38:52.482');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (206, '查询附件上传详情', 'upload:file:detail', 26, '2025-11-27 08:38:52.482', '2025-11-27 08:38:52.482');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (249, '查询操作日志列表', 'sys:sys-action-log:list', 37, '2026-02-02 02:55:18.269', '2026-02-02 02:55:18.269');
INSERT INTO `sys_menu_btn` (`id`, `name`, `auth`, `sys_menu_id`, `create_at`, `update_at`) VALUES (250, '查询操作日志详情', 'sys:sys-action-log:detail', 37, '2026-02-02 02:55:18.269', '2026-02-02 02:55:18.269');
COMMIT;


-- ----------------------------
-- Records of sys_menu_meta
-- ----------------------------
BEGIN;
INSERT INTO `sys_menu_meta` (`id`, `active_name`, `keep_alive`, `default_menu`, `title`, `icon`, `close_tab`, `sys_menu_id`) VALUES (3, '', 0, 0, '系统管理', 'ri:settings-5-line', 1, 7);
INSERT INTO `sys_menu_meta` (`id`, `active_name`, `keep_alive`, `default_menu`, `title`, `icon`, `close_tab`, `sys_menu_id`) VALUES (4, '', 0, 0, '菜单配置', 'ri:menu-line', 1, 8);
INSERT INTO `sys_menu_meta` (`id`, `active_name`, `keep_alive`, `default_menu`, `title`, `icon`, `close_tab`, `sys_menu_id`) VALUES (6, '', 0, 0, '字典表', 'material-symbols:dictionary-rounded', 1, 10);
INSERT INTO `sys_menu_meta` (`id`, `active_name`, `keep_alive`, `default_menu`, `title`, `icon`, `close_tab`, `sys_menu_id`) VALUES (7, 'dict', 0, 0, '字典表详情', '', 1, 11);
INSERT INTO `sys_menu_meta` (`id`, `active_name`, `keep_alive`, `default_menu`, `title`, `icon`, `close_tab`, `sys_menu_id`) VALUES (8, '', 0, 0, '角色管理', 'material-symbols:shield-person-rounded', 1, 12);
INSERT INTO `sys_menu_meta` (`id`, `active_name`, `keep_alive`, `default_menu`, `title`, `icon`, `close_tab`, `sys_menu_id`) VALUES (9, '', 0, 0, '代码生成', '', 1, 13);
INSERT INTO `sys_menu_meta` (`id`, `active_name`, `keep_alive`, `default_menu`, `title`, `icon`, `close_tab`, `sys_menu_id`) VALUES (10, '', 0, 0, '模板管理', '', 1, 14);
INSERT INTO `sys_menu_meta` (`id`, `active_name`, `keep_alive`, `default_menu`, `title`, `icon`, `close_tab`, `sys_menu_id`) VALUES (11, '', 0, 0, '生成代码', '', 1, 15);
INSERT INTO `sys_menu_meta` (`id`, `active_name`, `keep_alive`, `default_menu`, `title`, `icon`, `close_tab`, `sys_menu_id`) VALUES (16, NULL, 0, 0, '部门', 'mingcute:department-line', 1, 22);
INSERT INTO `sys_menu_meta` (`id`, `active_name`, `keep_alive`, `default_menu`, `title`, `icon`, `close_tab`, `sys_menu_id`) VALUES (17, NULL, 0, 0, '生成列表', '', 1, 23);
INSERT INTO `sys_menu_meta` (`id`, `active_name`, `keep_alive`, `default_menu`, `title`, `icon`, `close_tab`, `sys_menu_id`) VALUES (18, '', 0, 0, '用户管理', 'ri:user-settings-line', 1, 24);
INSERT INTO `sys_menu_meta` (`id`, `active_name`, `keep_alive`, `default_menu`, `title`, `icon`, `close_tab`, `sys_menu_id`) VALUES (19, NULL, 0, 0, '附件', 'mingcute:file-line', 1, 25);
INSERT INTO `sys_menu_meta` (`id`, `active_name`, `keep_alive`, `default_menu`, `title`, `icon`, `close_tab`, `sys_menu_id`) VALUES (20, NULL, 0, 0, '附件上传', 'mingcute:folder-upload-line', 1, 26);
INSERT INTO `sys_menu_meta` (`id`, `active_name`, `keep_alive`, `default_menu`, `title`, `icon`, `close_tab`, `sys_menu_id`) VALUES (21, '', 0, 1, '欢迎页面', 'material-symbols:digital-wellbeing-outline', 1, 27);
INSERT INTO `sys_menu_meta` (`id`, `active_name`, `keep_alive`, `default_menu`, `title`, `icon`, `close_tab`, `sys_menu_id`) VALUES (30, '', 0, 0, 'js工具库', 'ri:tools-fill', 1, 36);
INSERT INTO `sys_menu_meta` (`id`, `active_name`, `keep_alive`, `default_menu`, `title`, `icon`, `close_tab`, `sys_menu_id`) VALUES (31, NULL, 0, 0, '操作日志', 'ri:blogger-line', 1, 37);
COMMIT;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
BEGIN;
INSERT INTO `sys_role` (`id`, `name`, `key`, `sort`, `status`, `remark`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES ('51928e3f6bc64451bb1664cecaaf2734', '角色1', 'role1', 0, '0', '', 'nva', '2025-11-17 08:20:25.701', 'nva', '2025-11-19 01:09:05.372');
INSERT INTO `sys_role` (`id`, `name`, `key`, `sort`, `status`, `remark`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES ('7ba3d7f686e14b9ba14f767ec00e77a4', '角色2', 'role2', 1, '0', '', 'nva', '2025-11-17 08:22:19.734', 'nva', '2025-11-25 09:38:55.981');
COMMIT;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
BEGIN;
INSERT INTO `sys_user` (`id`, `user_name`, `avatar`, `email`, `nick_name`, `password`, `phone`, `sex`, `status`, `user_type`, `remark`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES ('1', 'admin', NULL, NULL, 'nva', '$2b$10$KTXfR37g00JCSvByd89Cx.zoUn4.vsICmMWWgUh26Qzscx4F4sCnG', NULL, '0', '0', NULL, NULL, NULL, '2025-11-12 03:19:00.508', NULL, '2025-11-12 03:19:00.508');
INSERT INTO `sys_user` (`id`, `user_name`, `avatar`, `email`, `nick_name`, `password`, `phone`, `sex`, `status`, `user_type`, `remark`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES ('3cee5ca890d544c8984e436be7c0be94', 'test', '', '', '测大侠', '$2b$10$W7wVqgABUcknH378qKQXoux2OioIeVen7stQv8QuX5A9DTTWR3r3i', '', '0', '0', '', '', 'nva', '2025-11-18 07:07:03.645', 'nva', '2025-11-25 09:38:29.285');
COMMIT;

-- ----------------------------
-- Records of temp
-- ----------------------------
BEGIN;
INSERT INTO `temp` (`id`, `name`, `code`, `temp_path`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES ('123', '代码生成', 'tool', 'modules/tool', 'nva', NULL, NULL, NULL);
INSERT INTO `temp` (`id`, `name`, `code`, `temp_path`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES ('678e5be0ab5a40a2b82b090608540c3b', '附件上传', 'upload', 'modules/upload', 'nva', NULL, NULL, NULL);
INSERT INTO `temp` (`id`, `name`, `code`, `temp_path`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES ('6f26d59c0389407088bce8f0faa73474', '系统管理', 'sys', 'modules/sys', 'nva', NULL, NULL, NULL);
COMMIT;
