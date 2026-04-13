import { createCmdCard, createSectionTitle } from '../utils/render.js';

const sceneGroups = [
  {
    id: 'scene1Section',
    label: '秘境1',
    items: [{ cmd: '', desc: '暂无相关指令，敬请期待' }],
  },
  {
    id: 'scene1000Section',
    label: '秘境1000',
    items: [{ cmd: '', desc: '暂无相关指令，敬请期待' }],
  },
  {
    id: 'scene20000Section',
    label: '秘境20000',
    versions: [
      {
        id: 'version10to16Section',
        label: '秘境（1.0~1.6）',
        items: [
          { cmd: '/tp 623 -58 206 20008', desc: '凯亚战斗训练任务地城test' },
          { cmd: '/tp -77 -7 102 20009', desc: '主线任务' },
          { cmd: '/tp -34 70 36 20010', desc: '安柏传说任务' },
          { cmd: '/tp 549 -43 36 20011', desc: '丽莎,温迪传说任务' },
          { cmd: '/tp 342 -27 485 20013', desc: '狮之殿' },
          { cmd: '/tp 122 22 38 20023', desc: '迪卢克传说任务' },
          { cmd: '/tp 190 57 318 20024', desc: '琴,可莉传说任务' },
          { cmd: '/tp 1 100 41 20026', desc: '等级突破副本' },
          { cmd: '/tp 1 1 1 20034', desc: '公子周本' },
          { cmd: '/tp 352 -12 266 20035', desc: '失落的忒耳摩冬遗迹' },
          { cmd: '/tp -158 1 -48 20104', desc: '「深渊」的诱惑' },
          { cmd: '/tp 518 74 493 20106', desc: '若陀龙王周本' },
        ],
      },
      {
        id: 'version20to28Section',
        label: '秘境（2.0~2.8）',
        items: [
          { cmd: '/tp 65 1 114 20111', desc: '町奉行所收监处' },
          { cmd: '/tp 479 100 473 20112', desc: '千手百眼' },
          { cmd: '/tp -10 1 52 20113', desc: '邪眼工厂' },
          { cmd: '/tp 1 1 1 20114', desc: '鸣神岛·天守' },
          { cmd: '/tp 1 1 1 20115', desc: '女士周本' },
          { cmd: '/tp -35 -259 -29 20121', desc: '鸣海栖霞洞天，申鹤传说任务' },
          { cmd: '/tp 3 1 8 20125', desc: '雷电将军周本' },
          { cmd: '/tp 10 49 126 20127', desc: '鹤径折旋之所' },
          { cmd: '/tp 325 199 494 20129', desc: '迷错幻渺之境' },
        ],
      },
      {
        id: 'version30to38Section',
        label: '秘境（3.0~3.8）',
        items: [
          { cmd: '/tp 528 18 556 20132', desc: '须弥兰娜罗梦境地城test' },
          { cmd: '/tp -11 1 75 20151', desc: '神秘的遗迹' },
          { cmd: '/tp -8 -58 -13 20154', desc: '散兵周本，无地板' },
          { cmd: '/tp 457 68 499 20159', desc: '沙下灵囿' },
          { cmd: '/tp 3 58 -10 20163', desc: '「降神工坊」' },
          { cmd: '/tp 1 5 13 20168', desc: '正机之神殿' },
          { cmd: '/tp 300 10 100 20179', desc: '草龙周本' },
        ],
      },
      {
        id: 'version40to48Section',
        label: '秘境（4.0~4.8）',
        items: [
          { cmd: '/tp 258 42 176 20186', desc: '水之奥秘' },
          { cmd: '/tp 76 43 -38 20187', desc: '魔术工坊' },
          { cmd: '/tp 1 -5 6 20199', desc: '鲸鱼周本' },
          { cmd: '/tp 130 21 265 20212', desc: '厄舍的服装工厂' },
          { cmd: '/tp 121 528 843 20214', desc: '仆人周本' },
        ],
      },
      {
        id: 'version50to58Section',
        label: '秘境（5.0~5.8）',
        items: [
          { cmd: '/tp 425 260 583 20228', desc: '「秘源遗迹」' },
          { cmd: '/tp 570 28 547 20229', desc: '「夜神空间」' },
          { cmd: '/tp -3091 2 490 20236', desc: '深渊火龙王周本' },
          { cmd: '/tp 759 46 704 20248', desc: '步入「边界」' },
          { cmd: '/tp 374 6 563 20249', desc: '生死交界处' },
        ],
      },
      {
        id: 'version60to68Section',
        label: '秘境（6.0~6.8）',
        items: [
          { cmd: '/tp 732 1388 445 20274', desc: '「虹雨的祭祀庭」楚普卡塔津' },
          { cmd: '/tp 565 120 343 20277', desc: '6.0主线任务' },
          { cmd: '/tp 59 12 48 20281', desc: '6.1主线奈芙尔回忆地城test' },
          { cmd: '/tp 335 289 238 20322', desc: '赝月研究所DoctorBoss01' },
          { cmd: '/tp 478 77 431 20324', desc: '月球 The Moon！' },
        ],
      },
    ],
  },
  {
    id: 'scene50000Section',
    label: '秘境50000',
    items: [{ cmd: '', desc: '暂无相关指令，敬请期待' }],
  },
];

