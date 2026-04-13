import { searchContent } from '../utils/search.js';

export function renderHeader() {
  const header = document.createElement('div');
  header.className = 'header';
  header.innerHTML = `
    <h1>穗星数据库-七神研究所 v2.0
      <div class="version">当前游戏版本：6.3</div>
      <div class="countdown"></div>
      <div>
        <span>PC端/手机端可直接一键复制</span>
        <span style="margin: 0 10px;">|</span>
        <a href="http://110.42.109.118:8080/" target="_blank">原神6.3使用指令请前往</a>
        <div class="search-container" style="display: inline-block; position: relative;">
          <input type="text" id="searchInput" placeholder="搜索指令或名称..."
                 style="padding: 8px 12px; border: 1px solid #d9d9d9; border-radius: 6px;
                        font-size: 14px; width: 200px; outline: none;">
          <div id="searchClear" style="position: absolute; right: 8px; top: 50%;
                transform: translateY(-50%); cursor: pointer; color: #999; display: none;">×</div>
        </div>
      </div>
    </h1>
  `;

  const input = header.querySelector('#searchInput');
  const clearBtn = header.querySelector('#searchClear');

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

  return header;
}
