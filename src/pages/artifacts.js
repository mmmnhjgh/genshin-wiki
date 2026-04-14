import artifactsData from '../data/artifacts.json';
import { createCmdCard, createSectionTitle, createSubTitle, el } from '../utils/render.js';

export function renderArtifacts() {
  const frag = document.createDocumentFragment();
  frag.appendChild(createSectionTitle('圣遗物数据库'));

  // Tab navigation
  const nav = el('div', { className: 'tab-nav', id: 'artifactNav' });
  const tabs = [
    { id: 'artifactSetsSection', label: '圣遗物套装' },
    { id: 'artifactGuideSection', label: '配置教程' },
  ];
  tabs.forEach((tab, i) => {
    const btn = el('button', {
      className: `btn${i === 0 ? ' active' : ''}`,
      textContent: tab.label,
      onClick() {
        frag.querySelectorAll('.artifact-sub').forEach(s => { s.style.display = 'none'; });
        const target = document.getElementById(tab.id);
        if (target) target.style.display = 'block';
        nav.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      },
    });
    nav.appendChild(btn);
  });
  frag.appendChild(nav);

  // Artifact sets
  const setsSection = el('div', { id: 'artifactSetsSection', className: 'artifact-sub' });
  setsSection.appendChild(createSubTitle('圣遗物套装列表'));

  const grid = el('div', { className: 'info-grid' });
  artifactsData.sets.forEach(set => {
    const chip = el('div', { className: 'info-chip' },
      el('div', { className: 'info-chip__id', textContent: String(set.id) }),
      el('div', { className: 'info-chip__name', textContent: set.name })
    );
    grid.appendChild(chip);
  });
  setsSection.appendChild(grid);
  frag.appendChild(setsSection);

  // Configuration guide
  const guideSection = el('div', {
    id: 'artifactGuideSection',
    className: 'artifact-sub',
    style: { display: 'none' },
  });

  guideSection.appendChild(createSubTitle('圣遗物配置教程'));

  // Template card
  const templateCard = el('div', { className: 'cmd-card' });
  templateCard.style.flexDirection = 'column';
  templateCard.style.alignItems = 'stretch';
  templateCard.style.background = 'rgba(0,136,255,0.04)';
  templateCard.appendChild(el('div', { className: 'cmd-card__code', textContent: '/give +圣遗物ID lv+等级 +主词条 +副词条,+强化次数 x数量' }));
  templateCard.appendChild(el('div', { className: 'cmd-card__desc', textContent: '【圣遗物指令通用模板】' }));
  guideSection.appendChild(templateCard);

  // Main stats
  guideSection.appendChild(createSubTitle('常用主词条ID'));
  const mainGrid = el('div', { className: 'info-grid' });
  artifactsData.mainStats.forEach(s => {
    const chip = el('div', { className: 'info-chip' },
      el('div', { className: 'info-chip__id', textContent: s.id }),
      el('div', { className: 'info-chip__name', textContent: s.name })
    );
    mainGrid.appendChild(chip);
  });
  guideSection.appendChild(mainGrid);

  // Sub stats
  guideSection.appendChild(createSubTitle('常用副词条ID'));
  const subGrid = el('div', { className: 'info-grid' });
  artifactsData.subStats.forEach(s => {
    const chip = el('div', { className: 'info-chip' },
      el('div', { className: 'info-chip__id', textContent: s.id }),
      el('div', { className: 'info-chip__name', textContent: s.name })
    );
    subGrid.appendChild(chip);
  });
  guideSection.appendChild(subGrid);

  frag.appendChild(guideSection);

  return frag;
}
