export function renderHome() {
  const frag = document.createDocumentFragment();

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.innerHTML = '欢迎使用穗星数据库/v2.0公告：<div class="boss-title" style="color: #ff4d4f; font-size: 16px;">1.全新Vite模块化架构<br>2.数据与视图分离<br>3.支持管理界面编辑数据<br>4.搜索性能优化</div>';
  frag.appendChild(title);

  const cards = [
    {
      bg: '#fff9f0',
      border: '#fa8c16',
      titleColor: '#fa8c16',
      title: '📢 重要提示',
      content: `
        <div>该项目已支持开源，任何玩家都可以在基础上进行二次新鲜创作，衍生或二创不确保功能完善。</div>
        <div style="margin-top: 8px;"><strong>联系（作者/开源者）QQ号：</strong>3999296867<br><strong>官方群号：</strong>984394343</div>
        <div style="color: #d4380d; margin-top: 8px;">⚠️ 除这个QQ号和群号以外，其他均为仿制，请仔细辨别！</div>
      `,
    },
    {
      bg: '#f0f9ff',
      border: '#1677ff',
      titleColor: '#1677ff',
      title: '《原神：七神研究所》项目介绍',
      content: '《原神：七神研究所》是指由@穗星✧创作的一项专门做kun数据整理工作项目。该项目主要负责整理详细指令ID并列出说明其同类型不同指令的子ID工作',
    },
    {
      bg: '#f6ffed',
      border: '#52c41a',
      titleColor: '#52c41a',
      title: '项目宗旨',
      content: '《原神：七神研究所》完全免费仅供无内购公益服使用！此项目惠及无内购公益服，不收取任何费用，此项目创作初心是为了方便玩家查找场景与强敌指令，玩家可以广泛使用并创新。',
    },
    {
      bg: '#fff7e6',
      border: '#fa8c16',
      titleColor: '#fa8c16',
      title: '致谢',
      content: `
        <div>《原神：七神研究所》该项目成立得益于大佬提供的支持与帮助</div>
        <div><strong>📌 技术支持：</strong> @季雨 @蓝焰 @Yxzaoe 等大佬</div>
        <div style="margin-top: 8px;"><strong>❤️ 资金支持：</strong> @玖儿</div>
      `,
    },
    {
      bg: '#f0f5ff',
      border: '#2f54eb',
      titleColor: '#2f54eb',
      title: '项目发展',
      content: '《原神：七神研究所》目前正处于初级测试阶段，为了方便使用，后续发展将作为网址或软件上线',
    },
    {
      bg: '#fff2f0',
      border: '#ff4d4f',
      titleColor: '#ff4d4f',
      title: '⚠️ 重要防骗提醒',
      content: `
        <div style="color: #ff4d4f; font-weight: 500;">如果你是花钱进的，请立刻退款加举报❗️</div>
        <div style="color: #ff4d4f; margin-top: 8px;">切记！坤服为纯公益服不收取任何费用，市面上有各种倒卖勾以此盈利，正宗坤服群聊只有一个。</div>
        <div style="color: #ff4d4f; margin-top: 8px;">识别坤服也很简单，游戏内右下角的UID是以kun+UID的形式。</div>
        <div style="color: #ff4d4f; font-weight: 600; margin-top: 10px;">抵制倒卖勾，从你我做起！</div>
      `,
    },
    {
      bg: '#fafbfc',
      border: null,
      titleColor: null,
      title: '使用说明',
      content: `
        请使用上方导航栏切换到不同模块：<br>
        • <strong>常用指令</strong>：获取角色、武器、材料等常用指令<br>
        • <strong>角色</strong>：获取所有角色获取指令<br>
        • <strong>武器</strong>：获取武器指令<br>
        • <strong>值得铭记的强敌</strong>：Boss召唤指令<br>
        • <strong>所有场景/秘境ID</strong>：传送至各种秘境<br>
        • <strong>其他模块</strong>：更多游戏功能指令
      `,
    },
  ];

  cards.forEach(c => {
    const card = document.createElement('div');
    card.className = 'cmd-card';
    card.style.background = c.bg;
    if (c.border) card.style.borderLeft = `4px solid ${c.border}`;

    const t = document.createElement('div');
    t.className = 'boss-title';
    if (c.titleColor) t.style.color = c.titleColor;
    t.textContent = c.title;
    card.appendChild(t);

    const d = document.createElement('div');
    d.className = 'cmd-desc';
    d.innerHTML = c.content;
    card.appendChild(d);

    frag.appendChild(card);
  });

  return frag;
}
