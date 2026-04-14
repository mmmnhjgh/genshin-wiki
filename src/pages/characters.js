import characters from '../data/characters.json';
import { createCmdCard, createSectionTitle, el } from '../utils/render.js';

export function renderCharacters() {
  const frag = document.createDocumentFragment();
  frag.appendChild(createSectionTitle('角色数据库'));

  characters.forEach(c => {
    const starClass = c.star === 5 ? 'star-5' : 'star-4';
    const descText = `（${c.name}）`;
    const card = createCmdCard(c.cmd, descText);

    // 替换描述中的名字为带颜色的版本
    const descDiv = card.querySelector('.cmd-card__desc');
    if (descDiv) {
      descDiv.textContent = '';
      descDiv.appendChild(document.createTextNode('（'));
      descDiv.appendChild(el('span', { className: starClass, textContent: c.name }));
      descDiv.appendChild(document.createTextNode('）'));
    }

    frag.appendChild(card);
  });

  return frag;
}
