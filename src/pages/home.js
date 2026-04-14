import { el, createSectionTitle } from '../utils/render.js';

export function renderHome() {
  const frag = document.createDocumentFragment();

  frag.appendChild(createSectionTitle('欢迎使用穗星数据库 / v2.0'));

  const cards = [
    {
      bg: 'var(--warning)',
      border: true,
      title: '📢 重要提示',
      content: el('div', null,
        el('div', null, '该项目已支持开源，任何玩家都可以在基础上进行二次创作，衍生或二创不确保功能完善。'),
        el('div', { style: { marginTop: '8px' } },
          el('strong', null, '联系（作者/开源者）QQ号：'), '3999296867', el('br'),
          el('strong', null, '官方群号：'), '984394343'
        ),
        el('div', { style: { color: 'var(--danger)', marginTop: '8px' } }, '⚠️ 除这个QQ号和群号以外，其他均为仿制，请仔细辨别！')
      ),
    },
    {
      title: '《原神：七神研究所》项目介绍',
      content: '《原神：七神研究所》是指由@穗星✧创作的一项专门做kun数据整理工作项目。该项目主要负责整理详细指令ID并列出说明其同类型不同指令的子ID工作',
    },
    {
      title: '项目宗旨',
      content: '《原神：七神研究所》完全免费仅供无内购公益服使用！此项目惠及无内购公益服，不收取任何费用，此项目创作初心是为了方便玩家查找场景与强敌指令，玩家可以广泛使用并创新。',
    },
    {
      title: '致谢',
      content: el('div', null,
        el('div', null, '《原神：七神研究所》该项目成立得益于大佬提供的支持与帮助'),
        el('div', null, el('strong', null, '📌 技术支持：'), ' @季雨 @蓝焰 @Yxzaoe 等大佬'),
        el('div', { style: { marginTop: '8px' } }, el('strong', null, '❤️ 资金支持：'), ' @玖儿')
      ),
    },
    {
      title: '项目发展',
      content: '《原神：七神研究所》目前正处于初级测试阶段，为了方便使用，后续发展将作为网址或软件上线',
    },
    {
      bg: 'var(--danger)',
      border: true,
      title: '⚠️ 重要防骗提醒',
      content: el('div', null,
        el('div', { style: { color: 'var(--danger)', fontWeight: 500 } }, '如果你是花钱进的，请立刻退款加举报❗️'),
        el('div', { style: { color: 'var(--danger)', marginTop: '8px' } }, '切记！坤服为纯公益服不收取任何费用，市面上有各种倒卖勾以此盈利，正宗坤服群聊只有一个。'),
        el('div', { style: { color: 'var(--danger)', marginTop: '8px' } }, '识别坤服也很简单，游戏内右下角的UID是以kun+UID的形式。'),
        el('div', { style: { color: 'var(--danger)', fontWeight: 600, marginTop: '10px' } }, '抵制倒卖勾，从你我做起！')
      ),
    },
    {
      title: '使用说明',
      content: el('div', null,
        '请使用上方导航栏切换到不同模块：', el('br'),
        '• ', el('strong', null, '常用指令'), '：获取角色、武器、材料等常用指令', el('br'),
        '• ', el('strong', null, '角色'), '：获取所有角色获取指令', el('br'),
        '• ', el('strong', null, '武器'), '：获取武器指令', el('br'),
        '• ', el('strong', null, '值得铭记的强敌'), '：Boss召唤指令', el('br'),
        '• ', el('strong', null, '所有场景/秘境ID'), '：传送至各种秘境', el('br'),
        '• ', el('strong', null, '其他模块'), '：更多游戏功能指令'
      ),
    },
  ];

  cards.forEach(c => {
    const card = el('div', { className: 'cmd-card' });
    card.style.flexDirection = 'column';
    card.style.alignItems = 'stretch';
    if (c.bg === 'var(--danger)') {
      card.style.background = 'rgba(255,77,79,0.06)';
      card.style.borderLeft = '4px solid var(--danger)';
    } else if (c.bg === 'var(--warning)') {
      card.style.background = 'rgba(250,140,22,0.06)';
      card.style.borderLeft = '4px solid var(--warning)';
    }

    const titleDiv = el('div', {
      style: {
        fontWeight: 600,
        fontSize: '1rem',
        marginBottom: '8px',
        color: c.bg === 'var(--danger)' ? 'var(--danger)' : c.bg === 'var(--warning)' ? 'var(--warning)' : 'var(--text-primary)',
      },
      textContent: c.title,
    });
    card.appendChild(titleDiv);

    const contentDiv = el('div', {
      style: { fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.7' },
    });
    if (typeof c.content === 'string') {
      contentDiv.textContent = c.content;
    } else {
      contentDiv.appendChild(c.content);
    }
    card.appendChild(contentDiv);

    frag.appendChild(card);
  });

  return frag;
}
