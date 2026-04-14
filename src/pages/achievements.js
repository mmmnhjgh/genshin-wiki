import achievements from '../data/achievements.json';
import { createSectionTitle, el } from '../utils/render.js';
import { copyText } from '../utils/copy.js';

const PAGE_SIZE = 50;
const CATEGORIES = ['全部', '蒙德·璃月', '层岩', '稻妻', '渊下宫', '须弥', '枫丹', '纳塔', '联机', '其他'];

let currentCategory = '全部';
let currentPage = 0;
let filteredList = [...achievements];

function filterAndPaginate() {
  filteredList = currentCategory === '全部'
    ? [...achievements]
    : achievements.filter(a => a.category === currentCategory);
  currentPage = 0;
}

function renderPage() {
  const container = document.getElementById('achievementContainer');
  if (!container) return;
  container.innerHTML = '';

  const start = currentPage * PAGE_SIZE;
  const pageItems = filteredList.slice(start, start + PAGE_SIZE);

  const grid = el('div', { className: 'info-grid achievement-grid' });
  pageItems.forEach(a => {
    const chip = el('div', { className: 'info-chip achievement-chip' });
    chip.appendChild(el('div', { className: 'info-chip__id', textContent: String(a.id) }));
    chip.appendChild(el('div', { className: 'info-chip__name', textContent: a.name }));
    if (a.description) {
      const desc = el('div', { className: 'achievement-desc', textContent: a.description });
      chip.appendChild(desc);
    }
    const cmd = `/achievement grant ${a.id}`;
    const copyBtn = el('button', {
      className: 'btn btn--sm achievement-copy-btn',
      textContent: '复制指令',
      onClick() {
        copyText(cmd);
        copyBtn.textContent = '✓';
        setTimeout(() => { copyBtn.textContent = '复制指令'; }, 800);
      },
    });
    chip.appendChild(copyBtn);
    grid.appendChild(chip);
  });
  container.appendChild(grid);

  const totalPages = Math.ceil(filteredList.length / PAGE_SIZE);
  const pageInfo = document.getElementById('achievementPageInfo');
  if (pageInfo) {
    pageInfo.textContent = `${start + 1}-${Math.min(start + PAGE_SIZE, filteredList.length)} / ${filteredList.length} 条`;
  }

  const prevBtn = document.getElementById('achievementPrev');
  const nextBtn = document.getElementById('achievementNext');
  if (prevBtn) prevBtn.disabled = currentPage === 0;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages - 1;
}

export function renderAchievements() {
  const frag = document.createDocumentFragment();
  frag.appendChild(createSectionTitle('成就数据库'));

  const nav = el('div', { className: 'tab-nav achievement-cat-nav' });
  CATEGORIES.forEach(cat => {
    const btn = el('button', {
      className: `btn btn--sm${cat === currentCategory ? ' active' : ''}`,
      textContent: cat,
      onClick() {
        currentCategory = cat;
        nav.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterAndPaginate();
        renderPage();
      },
    });
    nav.appendChild(btn);
  });
  frag.appendChild(nav);

  const searchInput = el('input', {
    type: 'text',
    className: 'search-input',
    placeholder: '搜索成就名称...',
    style: { width: '100%', marginBottom: '12px' },
  });
  frag.appendChild(searchInput);

  const container = el('div', { id: 'achievementContainer' });
  frag.appendChild(container);

  const pagerRow = el('div', { className: 'achievement-pager' });
  const prevBtn = el('button', { className: 'btn btn--sm', id: 'achievementPrev', textContent: '← 上一页', onClick() { currentPage--; renderPage(); } });
  const pageInfo = el('span', { className: 'achievement-page-info', id: 'achievementPageInfo' });
  const nextBtn = el('button', { className: 'btn btn--sm', id: 'achievementNext', textContent: '下一页 →', onClick() { currentPage++; renderPage(); } });
  pagerRow.appendChild(prevBtn);
  pagerRow.appendChild(pageInfo);
  pagerRow.appendChild(nextBtn);
  frag.appendChild(pagerRow);

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
      filterAndPaginate();
    } else {
      filteredList = achievements.filter(a =>
        a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || String(a.id).includes(q)
      );
      currentPage = 0;
    }
    renderPage();
  });

  filterAndPaginate();
  setTimeout(renderPage, 0);

  return frag;
}