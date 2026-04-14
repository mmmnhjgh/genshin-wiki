import { renderHome } from '../pages/home.js';
import { renderCommonCommands } from '../pages/commonCommands.js';
import { renderCharacters } from '../pages/characters.js';
import { renderWeapons } from '../pages/weapons.js';
import { renderArtifacts } from '../pages/artifacts.js';
import { renderBosses } from '../pages/bosses.js';
import { renderScenes } from '../pages/scenes.js';
import { renderMonsters } from '../pages/monsters.js';
import { renderItems } from '../pages/items.js';
import { renderAchievements } from '../pages/achievements.js';
import { renderActivities } from '../pages/activities.js';
import { renderSpiral } from '../pages/spiral.js';
import { renderGacha } from '../pages/gacha.js';

const pageRenderers = {
  homeSection: { title: '首页', render: renderHome },
  commonCommandsSection: { title: '常用指令', render: renderCommonCommands },
  charSection: { title: '角色数据库', render: renderCharacters },
  weaponSection: { title: '武器数据库', render: renderWeapons },
  artifactSection: { title: '圣遗物数据库', render: renderArtifacts },
  bossSection: { title: '值得铭记的强敌', render: renderBosses },
  sceneSection: { title: '场景/秘境ID', render: renderScenes },
  dreamSection: { title: '自定义怪物属性', render: renderMonsters },
  itemSection: { title: '物品数据库', render: renderItems },
  achievementSection: { title: '成就数据库', render: renderAchievements },
  activitySection: { title: '活动数据库', render: renderActivities },
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

  return sections;
}
