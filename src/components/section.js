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
  homeSection: renderHome,
  commonCommandsSection: renderCommonCommands,
  charSection: renderCharacters,
  weaponSection: renderWeapons,
  artifactSection: renderArtifacts,
  bossSection: renderBosses,
  sceneSection: renderScenes,
  dreamSection: renderMonsters,
  spiralSection: renderSpiral,
  questNewSection: renderGacha,
};

export function renderAllSections() {
  const sections = [];

  for (const [id, renderer] of Object.entries(pageRenderers)) {
    const section = document.createElement('section');
    section.id = id;
    section.className = 'content-section';
    section.style.display = id === 'homeSection' ? 'block' : 'none';

    const content = renderer();
    if (Array.isArray(content)) {
      content.forEach(c => section.appendChild(c));
    } else {
      section.appendChild(content);
    }

    sections.push(section);
  }

  // 占位区块（尚未迁移的模块）
  const placeholderSections = [
    'itemSection', 'questSection', 'achievementSection',
    'geographySection', 'tutorialSection', 'eventSection', 'loadTipSection',
  ];

  placeholderSections.forEach(id => {
    const section = document.createElement('section');
    section.id = id;
    section.className = 'content-section';
    section.style.display = 'none';

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = id.replace('Section', '');
    section.appendChild(title);

    const card = document.createElement('div');
    card.className = 'cmd-card';
    card.innerHTML = '<div class="cmd-desc">模块开发中，敬请期待...</div>';
    section.appendChild(card);

    sections.push(section);
  });

  return sections;
}
