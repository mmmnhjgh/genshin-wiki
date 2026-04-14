import characters from '../data/characters.json';
import { createCmdCard, createSectionTitle, el } from '../utils/render.js';

export function renderCharacters() {
  const frag = document.createDocumentFragment();
  frag.appendChild(createSectionTitle('角色数据库'));

  characters.forEach(c => {
    const starClass = c.star === 5 ? 'star-5' : 'star-4';
    const descEl = el('span', null,
      '（',
      el('span', { className: starClass, textContent: c.name }),
      '）'
    );
    const card = createCmdCard(c.cmd);
    const descDiv = card.querySelector('.cmd-card__desc');
    if (descDiv) {
      descDiv.textContent = '';
      descDiv.appendChild(descEl);
    }
    frag.appendChild(card);
  });

  return frag;
}
