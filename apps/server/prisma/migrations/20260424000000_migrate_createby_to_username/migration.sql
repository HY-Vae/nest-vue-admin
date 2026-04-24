-- 将所有 create_by / update_by 从 nickName 迁移为 userName
-- 通过 JOIN sys_user 表按 nick_name 匹配

-- sys_user
UPDATE sys_user su
  INNER JOIN sys_user su2 ON su2.nick_name = su.create_by
  SET su.create_by = su2.user_name;

UPDATE sys_user su
  INNER JOIN sys_user su2 ON su2.nick_name = su.update_by
  SET su.update_by = su2.user_name;

-- sys_role
UPDATE sys_role sr
  INNER JOIN sys_user su ON su.nick_name = sr.create_by
  SET sr.create_by = su.user_name;

UPDATE sys_role sr
  INNER JOIN sys_user su ON su.nick_name = sr.update_by
  SET sr.update_by = su.user_name;

-- sys_menu
UPDATE sys_menu sm
  INNER JOIN sys_user su ON su.nick_name = sm.create_by
  SET sm.create_by = su.user_name;

UPDATE sys_menu sm
  INNER JOIN sys_user su ON su.nick_name = sm.update_by
  SET sm.update_by = su.user_name;

-- sys_dict
UPDATE sys_dict sd
  INNER JOIN sys_user su ON su.nick_name = sd.create_by
  SET sd.create_by = su.user_name;

UPDATE sys_dict sd
  INNER JOIN sys_user su ON su.nick_name = sd.update_by
  SET sd.update_by = su.user_name;

-- sys_dict_detail
UPDATE sys_dict_detail sdd
  INNER JOIN sys_user su ON su.nick_name = sdd.create_by
  SET sdd.create_by = su.user_name;

UPDATE sys_dict_detail sdd
  INNER JOIN sys_user su ON su.nick_name = sdd.update_by
  SET sdd.update_by = su.user_name;

-- temp
UPDATE temp t
  INNER JOIN sys_user su ON su.nick_name = t.create_by
  SET t.create_by = su.user_name;

UPDATE temp t
  INNER JOIN sys_user su ON su.nick_name = t.update_by
  SET t.update_by = su.user_name;

-- sys_dept
UPDATE sys_dept sde
  INNER JOIN sys_user su ON su.nick_name = sde.create_by
  SET sde.create_by = su.user_name;

UPDATE sys_dept sde
  INNER JOIN sys_user su ON su.nick_name = sde.update_by
  SET sde.update_by = su.user_name;

-- sys_post
UPDATE sys_post sp
  INNER JOIN sys_user su ON su.nick_name = sp.create_by
  SET sp.create_by = su.user_name;

UPDATE sys_post sp
  INNER JOIN sys_user su ON su.nick_name = sp.update_by
  SET sp.update_by = su.user_name;

-- auto_code
UPDATE auto_code ac
  INNER JOIN sys_user su ON su.nick_name = ac.create_by
  SET ac.create_by = su.user_name;

UPDATE auto_code ac
  INNER JOIN sys_user su ON su.nick_name = ac.update_by
  SET ac.update_by = su.user_name;

-- file_upload
UPDATE file_upload fu
  INNER JOIN sys_user su ON su.nick_name = fu.create_by
  SET fu.create_by = su.user_name;

UPDATE file_upload fu
  INNER JOIN sys_user su ON su.nick_name = fu.update_by
  SET fu.update_by = su.user_name;

-- sys_notice
UPDATE sys_notice sn
  INNER JOIN sys_user su ON su.nick_name = sn.create_by
  SET sn.create_by = su.user_name;

UPDATE sys_notice sn
  INNER JOIN sys_user su ON su.nick_name = sn.update_by
  SET sn.update_by = su.user_name;

-- sys_todo (create_by + complete_by)
UPDATE sys_todo st
  INNER JOIN sys_user su ON su.nick_name = st.create_by
  SET st.create_by = su.user_name;

UPDATE sys_todo st
  INNER JOIN sys_user su ON su.nick_name = st.complete_by
  SET st.complete_by = su.user_name;

-- sys_job
UPDATE sys_job sj
  INNER JOIN sys_user su ON su.nick_name = sj.create_by
  SET sj.create_by = su.user_name;

UPDATE sys_job sj
  INNER JOIN sys_user su ON su.nick_name = sj.update_by
  SET sj.update_by = su.user_name;
