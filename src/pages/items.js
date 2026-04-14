import items from '../data/items.json';
import { createSectionTitle, el } from '../utils/render.js';
import { copyText } from '../utils/copy.js';

const PAGE_SIZE = 80;
const categories = Object.keys(items);

let currentCategory = categories[0];
let currentPage = 0;
let filteredList = items[currentCategory] || [];

function switchCategory(cat) {
  currentCategory = cat;
  filteredList = [...(items[cat] || [])];
  currentPage = 0;
  renderPage();
}

function renderPage() {
  const container = document.getElementById('itemsContainer');
  if (!container) return;
  container.innerHTML = '';

  const start = currentPage * PAGE_SIZE;
  const pageItems = filteredList.slice(start, start + PAGE_SIZE);

  const grid = el('div', { className: 'info-grid items-grid' });
  pageItems.forEach(item => {
    const chip = el('div', { className: 'info-chip item-chip' });
    chip.appendChild(el('div', { className: 'info-chip__id', textContent: String(item.id) }));
    chip.appendChild(el('div', { className: 'info-chip__name', textContent: item.name }));
    const cmd = `/give ${item.id}`;
    chip.addEventListener('click', () => {
      copyText(cmd);
    });
    chip.title = `点击复制: ${cmd}`;
    chip.style.cursor = 'pointer';
    grid.appendChild(chip);
  });
  container.appendChild(grid);

  const totalPages = Math.ceil(filteredList.length / PAGE_SIZE);
  const pageInfo = document.getElementById('itemsPageInfo');
  if (pageInfo) {
    pageInfo.textContent = `${start + 1}-${Math.min(start + PAGE_SIZE, filteredList.length)} / ${filteredList.length} 条 (类别: ${currentCategory})`;
  }
  const prevBtn = document.getElementById('itemsPrev');
  const nextBtn = document.getElementById('itemsNext');
  if (prevBtn) prevBtn.disabled = currentPage === 0;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages - 1;
}

export function renderItems() {
  const frag = document.createDocumentFragment();
  frag.appendChild(createSectionTitle('物品数据库'));

  const catNav = el('div', { className: 'tab-nav items-cat-nav', id: 'itemsCatNav' });
  categories.forEach(cat => {
    const count = (items[cat] || []).length;
    const btn = el('button', {
      className: `btn btn--sm${cat === currentCategory ? ' active' : ''}`,
      textContent: `${cat} (${count})`,
onClick() {
        catNav.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        switchCategory(cat);
      },
    });
    nav.appendChild(btn);
  });
  frag.appendChild(catNav);

  const statRow = el('div', { className: 'items-stat-row' });
  statRow.appendChild(el('span', { textContent: `共 ${Object.values(items).reduce((s, a) => s + a.length, 0)} 个物品，${categories.length} 个类别` }));
  frag.appendChild(statRow);

  const searchInput = el('input', {
    type: 'text',
    className: 'search-input',
    placeholder: '搜索物品名称或ID...',
    style: { width: '100%', marginBottom: '12px' },
  });
  frag.appendChild(searchInput);

  const container = el('div', { id: 'itemsContainer' });
  frag.appendChild(container);

  const pagerRow = el('div', { className: 'achievement-pager' });
  const prevBtn = el('button', { className: 'btn btn--sm', id: 'itemsPrev', textContent: '← 上一页', onClick() { currentPage--; renderPage(); } });
  const pageInfo = el('span', { className: 'achievement-page-info', id: 'itemsPageInfo' });
  const nextBtn = el('button', { className: 'btn btn--sm', id: 'itemsNext', textContent: '下一页 →', onClick() { currentPage++; renderPage(); } });
  pagerRow.appendChild(prevBtn);
  pagerRow.appendChild(pageInfo);
  pagerRow.appendChild(nextBtn);
  frag.appendChild(pagerRow);

  const note = el('div', { className: 'artifact-note', textContent: '提示：点击物品可复制 /give 指令' });
  frag.appendChild(note);

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
      filteredList = [...(items[currentCategory] || [])];
    } else {
      const allItems = Object.values(items).flat();
      filteredList = allItems.filter(item =>
        item.name.toLowerCase().includes(q) || String(item.id).includes(q)
      );
    }
    currentPage = 0;
    renderPage();
  });

  setTimeout(renderPage, 0);

  return frag;
}