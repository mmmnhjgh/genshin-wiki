import characters from '../data/characters.json';
import commands from '../data/commands.json';

let searchData = [];

export function buildSearchIndex() {
  searchData = [];

  // 角色
  characters.forEach(c => {
    searchData.push({
      code: c.cmd,
      desc: c.name,
      module: '角色',
      sectionId: 'charSection',
    });
  });

  // 常用指令
  commands.forEach(c => {
    searchData.push({
      code: c.cmd,
      desc: c.desc,
      module: '常用指令',
      sectionId: 'commonCommandsSection',
    });
  });
}

export function searchContent(term) {
  const container = document.getElementById('searchResults');
  const countEl = document.getElementById('searchCount');
  if (!container || !countEl) return;

  if (!term || !term.trim()) {
    container.style.display = 'none';
    countEl.style.display = 'none';
    return;
  }

  if (searchData.length === 0) buildSearchIndex();

  const lowerTerm = term.toLowerCase();
  const results = searchData.filter(item =>
    item.code.toLowerCase().includes(lowerTerm) ||
    item.desc.toLowerCase().includes(lowerTerm)
  ).slice(0, 20);

  if (results.length === 0) {
    container.innerHTML = '<div class="search-result-item" style="color:#999;text-align:center;">未找到结果</div>';
  } else {
    container.innerHTML = results.map(r => `
      <div class="search-result-item" data-section="${r.sectionId}">
        <div class="search-result-code">${highlightText(r.code, term)}</div>
        <div style="display:flex;gap:8px;align-items:center;margin-top:4px;">
          <span>${highlightText(r.desc, term)}</span>
          <span class="search-result-module">${r.module}</span>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const sectionId = item.dataset.section;
        if (sectionId) {
          document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
          const target = document.getElementById(sectionId);
          if (target) {
            target.style.display = 'block';
            document.querySelectorAll('.nav-btn').forEach(btn => {
              btn.classList.toggle('active', btn.dataset.section === sectionId);
            });
          }
        }
        container.style.display = 'none';
      });
    });
  }

  container.style.display = 'block';
  countEl.textContent = `${results.length} 条结果`;
  countEl.style.display = 'block';
}

function highlightText(text, term) {
  if (!term) return text;
  const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
}
