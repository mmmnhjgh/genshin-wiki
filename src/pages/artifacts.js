import { createCmdCard, createSectionTitle, createSubTitle } from '../utils/render.js';

export function renderArtifacts() {
  const frag = document.createDocumentFragment();
  frag.appendChild(createSectionTitle('圣遗物数据库'));

  // 二级导航
  const nav = document.createElement('div');
  nav.className = 'sub-nav-bar';
  nav.id = 'artifactNav';

  const tabs = [
    { id: 'characterArtifactSection', label: '常用圣遗物' },
    { id: 'artifactTutorialSection', label: '圣遗物配置教程' },
  ];

  tabs.forEach((tab, i) => {
    const btn = document.createElement('button');
    btn.className = `sub-nav-btn${i === 0 ? ' active' : ''}`;
    btn.textContent = tab.label;
    btn.addEventListener('click', () => {
      frag.querySelectorAll('.artifact-sub-section').forEach(s => s.style.display = 'none');
      const target = document.getElementById(tab.id);
      if (target) target.style.display = 'block';
      nav.querySelectorAll('.sub-nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
    nav.appendChild(btn);
  });
  frag.appendChild(nav);

  // 常用圣遗物
  const commonSection = document.createElement('div');
  commonSection.id = 'characterArtifactSection';
  commonSection.className = 'artifact-sub-section';

  commonSection.appendChild(createSubTitle('无敌圣遗物'));

  const artifacts = [
    { cmd: '/give 91524 lv20 10003 999003,99 999001,99 998002,99 989001,99 x1', desc: '【部位：死之羽】' },
    { cmd: '/give 94554 lv20 10007 999003,99 999001,99 998002,99 989001,99 x1', desc: '【部位：时之沙】' },
    { cmd: '/give 20514 lv20 50880 999003,99 999001,99 998002,99 989001,99 x1', desc: '【部位：空之杯】' },
    { cmd: '/give 90534 lv20 10004 999003,99 999001,99 998006,99 989001,99 x1', desc: '【部位：理之冠】' },
    { cmd: '/give 76544 lv20 10001 999003,99 999001,99 998002,99 999002,99 x1', desc: '【部位：生之花】' },
  ];

  artifacts.forEach(a => commonSection.appendChild(createCmdCard(a.cmd, a.desc)));
  frag.appendChild(commonSection);

  // 教程模块
  const tutorialSection = document.createElement('div');
  tutorialSection.id = 'artifactTutorialSection';
  tutorialSection.className = 'artifact-sub-section';
  tutorialSection.style.display = 'none';

  tutorialSection.appendChild(createSubTitle('圣遗物配置教程'));

  const templateCard = document.createElement('div');
  templateCard.className = 'cmd-card';
  templateCard.style.background = '#f0f9ff';
  templateCard.innerHTML = `
    <div class="cmd-code">/give +圣遗物ID lv+等级 +主词条 +副词条,+强化次数 x数量</div>
    <div class="cmd-desc">【圣遗物指令通用模板】</div>
  `;
  tutorialSection.appendChild(templateCard);

  // 主词条ID表
  tutorialSection.appendChild(createSubTitle('常用主词条ID'));
  const mainStats = [
    { id: '10002', name: '生命值百分比' }, { id: '10004', name: '攻击力百分比' },
    { id: '10006', name: '防御力百分比' }, { id: '10007', name: '元素充能效率' },
    { id: '13007', name: '暴击率' }, { id: '13008', name: '暴击伤害' },
    { id: '13009', name: '治疗加成' }, { id: '13010', name: '元素精通' },
    { id: '15008', name: '火元素伤害加成' }, { id: '15009', name: '雷元素伤害加成' },
    { id: '15010', name: '冰元素伤害加成' }, { id: '15011', name: '水元素伤害加成' },
    { id: '15012', name: '风元素伤害加成' }, { id: '15013', name: '岩元素伤害加成' },
    { id: '15014', name: '草元素伤害加成' }, { id: '15015', name: '物理伤害加成' },
  ];

  const grid = document.createElement('div');
  grid.className = 'card-grid';
  grid.style.marginTop = '15px';
  mainStats.forEach(s => {
    const card = document.createElement('div');
    card.className = 'info-card';
    card.innerHTML = `<div class="card-name">${s.id}</div><div class="card-desc">${s.name}</div>`;
    grid.appendChild(card);
  });
  tutorialSection.appendChild(grid);

  // 副词条ID表
  tutorialSection.appendChild(createSubTitle('常用副词条ID'));
  const subStats = [
    { id: '501204', name: '暴击率' }, { id: '501224', name: '暴击伤害' },
    { id: '501064', name: '攻击力百分比' }, { id: '501244', name: '元素精通' },
    { id: '501234', name: '元素充能' }, { id: '501094', name: '防御力百分比' },
    { id: '101031', name: '生命值百分比' }, { id: '101021', name: '生命值' },
    { id: '101051', name: '攻击力' }, { id: '101081', name: '防御力' },
  ];

  const grid2 = document.createElement('div');
  grid2.className = 'card-grid';
  grid2.style.marginTop = '15px';
  subStats.forEach(s => {
    const card = document.createElement('div');
    card.className = 'info-card';
    card.innerHTML = `<div class="card-name">${s.id}</div><div class="card-desc">${s.name}</div>`;
    grid2.appendChild(card);
  });
  tutorialSection.appendChild(grid2);

  frag.appendChild(tutorialSection);

  return frag;
}
