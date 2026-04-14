import gachaData from '../data/gacha.json';
import { createSectionTitle, el } from '../utils/render.js';

export function renderGacha() {
  const frag = document.createDocumentFragment();
  frag.appendChild(createSectionTitle('祈愿卡池'));

  // Search
  const searchWrapper = el('div', {
    style: { marginBottom: '16px', position: 'relative' },
  });
  const searchInput = el('input', {
    type: 'text',
    id: 'gachaSearchInput',
    placeholder: '搜索版本名称 / 五星角色名 ...',
    autocomplete: 'off',
    style: {
      width: '100%', padding: '10px 36px 10px 14px', borderRadius: 'var(--radius-full)',
      border: '1px solid var(--border-color)', background: 'var(--bg-input)',
      color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none',
    },
  });
  const clearBtn = el('div', {
    id: 'gachaSearchClear',
    textContent: '×',
    style: {
      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
      cursor: 'pointer', fontSize: '18px', color: 'var(--text-muted)', display: 'none',
    },
  });
  searchWrapper.appendChild(searchInput);
  searchWrapper.appendChild(clearBtn);
  frag.appendChild(searchWrapper);

  const resultsInfo = el('div', {
    id: 'gachaSearchResults',
    style: { display: 'none', marginBottom: '8px', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' },
  });
  frag.appendChild(resultsInfo);

  // Gacha cards
  const cardsContainer = el('div', { id: 'gachaCardsContainer' });

  gachaData.forEach(g => {
    const card = el('div', { className: 'cmd-card' });
    card.style.flexDirection = 'column';
    card.style.alignItems = 'stretch';
    card.style.background = 'rgba(114,46,209,0.04)';
    card.style.borderLeft = '4px solid #722ed1';
    card.dataset.searchable = `${g.version} ${g.title || ''} ${(g.upper5 || []).join(' ')} ${(g.lower5 || []).filter(n => !n.startsWith('ID:')).join(' ')}`.toLowerCase();

    // Version title
    card.appendChild(el('div', {
      style: { fontWeight: 700, color: '#722ed1', marginBottom: '8px', fontSize: '0.95rem' },
      textContent: g.title || `v${g.version}`,
    }));

    // Content
    const content = el('div', { style: { fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.8' } });

    if (g.date) {
      content.appendChild(el('div', {
        style: { color: 'var(--text-muted)', marginBottom: '6px', fontSize: '0.75rem' },
        textContent: g.date,
      }));
    }

    const renderNames = (label, names, isFive) => {
      const line = el('div');
      line.appendChild(el('strong', null, label));
      if (names && names.length > 0) {
        const filtered = names.filter(n => !n.startsWith('ID:'));
        if (filtered.length > 0) {
          filtered.forEach((n, i) => {
            if (i > 0) line.appendChild(document.createTextNode(' '));
            line.appendChild(el('span', { className: isFive ? 'star-5' : 'star-4', textContent: n }));
          });
        } else {
          line.appendChild(document.createTextNode(' 暂无数据'));
        }
      }
      content.appendChild(line);
    };

    renderNames('上半五星：', g.upper5, true);
    renderNames('四星陪跑：', g.upper4, false);
    renderNames('下半五星：', g.lower5, true);
    renderNames('四星陪跑：', g.lower4, false);

    card.appendChild(content);
    cardsContainer.appendChild(card);
  });

  frag.appendChild(cardsContainer);

  // Search logic (deferred)
  setTimeout(() => {
    const input = document.getElementById('gachaSearchInput');
    const clear = document.getElementById('gachaSearchClear');
    const results = document.getElementById('gachaSearchResults');
    const container = document.getElementById('gachaCardsContainer');
    if (!input || !container) return;

    let debounce;
    input.addEventListener('input', () => {
      clearTimeout(debounce);
      const val = input.value.trim();
      if (clear) clear.style.display = val ? 'block' : 'none';

      debounce = setTimeout(() => {
        const cards = container.querySelectorAll('.cmd-card[data-searchable]');
        if (!val) {
          cards.forEach(c => { c.style.display = ''; });
          if (results) results.style.display = 'none';
          return;
        }

        const lower = val.toLowerCase();
        let found = 0;
        cards.forEach(c => {
          if (c.dataset.searchable.includes(lower)) {
            c.style.display = '';
            found++;
          } else {
            c.style.display = 'none';
          }
        });

        if (results) {
          results.textContent = `找到 ${found} 个卡池`;
          results.style.display = 'block';
        }
      }, 300);
    });

    clear?.addEventListener('click', () => {
      input.value = '';
      if (clear) clear.style.display = 'none';
      if (results) results.style.display = 'none';
      container.querySelectorAll('.cmd-card[data-searchable]').forEach(c => { c.style.display = ''; });
    });
  }, 100);

  return frag;
}
