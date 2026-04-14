import activities from '../data/activities.json';
import { createSectionTitle, el } from '../utils/render.js';

function extractVersion(name, fallback) {
  const m = name.match(/^(\d+\.\d+)/);
  return m ? m[1] : fallback || '';
}

function getVersions() {
  const versions = new Set();
  activities.forEach(a => {
    const v = extractVersion(a.name, a.version);
    if (v) versions.add(v);
  });
  return [...versions].sort((a, b) => {
    const [amaj, amin] = a.split('.').map(Number);
    const [bmaj, bmin] = b.split('.').map(Number);
    return bmaj - amaj || bmin - amin;
  });
}

const versionList = getVersions();
let currentVersion = 'all';

function filterActivities() {
  if (currentVersion === 'all') return [...activities];
  return activities.filter(a => {
    const v = extractVersion(a.name, a.version);
    return v === currentVersion;
  });
}

export function renderActivities() {
  const frag = document.createDocumentFragment();
  frag.appendChild(createSectionTitle('活动数据库'));

  const nav = el('div', { className: 'tab-nav activity-ver-nav', id: 'activityNav' });

  const allBtn = el('button', {
    className: 'btn btn--sm active',
    textContent: '全部',
    onClick() {
      currentVersion = 'all';
      nav.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
      allBtn.classList.add('active');
      renderList();
    },
  });
  nav.appendChild(allBtn);

  versionList.forEach(v => {
    const btn = el('button', {
      className: 'btn btn--sm',
      textContent: `${v}`,
      onClick() {
        currentVersion = v;
        nav.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderList();
      },
    });
    nav.appendChild(btn);
  });
  frag.appendChild(nav);

  const searchInput = el('input', {
    type: 'text',
    className: 'search-input',
    placeholder: '搜索活动名称或ID...',
    style: { width: '100%', marginBottom: '12px' },
  });
  frag.appendChild(searchInput);

  const container = el('div', { id: 'activityContainer' });
  frag.appendChild(container);

  const countInfo = el('div', { className: 'artifact-note', id: 'activityCount' });
  frag.appendChild(countInfo);

  function renderList() {
    container.innerHTML = '';
    const list = filterActivities();
    countInfo.textContent = `共 ${list.length} 个活动`;

    const grid = el('div', { className: 'info-grid' });
    list.forEach(a => {
      const v = extractVersion(a.name, a.version);
      const chip = el('div', { className: 'info-chip' });
      chip.appendChild(el('div', { className: 'info-chip__id', textContent: String(a.id) }));
      chip.appendChild(el('div', { className: 'info-chip__name', textContent: a.name }));
      if (v) {
        chip.appendChild(el('div', { className: 'info-chip__name', textContent: `v${v}`, style: { fontSize: '0.65rem', color: 'var(--accent)' } }));
      }
      grid.appendChild(chip);
    });
    container.appendChild(grid);
  }

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    currentVersion = 'all';
    nav.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
    allBtn.classList.add('active');
    container.innerHTML = '';
    const list = q
      ? activities.filter(a => a.name.toLowerCase().includes(q) || String(a.id).includes(q))
      : [...activities];
    countInfo.textContent = `共 ${list.length} 个活动`;
    const grid = el('div', { className: 'info-grid' });
    list.forEach(a => {
      const v = extractVersion(a.name, a.version);
      const chip = el('div', { className: 'info-chip' });
      chip.appendChild(el('div', { className: 'info-chip__id', textContent: String(a.id) }));
      chip.appendChild(el('div', { className: 'info-chip__name', textContent: a.name }));
      if (v) {
        chip.appendChild(el('div', { className: 'info-chip__name', textContent: `v${v}`, style: { fontSize: '0.65rem', color: 'var(--accent)' } }));
      }
      grid.appendChild(chip);
    });
    container.appendChild(grid);
  });

  renderList();
  return frag;
}