import type { PrismaClient } from '@prisma/client';

export async function initMessages(prisma: PrismaClient) {
  console.log('开始初始化消息数据...');

  // 获取用户列表
  const users = await prisma.sysUser.findMany({
    select: { id: true, userName: true },
    take: 5,
  });

  if (users.length === 0) {
    console.log('没有用户数据，跳过消息初始化');
    return;
  }

  // 创建通知公告（使用固定id，确保幂等）
  const notices = [
    {
      id: 'notice-seed-001',
      title: '系统升级通知',
      content:
        '尊敬的用户：\n\n系统将于本周六凌晨2:00-6:00进行版本升级，届时系统将暂停服务。请各位提前做好相关工作安排，感谢您的理解与支持！\n\n如有疑问，请联系技术支持。',
      type: 'notice',
      status: '0',
      createBy: users[0].userName,
    },
    {
      id: 'notice-seed-002',
      title: '重要安全提醒',
      content:
        '尊敬的用户：\n\n近期发现有不法分子冒充系统管理员进行诈骗，请注意：\n1. 系统管理员不会主动要求您提供密码\n2. 不要点击来历不明的链接\n3. 如遇可疑情况请及时举报\n\n安全无小事，请各位务必重视！',
      type: 'warning',
      status: '0',
      createBy: users[0].userName,
    },
    {
      id: 'notice-seed-003',
      title: '五一放假通知',
      content:
        '各位同事：\n\n五一劳动节将至，根据国家法定节假日安排，公司将于5月1日至5月5日放假，共5天。\n\n放假期间请做好工作交接，紧急事务请联系值班人员。\n\n祝大家节日快乐！',
      type: 'notice',
      status: '0',
      createBy: users[0].userName,
    },
    {
      id: 'notice-seed-004',
      title: '新功能上线通知',
      content:
        '尊敬的用户：\n\n系统已更新上线以下新功能：\n\n1. 消息中心模块\n2. 待办事项管理\n3. 个人中心优化\n\n欢迎各位体验并反馈意见！',
      type: 'system',
      status: '0',
      createBy: users[0].userName,
    },
    {
      id: 'notice-seed-005',
      title: '紧急维护通知',
      content:
        '紧急通知：\n\n系统检测到异常流量，将于今晚23:00-24:00进行紧急维护。\n届时部分功能可能无法正常使用，敬请谅解。\n\n如有紧急需求，请联系值班电话：400-xxx-xxxx',
      type: 'urgent',
      status: '0',
      createBy: users[0].userName,
    },
  ];

  for (const notice of notices) {
    await prisma.sysNotice.upsert({
      where: { id: notice.id },
      update: {
        title: notice.title,
        content: notice.content,
        type: notice.type,
        status: notice.status,
      },
      create: notice,
    });
  }

  // 创建待办事项（使用固定id，确保幂等）
  const todos = [
    {
      id: 'todo-seed-001',
      title: '请审批采购申请单',
      content:
        '采购申请单 #2024-001\n\n申请部门：研发部\n申请金额：￥50,000\n申请事由：服务器扩容\n\n请尽快审批。',
      bizType: 'approval',
      priority: 'urgent',
      status: 'pending',
      userId: users[0].id,
      createBy: users[0].userName,
      link: '/approval/2024-001',
      bizId: '2024-001',
    },
    {
      id: 'todo-seed-002',
      title: '请确认项目验收',
      content:
        '项目验收单 #PRJ-2024-123\n\n项目名称：消息中心模块\n项目状态：已完成\n\n请确认项目成果并签署验收报告。',
      bizType: 'confirm',
      priority: 'high',
      status: 'pending',
      userId: users[0].id,
      createBy: users[0].userName,
      link: '/project/PRJ-2024-123',
      bizId: 'PRJ-2024-123',
    },
    {
      id: 'todo-seed-003',
      title: '请审核月度报告',
      content:
        '月度报告待审核\n\n报告月份：2024年3月\n报告类型：运营报告\n\n报告已提交，请审核后反馈意见。',
      bizType: 'review',
      priority: 'normal',
      status: 'pending',
      userId: users[1]?.id || users[0].id,
      createBy: users[0].userName,
    },
    {
      id: 'todo-seed-004',
      title: '请审批请假申请',
      content:
        '请假申请 #LV-2024-045\n\n申请人：张三\n请假类型：年假\n请假时间：2024年4月15日 - 2024年4月19日\n请假事由：家庭事务\n\n请审批。',
      bizType: 'approval',
      priority: 'normal',
      status: 'pending',
      userId: users[2]?.id || users[0].id,
      createBy: users[1]?.userName || users[0].userName,
    },
    {
      id: 'todo-seed-005',
      title: '请确认合同签署',
      content:
        '合同确认 #CT-2024-089\n\n合同名称：软件开发服务合同\n合同金额：￥200,000\n合同期限：1年\n\n请确认合同条款并安排签署。',
      bizType: 'confirm',
      priority: 'high',
      status: 'pending',
      userId: users[0].id,
      createBy: users[0].userName,
      link: '/contract/CT-2024-089',
      bizId: 'CT-2024-089',
    },
  ];

  for (const todo of todos) {
    await prisma.sysTodo.upsert({
      where: { id: todo.id },
      update: {
        title: todo.title,
        content: todo.content,
        bizType: todo.bizType,
        priority: todo.priority,
        status: todo.status,
        userId: todo.userId,
        link: todo.link,
        bizId: todo.bizId,
      },
      create: todo,
    });
  }

  console.log('消息数据初始化完成');
}
