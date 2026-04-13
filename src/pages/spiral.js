import { createSectionTitle } from '../utils/render.js';

export function renderSpiral() {
  const frag = document.createDocumentFragment();
  frag.appendChild(createSectionTitle('深境螺旋'));

  const buffCard = document.createElement('div');
  buffCard.className = 'cmd-card';
  buffCard.innerHTML = `
    <div class="boss-title">[6.5]</div>
    <div class="cmd-desc">
      <strong>关卡效果</strong><br>
      第12层 Buff 1：怪物血量提升275%。<br>
      上半：月结晶伤害提升75%。<br>
      下半：当前场上角色普通攻击与重击造成的伤害提升75%。
    </div>
  `;
  frag.appendChild(buffCard);

  const split = document.createElement('div');
  split.className = 'spiral-split';

  // 上半
  const upper = document.createElement('div');
  upper.className = 'spiral-half';
  const upperTitle = document.createElement('div');
  upperTitle.className = 'boss-title';
  upperTitle.style.color = '#ff7e45';
  upperTitle.textContent = '上半';
  upper.appendChild(upperTitle);

  const upperFloors = [
    { floor: '第12层-1', enemies: '魔像禁卫<br>Lv.95<br>HP <span class="hp-red">681,430</span>' },
    { floor: '第12层-2', enemies: '荒野狂狩士<br>Lv.98<br>HP <span class="hp-red">2,008,523</span>' },
    { floor: '第12层-3', enemies: '蕴光月守宫<br>Lv.100<br>HP <span class="hp-red">4,367,476</span>' },
  ];

  upperFloors.forEach(f => {
    const card = document.createElement('div');
    card.className = 'cmd-card';
    card.innerHTML = `
      <div class="boss-title">${f.floor} · 上半</div>
      <div class="cmd-desc"><strong>敌人波次 #1</strong></div>
      <div class="cmd-desc">- ${f.enemies}</div>
    `;
    upper.appendChild(card);
  });
  split.appendChild(upper);

  // 下半
  const lower = document.createElement('div');
  lower.className = 'spiral-half';
  const lowerTitle = document.createElement('div');
  lowerTitle.className = 'boss-title';
  lowerTitle.style.color = '#7fb3ff';
  lowerTitle.textContent = '下半';
  lower.appendChild(lowerTitle);

  const lowerFloors = [
    {
      floor: '第12层-1',
      enemies: `深邃拟态 · 峭锋…<br>Lv.95<br>HP <span class="hp-red">579,215</span><br>
        深邃拟态 · 丘丘…<br>Lv.95<br>HP <span class="hp-red">749,573</span><br>
        深邃拟态 · 秘源…<br>Lv.95<br>HP <span class="hp-red">817,716</span>`,
    },
    {
      floor: '第12层-2',
      enemies: `镀金旅团 · 叶轮…<br>Lv.98<br>HP <span class="hp-red">965,636</span><br>
        魔偶剑鬼<br>Lv.98<br>HP <span class="hp-red">2,299,367</span>`,
    },
    { floor: '第12层-3', enemies: '深邃摹结株 · II型<br>Lv.100<br>HP <span class="hp-red">3,327,601</span>' },
  ];

  lowerFloors.forEach(f => {
    const card = document.createElement('div');
    card.className = 'cmd-card';
    card.innerHTML = `
      <div class="boss-title">${f.floor} · 下半</div>
      <div class="cmd-desc"><strong>敌人波次 #1</strong></div>
      <div class="cmd-desc">- ${f.enemies}</div>
    `;
    lower.appendChild(card);
  });
  split.appendChild(lower);

  frag.appendChild(split);
  return frag;
}
