import weaponsData from '../data/weapons.json';
import { createCmdCard, createSectionTitle } from '../utils/render.js';

const starLabels = {
  '1star': '⭐️',
  '2star': '⭐️⭐️',
  '3star': '⭐️⭐️⭐️',
  '4star': '⭐️⭐️⭐️⭐️',
  '5star': '⭐️⭐️⭐️⭐️⭐️',
};

export function renderWeapons() {
  const frag = document.createDocumentFragment();
  frag.appendChild(createSectionTitle('武器数据库'));

  const types = weaponsData.types;

  // 第一级导航：武器类型
  const typeNav = document.createElement('div');
  typeNav.className = 'sub-nav-bar';
  typeNav.id = 'weaponTypeNav';

  types.forEach((type, i) => {
    const btn = document.createElement('button');
    btn.className = `sub-nav-btn${i === 0 ? ' active' : ''}`;
    btn.textContent = type.label;
    btn.dataset.type = type.id;
    btn.addEventListener('click', () => switchWeaponType(type.id));
    typeNav.appendChild(btn);
  });
  frag.appendChild(typeNav);

  // 各类型内容区块
  types.forEach((type, i) => {
    const container = document.createElement('div');
    container.id = `${type.id}Section`;
    container.className = 'weapon-type-section';
    container.style.display = i === 0 ? 'block' : 'none';

    const starNav = document.createElement('div');
    starNav.className = 'sub-nav-bar';

    const starKeys = ['1star', '2star', '3star', '4star', '5star'];
    starKeys.forEach((star, j) => {
      const weapons = weaponsData[type.id]?.[star];
      if (!weapons || weapons.length === 0) return;

      const btn = document.createElement('button');
      btn.className = `sub-nav-btn${j === 0 ? ' active' : ''}`;
      btn.textContent = starLabels[star];
      btn.dataset.star = star;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        switchWeaponStar(container, star);
      });
      starNav.appendChild(btn);
    });
    container.appendChild(starNav);

    // 各星级内容
    starKeys.forEach((star, j) => {
      const weapons = weaponsData[type.id]?.[star];
      if (!weapons) return;

      const starSection = document.createElement('div');
      starSection.id = `${type.id}${star}`;
      starSection.className = 'weapon-star-section';
      starSection.style.display = j === 0 ? 'block' : 'none';

      weapons.forEach(w => {
        starSection.appendChild(createCmdCard(`/give ${w.id} x1 lv90 r5`, `（${w.name}）`));
      });

      container.appendChild(starSection);
    });

    frag.appendChild(container);
  });

  return frag;
}

function switchWeaponType(typeId) {
  document.querySelectorAll('.weapon-type-section').forEach(s => s.style.display = 'none');
  const target = document.getElementById(`${typeId}Section`);
  if (target) target.style.display = 'block';

  document.querySelectorAll('#weaponTypeNav .sub-nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === typeId);
  });
}

function switchWeaponStar(container, star) {
  container.querySelectorAll('.weapon-star-section').forEach(s => s.style.display = 'none');
  const target = container.querySelector(`#${container.id.replace('Section', '')}${star}`);
  if (target) target.style.display = 'block';

  container.querySelectorAll('.sub-nav-bar .sub-nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.star === star);
  });
}
