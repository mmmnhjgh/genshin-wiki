import { setSection, state } from '../store/state.js';

const navGroups = [
  {
    label: '游戏指令组',
    items: [
      { id: 'commonCommandsSection', label: '常用指令' },
      { id: 'charSection', label: '角色' },
      { id: 'weaponSection', label: '武器' },
      { id: 'artifactSection', label: '圣遗物' },
      { id: 'bossSection', label: 'Boss' },
      { id: 'sceneSection', label: '场景' },
      { id: 'dreamSection', label: '自定义怪物' },
    ],
  },
  {
    label: '数据查询组',
    items: [
      { id: 'itemSection', label: '物品' },
      { id: 'achievementSection', label: '成就' },
      { id: 'activitySection', label: '活动' },
      { id: 'spiralSection', label: '深境螺旋' },
      { id: 'questNewSection', label: '祈愿卡池' },
    ],
  },
];

export function renderNavBar() {
  const nav = document.createElement('nav');
  nav.className = 'main-nav';

  const homeBtn = document.createElement('button');
  homeBtn.className = 'btn active';
  homeBtn.textContent = '首页';
  homeBtn.dataset.section = 'homeSection';
  homeBtn.addEventListener('click', () => switchSection('homeSection'));
  nav.appendChild(homeBtn);

  navGroups.forEach(group => {
    const divider = document.createElement('div');
    divider.className = 'nav-divider';
    nav.appendChild(divider);

    const groupDiv = document.createElement('div');
    groupDiv.className = 'nav-group';

    const label = document.createElement('span');
    label.className = 'nav-group-label';
    label.textContent = group.label;
    groupDiv.appendChild(label);

    group.items.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.textContent = item.label;
      btn.dataset.section = item.id;
      btn.addEventListener('click', () => switchSection(item.id));
      groupDiv.appendChild(btn);
    });

    nav.appendChild(groupDiv);
  });

  window.addEventListener('hashchange', handleHash);
  setTimeout(handleHash, 0);

  return nav;
}

function handleHash() {
  const hash = window.location.hash.slice(1);
  if (hash && document.getElementById(hash)) {
    switchSection(hash);
  }
}

function switchSection(sectionId) {
  setSection(sectionId);

  document.querySelectorAll('.content-section').forEach(sec => {
    sec.style.display = sec.id === sectionId ? 'block' : 'none';
  });

  document.querySelectorAll('.main-nav .btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === sectionId);
  });

  if (window.location.hash.slice(1) !== sectionId) {
    history.replaceState(null, '', '#' + sectionId);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
