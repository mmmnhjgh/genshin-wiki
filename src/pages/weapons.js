import weaponsData from '../data/weapons.json';
import { createCmdCard, createSectionTitle, el } from '../utils/render.js';

const weaponTypes = [
  { id: 'sword', label: '单手剑' },
  { id: 'claymore', label: '双手剑' },
  { id: 'polearm', label: '长柄' },
  { id: 'catalyst', label: '法器' },
  { id: 'bow', label: '弓' },
];

const starLabels = { 1: '⭐', 2: '⭐⭐', 3: '⭐⭐⭐', 4: '⭐⭐⭐⭐', 5: '⭐⭐⭐⭐⭐' };

function groupWeapons() {
  const grouped = {};
  weaponTypes.forEach(t => { grouped[t.id] = {}; for (let s = 1; s <= 5; s++) grouped[t.id][s] = []; });
  weaponsData.forEach(w => {
    if (grouped[w.type] && grouped[w.type][w.star]) {
      grouped[w.type][w.star].push(w);
    }
  });
  return grouped;
}

export function renderWeapons() {
  const frag = document.createDocumentFragment();
  frag.appendChild(createSectionTitle('武器数据库'));

  const grouped = groupWeapons();

  // Weapon type tabs
  const typeNav = el('div', { className: 'tab-nav', id: 'weaponTypeNav' });
  weaponTypes.forEach((type, i) => {
    const btn = el('button', {
      className: `btn${i === 0 ? ' active' : ''}`,
      textContent: type.label,
      onClick() { switchWeaponType(type.id); },
    });
    btn.dataset.type = type.id;
    typeNav.appendChild(btn);
  });
  frag.appendChild(typeNav);

  // Each type section
  weaponTypes.forEach((type, i) => {
    const container = el('div', {
      id: `${type.id}Section`,
      style: { display: i === 0 ? 'block' : 'none' },
    });

    // Star tabs
    const starNav = el('div', { className: 'tab-nav' });
    const availableStars = [5, 4, 3, 2, 1].filter(s => grouped[type.id][s].length > 0);
    availableStars.forEach((star, j) => {
      const btn = el('button', {
        className: `btn btn--sm${j === 0 ? ' active' : ''}`,
        textContent: starLabels[star],
        onClick(e) {
          e.stopPropagation();
          switchWeaponStar(container, star);
        },
      });
      btn.dataset.star = star;
      starNav.appendChild(btn);
    });
    container.appendChild(starNav);

    // Star sections
    availableStars.forEach((star, j) => {
      const starSection = el('div', {
        id: `${type.id}Star${star}`,
        style: { display: j === 0 ? 'block' : 'none' },
      });
      grouped[type.id][star].forEach(w => {
        const card = createCmdCard(w.cmd, `（${w.name}）`);
        // 替换描述为带颜色的版本
        const descDiv = card.querySelector('.cmd-card__desc');
        if (descDiv) {
          descDiv.textContent = '';
          descDiv.appendChild(document.createTextNode('（'));
          descDiv.appendChild(el('span', { className: `star-${w.star}`, textContent: w.name }));
          descDiv.appendChild(document.createTextNode('）'));
        }
        starSection.appendChild(card);
      });
      container.appendChild(starSection);
    });

    frag.appendChild(container);
  });

  return frag;
}

function switchWeaponType(typeId) {
  weaponTypes.forEach(t => {
    const section = document.getElementById(`${t.id}Section`);
    if (section) section.style.display = t.id === typeId ? 'block' : 'none';
  });

  document.querySelectorAll('#weaponTypeNav .btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === typeId);
  });
}

function switchWeaponStar(container, star) {
  const typePrefix = container.id.replace('Section', '');
  container.querySelectorAll(`div[id^="${typePrefix}Star"]`).forEach(s => { s.style.display = 'none'; });
  const target = container.querySelector(`#${typePrefix}Star${star}`);
  if (target) target.style.display = 'block';

  container.querySelectorAll('.tab-nav .btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.star === String(star));
  });
}
