import { setSection, state } from '../store/state.js';

const navGroups = [
  {
    title: '📁 游戏指令',
    items: [
      { id: 'commonCommandsSection', label: '常用指令' },
      { id: 'charSection', label: '角色' },
      { id: 'weaponSection', label: '武器' },
      { id: 'artifactSection', label: '圣遗物' },
      { id: 'bossSection', label: '值得铭记的强敌' },
      { id: 'sceneSection', label: '所有场景/秘境ID' },
      { id: 'dreamSection', label: '自定义怪物' },
    ],
  },
  {
    title: '📰 未来消息',
    items: [
      { id: 'spiralSection', label: '深境螺旋' },
      { id: 'itemSection', label: '幽境危战' },
      { id: 'questNewSection', label: '祈愿卡池' },
      { id: 'questSection', label: '任务剧情' },
      { id: 'achievementSection', label: '成就' },
      { id: 'geographySection', label: '地理志' },
      { id: 'tutorialSection', label: '教程' },
      { id: 'eventSection', label: '活动' },
      { id: 'loadTipSection', label: '加载提示' },
    ],
  },
];

export function renderNavBar() {
  const nav = document.createElement('div');
  nav.className = 'nav-bar';

  // 首页按钮
  const homeBtn = document.createElement('button');
  homeBtn.className = 'nav-btn active';
  homeBtn.textContent = '首页';
  homeBtn.dataset.section = 'homeSection';
  homeBtn.addEventListener('click', () => switchSection('homeSection'));
  nav.appendChild(homeBtn);

  // 分组按钮
  navGroups.forEach(group => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'nav-group';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'nav-group-title';
    titleDiv.textContent = group.title;
    groupDiv.appendChild(titleDiv);

    const btnsDiv = document.createElement('div');
    btnsDiv.className = 'nav-group-buttons';

    group.items.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'nav-btn';
      btn.textContent = item.label;
      btn.dataset.section = item.id;
      btn.addEventListener('click', () => switchSection(item.id));
      btnsDiv.appendChild(btn);
    });

    groupDiv.appendChild(btnsDiv);
    nav.appendChild(groupDiv);
  });

  return nav;
}

function switchSection(sectionId) {
  setSection(sectionId);

  // 隐藏所有区块，显示目标区块
  document.querySelectorAll('.content-section').forEach(sec => {
    sec.style.display = sec.id === sectionId ? 'block' : 'none';
  });

  // 更新按钮高亮
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === sectionId);
  });

  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
