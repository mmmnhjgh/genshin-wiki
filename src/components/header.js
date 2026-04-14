import { searchContent } from '../utils/search.js';

export function renderHeader() {
  const header = document.createElement('header');
  header.className = 'site-header section-wrapper';

  const titleWrap = document.createElement('div');
  const title = document.createElement('h1');
  title.className = 'site-title';
  title.textContent = '穗星数据库 v2.1';
  const subtitle = document.createElement('small');
  subtitle.textContent = '当前游戏版本：6.3';
  title.appendChild(subtitle);
  titleWrap.appendChild(title);

  const actions = document.createElement('div');
  actions.className = 'header-actions';

  const searchBox = document.createElement('div');
  searchBox.className = 'search-box';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'search-input';
  input.id = 'searchInput';
  input.placeholder = '搜索指令或名称...';
  input.autocomplete = 'off';

  const clearBtn = document.createElement('span');
  clearBtn.className = 'search-clear';
  clearBtn.id = 'searchClear';
  clearBtn.textContent = '×';

  searchBox.appendChild(input);
  searchBox.appendChild(clearBtn);

  const themeBtn = document.createElement('button');
  themeBtn.className = 'theme-toggle';
  themeBtn.id = 'themeToggle';
  themeBtn.title = '切换主题';
  themeBtn.textContent = '☀️';

  actions.appendChild(searchBox);
  actions.appendChild(themeBtn);

  header.appendChild(titleWrap);
  header.appendChild(actions);

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const val = input.value.trim();
    clearBtn.style.display = val ? 'block' : 'none';
    debounceTimer = setTimeout(() => searchContent(val), 300);
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.style.display = 'none';
    searchContent('');
  });

  themeBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeBtn.textContent = next === 'dark' ? '🌙' : '☀️';
  });

  return header;
}
