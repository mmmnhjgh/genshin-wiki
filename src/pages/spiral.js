import { createSectionTitle, el } from '../utils/render.js';

export function renderSpiral() {
  const frag = document.createDocumentFragment();
  frag.appendChild(createSectionTitle('深境螺旋'));

  // Buff info
  const buffCard = el('div', { className: 'cmd-card' });
  buffCard.style.flexDirection = 'column';
  buffCard.style.alignItems = 'stretch';
  buffCard.appendChild(el('div', { style: { fontWeight: 600, marginBottom: '8px' }, textContent: '[6.5]' }));
  buffCard.appendChild(el('div', {
    style: { fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.8' },
    innerHTML: '<strong>关卡效果</strong><br>第12层 Buff 1：怪物血量提升275%。<br>上半：月结晶伤害提升75%。<br>下半：当前场上角色普通攻击与重击造成的伤害提升75%。',
  }));
  frag.appendChild(buffCard);

  // Split layout
  const split = el('div', { className: 'split-2col' });

  // Upper half
  const upper = el('div');
  upper.appendChild(el('div', {
    style: { fontWeight: 600, color: 'var(--danger)', marginBottom: '12px', fontSize: '1rem' },
    textContent: '上半',
  }));

  const upperFloors = [
    { floor: '第12层-1', enemies: '魔像禁卫<br>Lv.95<br>HP <span class="hp-red">681,430</span>' },
    { floor: '第12层-2', enemies: '荒野狂狩士<br>Lv.98<br>HP <span class="hp-red">2,008,523</span>' },
    { floor: '第12层-3', enemies: '蕴光月守宫<br>Lv.100<br>HP <span class="hp-red">4,367,476</span>' },
  ];

  upperFloors.forEach(f => {
    const card = el('div', { className: 'cmd-card' });
    card.style.flexDirection = 'column';
    card.style.alignItems = 'stretch';
    card.appendChild(el('div', { style: { fontWeight: 600, marginBottom: '6px' }, textContent: `${f.floor} · 上半` }));
    card.appendChild(el('div', {
      style: { fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' },
      textContent: '敌人波次 #1',
    }));
    card.appendChild(el('div', {
      style: { fontSize: '0.85rem', color: 'var(--text-secondary)' },
      innerHTML: `- ${f.enemies}`,
    }));
    upper.appendChild(card);
  });
  split.appendChild(upper);

  // Lower half
  const lower = el('div');
  lower.appendChild(el('div', {
    style: { fontWeight: 600, color: 'var(--accent)', marginBottom: '12px', fontSize: '1rem' },
    textContent: '下半',
  }));

  const lowerFloors = [
    {
      floor: '第12层-1',
      enemies: '深邃拟态 · 峭锋…<br>Lv.95<br>HP <span class="hp-red">579,215</span><br>深邃拟态 · 丘丘…<br>Lv.95<br>HP <span class="hp-red">749,573</span><br>深邃拟态 · 秘源…<br>Lv.95<br>HP <span class="hp-red">817,716</span>',
    },
    {
      floor: '第12层-2',
      enemies: '镀金旅团 · 叶轮…<br>Lv.98<br>HP <span class="hp-red">965,636</span><br>魔偶剑鬼<br>Lv.98<br>HP <span class="hp-red">2,299,367</span>',
    },
    { floor: '第12层-3', enemies: '深邃摹结株 · II型<br>Lv.100<br>HP <span class="hp-red">3,327,601</span>' },
  ];

  lowerFloors.forEach(f => {
    const card = el('div', { className: 'cmd-card' });
    card.style.flexDirection = 'column';
    card.style.alignItems = 'stretch';
    card.appendChild(el('div', { style: { fontWeight: 600, marginBottom: '6px' }, textContent: `${f.floor} · 下半` }));
    card.appendChild(el('div', {
      style: { fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' },
      textContent: '敌人波次 #1',
    }));
    card.appendChild(el('div', {
      style: { fontSize: '0.85rem', color: 'var(--text-secondary)' },
      innerHTML: `- ${f.enemies}`,
    }));
    lower.appendChild(card);
  });
  split.appendChild(lower);

  frag.appendChild(split);
  return frag;
}
