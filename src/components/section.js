import { renderHome } from '../pages/home.js';
import { renderCommonCommands } from '../pages/commonCommands.js';
import { renderCharacters } from '../pages/characters.js';
import { renderWeapons } from '../pages/weapons.js';
import { renderArtifacts } from '../pages/artifacts.js';
import { renderBosses } from '../pages/bosses.js';
import { renderScenes } from '../pages/scenes.js';
import { renderMonsters } from '../pages/monsters.js';
import { renderSpiral } from '../pages/spiral.js';
import { renderGacha } from '../pages/gacha.js';

const pageRenderers = {
  homeSection: { title: '首页', render: renderHome },
  commonCommandsSection: { title: '常用指令', render: renderCommonCommands },
  charSection: { title: '角色数据库', render: renderCharacters },
  weaponSection: { title: '武器数据库', render: renderWeapons },
  artifactSection: { title: '圣遗物数据库', render: renderArtifacts },
  bossSection: { title: '值得铭记的强敌', render: renderBosses },
  sceneSection: { title: '所有场景/秘境ID', render: renderScenes },
  dreamSection: { title: '自定义怪物属性', render: renderMonsters },
  spiralSection: { title: '深境螺旋', render: renderSpiral },
  questNewSection: { title: '祈愿卡池', render: renderGacha },
};

export function renderAllSections() {
  const sections = [];

  for (const [id, { title, render }] of Object.entries(pageRenderers)) {
    const section = document.createElement('section');
    section.id = id;
    section.className = 'content-section';
    section.style.display = id === 'homeSection' ? 'block' : 'none';

    const wrapper = document.createElement('div');
    wrapper.className = 'section-wrapper';

    // 同步渲染内容
    try {
      const content = render();
      if (Array.isArray(content)) {
        content.forEach(c => wrapper.appendChild(c));
      } else if (content instanceof Node) {
        wrapper.appendChild(content);
      }
    } catch (e) {
      console.error(`Error rendering ${id}:`, e);
      const errCard = document.createElement('div');
      errCard.className = 'cmd-card';
      errCard.textContent = `加载失败: ${e.message}`;
      wrapper.appendChild(errCard);
    }

    section.appendChild(wrapper);
    sections.push(section);
  }

  // 占位区块
  const placeholders = [
    'itemSection', 'questSection', 'achievementSection',
    'geographySection', 'tutorialSection', 'eventSection', 'loadTipSection',
  ];

  placeholders.forEach(id => {
    const section = document.createElement('section');
    section.id = id;
    section.className = 'content-section';
    section.style.display = 'none';

    const wrapper = document.createElement('div');
    wrapper.className = 'section-wrapper';

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = id.replace('Section', '');
    wrapper.appendChild(title);

    const card = document.createElement('div');
    card.className = 'cmd-card';
    card.innerHTML = '<div class="cmd-card__desc">模块开发中，敬请期待...</div>';
    wrapper.appendChild(card);

    section.appendChild(wrapper);
    sections.push(section);
  });

  return sections;
}
