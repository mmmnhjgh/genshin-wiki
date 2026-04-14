import characters from '../data/characters.json';
import weapons from '../data/weapons.json';
import bosses from '../data/bosses.json';
import scenes from '../data/scenes.json';
import gacha from '../data/gacha.json';
import commands from '../data/commands.json';

let searchData = [];

export function buildSearchIndex() {
  searchData = [];

  characters.forEach(c => {
    searchData.push({
      code: c.cmd,
      desc: c.name,
      module: '角色',
      sectionId: 'charSection',
    });
  });

  weapons.forEach(w => {
    searchData.push({
      code: w.cmd,
      desc: `${w.name} (${w.typeLabel || w.type})`,
      module: '武器',
      sectionId: 'weaponSection',
    });
  });

  bosses.forEach(b => {
    (b.items || []).forEach(item => {
      searchData.push({
        code: item.cmd,
        desc: `${b.name}${item.desc ? ' - ' + item.desc : ''}`,
        module: 'Boss',
        sectionId: 'bossSection',
      });
    });
  });

  scenes.forEach(s => {
    searchData.push({
      code: s.cmd,
      desc: s.name,
      module: '场景',
      sectionId: 'sceneSection',
    });
  });

  gacha.forEach(g => {
    const names = [...(g.upper5 || []), ...(g.lower5 || [])].join(', ');
    searchData.push({
      code: g.title || g.version,
      desc: names,
      module: '祈愿',
      sectionId: 'questNewSection',
    });
  });

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
    container.innerHTML = '<div class="search-results__item" style="color:var(--text-muted);text-align:center">未找到结果</div>';
  } else {
    container.innerHTML = results.map(r => `
      <div class="search-results__item" data-section="${r.sectionId}">
        <div class="search-results__code">${highlightText(r.code, term)}</div>
        <div class="search-results__meta">
          <span>${highlightText(r.desc, term)}</span>
          <span class="search-badge">${r.module}</span>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.search-results__item').forEach(item => {
      item.addEventListener('click', () => {
        const sectionId = item.dataset.section;
        if (sectionId) {
          window.location.hash = '#' + sectionId;
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
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<span class="highlight">$1</span>');
}