export function renderScenes() {
  const frag = document.createDocumentFragment();
  frag.appendChild(createSectionTitle('所有场景/秘境ID'));

  // 第一级导航
  const mainNav = document.createElement('div');
  mainNav.className = 'sub-nav-bar';
  mainNav.id = 'sceneMainNav';

  sceneGroups.forEach((group, i) => {
    const btn = document.createElement('button');
    btn.className = `sub-nav-btn${i === 0 ? ' active' : ''}`;
    btn.textContent = group.label;
    btn.dataset.target = group.id;
    btn.addEventListener('click', () => switchSceneGroup(group.id));
    mainNav.appendChild(btn);
  });
  frag.appendChild(mainNav);

  // 各场景组内容
  sceneGroups.forEach((group, i) => {
    const section = document.createElement('div');
    section.id = group.id;
    section.className = 'scene-sub-section';
    section.style.display = i === 0 ? 'block' : 'none';

    if (group.items) {
      group.items.forEach(item => {
        if (item.cmd) {
          section.appendChild(createCmdCard(item.cmd, `（${item.desc}）`));
        } else {
          const card = document.createElement('div');
          card.className = 'cmd-card';
          card.innerHTML = `<div class="cmd-desc">${item.desc}</div>`;
          section.appendChild(card);
        }
      });
    }

    if (group.versions) {
      // 第二级导航
      const versionNav = document.createElement('div');
      versionNav.className = 'sub-nav-bar';

      group.versions.forEach((ver, j) => {
        const btn = document.createElement('button');
        btn.className = `sub-nav-btn${j === 0 ? ' active' : ''}`;
        btn.textContent = ver.label;
        btn.dataset.target = ver.id;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          section.querySelectorAll('.version-sub-section').forEach(s => s.style.display = 'none');
          const target = document.getElementById(ver.id);
          if (target) target.style.display = 'block';
          versionNav.querySelectorAll('.sub-nav-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
        versionNav.appendChild(btn);
      });
      section.appendChild(versionNav);

      group.versions.forEach((ver, j) => {
        const verSection = document.createElement('div');
        verSection.id = ver.id;
        verSection.className = 'version-sub-section';
        verSection.style.display = j === 0 ? 'block' : 'none';

        const title = document.createElement('div');
        title.className = 'boss-title';
        title.textContent = ver.label;
        verSection.appendChild(title);

        ver.items.forEach(item => {
          verSection.appendChild(createCmdCard(item.cmd, `（${item.desc}）`));
        });

        section.appendChild(verSection);
      });
    }

    frag.appendChild(section);
  });

  return frag;
}

function switchSceneGroup(groupId) {
  document.querySelectorAll('.scene-sub-section').forEach(s => s.style.display = 'none');
  const target = document.getElementById(groupId);
  if (target) target.style.display = 'block';

  document.querySelectorAll('#sceneMainNav .sub-nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === groupId);
  });
}
