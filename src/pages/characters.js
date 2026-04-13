import characters from '../data/characters.json';
import { createCmdCard, createSectionTitle } from '../utils/render.js';

export function renderCharacters() {
  const frag = document.createDocumentFragment();
  frag.appendChild(createSectionTitle('角色数据库'));

  characters.forEach(c => {
    const card = createCmdCard(c.cmd, `（${c.name}）`);

    // 五星/四星名着色
    const descEl = card.querySelector('.cmd-desc');
    if (descEl) {
      const span = document.createElement('span');
      span.className = c.star === 5 ? 'five-star' : 'four-star';
      span.textContent = c.name;
      descEl.textContent = '';
      descEl.appendChild(document.createTextNode('（'));
      descEl.appendChild(span);
      descEl.appendChild(document.createTextNode('）'));
    }

    frag.appendChild(card);
  });

  return frag;
}
