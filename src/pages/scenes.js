import scenes from '../data/scenes.json';
import { createSectionTitle, el } from '../utils/render.js';
import { copyText } from '../utils/copy.js';

const CATEGORY_LABELS = {
  'BigWorld探索': '大世界',
  '尘歌壶': '尘歌壶',
  '主世界': '主世界',
  '剧情秘境': '剧情秘境',
  '深境螺旋': '深境螺旋',
  '教程': '教程副本',
  '其他': '其他',
};

export function renderScenes() {
  const frag = document.createDocumentFragment();
  frag.appendChild(createSectionTitle('场景/秘境ID'));

  const cats = [...new Set(scenes.map(s => s.category))];
  const catLabels = cats.map(c => ({ id: c, label: CATEGORY_LABELS[c] || c }));

  const nav = el('div', { className: 'tab-nav', id: 'sceneCatNav' });
  const allBtn = el('button', {
    className: 'btn active',
    textContent: '全部',
    dataset: { cat: 'all' },
    onClick() { switchCat('all'); },
  });
  nav.appendChild(allBtn);

  catLabels.forEach(c => {
    const count = scenes.filter(s => s.category === c.id).length;
    const btn = el('button', {
      className: 'btn',
      textContent: `${c.label} (${count})`,
      dataset: { cat: c.id },
      onClick() { switchCat(c.id); },
    });
    nav.appendChild(btn);
  });
  frag.appendChild(nav);

  const searchInput = el('input', {
    type: 'text',
    className: 'search-input',
    placeholder: '搜索场景名称或ID...',
    style: { width: '100%', marginBottom: '12px' },
  });
  frag.appendChild(searchInput);

  const container = el('div', { id: 'sceneContainer' });
  frag.appendChild(container);

  const countInfo = el('div', { className: 'artifact-note', id: 'sceneCount' });
  frag.appendChild(countInfo);

  // 结果提示
  const tip = el('div', { className: 'artifact-note', textContent: '提示：点击场景卡片即可复制传送指令' });
  frag.appendChild(tip);

  function renderList(filter) {
    container.innerHTML = '';
    const list = filter
      ? scenes.filter(s => s.name.toLowerCase().includes(filter) || String(s.id).includes(filter))
      : scenes;
    countInfo.textContent = `共 ${list.length} 个场景`;

    // 按类别分组
    const grouped = {};
    list.forEach(s => {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s);
    });

    for (const [cat, items] of Object.entries(grouped)) {
      const subtitle = el('div', { className: 'sub-title', textContent: CATEGORY_LABELS[cat] || cat });
      container.appendChild(subtitle);

      const grid = el('div', { className: 'info-grid' });
      items.forEach(s => {
        const cmd = s.cmd || `/tp 0 400 0 ${s.id}`;
        const chip = el('div', { className: 'info-chip info-chip--copy', title: `点击复制: ${cmd}` });
        chip.appendChild(el('div', { className: 'info-chip__id', textContent: String(s.id) }));
        chip.appendChild(el('div', { className: 'info-chip__name', textContent: s.name }));
        chip.addEventListener('click', () => copyText(cmd));
        grid.appendChild(chip);
      });
      container.appendChild(grid);
    }
  }

  function switchCat(cat) {
    nav.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
    nav.querySelectorAll('.btn').forEach(b => {
      if ((cat === 'all' && b.dataset.cat === 'all') || b.dataset.cat === cat) b.classList.add('active');
    });
    searchInput.value = '';
    if (cat === 'all') {
      renderList('');
    } else {
      container.innerHTML = '';
      const filtered = scenes.filter(s => s.category === cat);
      countInfo.textContent = `共 ${filtered.length} 个场景`;
      const subtitle = el('div', { className: 'sub-title', textContent: CATEGORY_LABELS[cat] || cat });
      container.appendChild(subtitle);
      const grid = el('div', { className: 'info-grid' });
      filtered.forEach(s => {
        const cmd = s.cmd || `/tp 0 400 0 ${s.id}`;
        const chip = el('div', { className: 'info-chip info-chip--copy', title: `点击复制: ${cmd}` });
        chip.appendChild(el('div', { className: 'info-chip__id', textContent: String(s.id) }));
        chip.appendChild(el('div', { className: 'info-chip__name', textContent: s.name }));
        chip.addEventListener('click', () => copyText(cmd));
        grid.appendChild(chip);
      });
      container.appendChild(grid);
    }
  }

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    renderList(q);
  });

  renderList('');
  return frag;
}