import { createSectionTitle } from '../utils/render.js';

const gachaData = [
  {
    version: '「月之六」逢归的谶羽',
    date: '2026.04.08～2026.04.28 / 2026.04.28～2026.05.19',
    upper5: ['莉奈娅', '恰斯卡'],
    lower5: ['菈乌玛', '奈芙尔'],
    upper4: ['暂无数据'],
    lower4: ['暂无数据'],
  },
  {
    version: '「月之五」捕风的归客',
    date: '2026.02.25～2026.03.17 / 2026.03.17～2026.04.07',
    upper5: ['法尔伽', '菲林斯'],
    lower5: ['丝柯克', '爱可菲'],
    upper4: ['班尼特', '香菱', '砂糖'],
    lower4: ['塔利雅', '坎蒂丝', '夏洛蒂'],
  },
  {
    version: '「月之四」如果在冬夜，一个旅人',
    date: '2026.01.14～2026.02.03 / 2026.02.03～2026.02.24',
    upper5: ['哥伦比娅', '伊涅芙'],
    lower5: ['兹白', '那维莱特'],
    upper4: ['赛索斯', '菲谢尔', '伊法'],
    lower4: ['叶洛亚', '爱诺', '五郎'],
  },
  {
    version: '「月之三」终北的夜行诗',
    date: '2025.12.03～2025.12.23 / 2025.12.23～2026.01.13',
    upper5: ['杜林', '温迪'],
    lower5: ['瓦雷莎', '希诺宁'],
    upper4: ['雅珂达', '班尼特', '珐露珊'],
    lower4: ['伊安珊', '夏沃蕾', '嘉明'],
  },
  {
    version: '「月之二」回望湮灭的月光',
    date: '2025.10.22～2025.11.11 / 2025.11.11～2025.12.02',
    upper5: ['奈芙尔', '芙宁娜'],
    lower5: ['阿蕾奇诺', '钟离'],
    upper4: ['行秋', '柯莱', '瑶瑶'],
    lower4: ['蓝砚', '罗莎莉亚', '云堇'],
  },
  {
    version: '「月之一」雪浪与苍林之舞',
    date: '2025.09.10～2025.09.30 / 2025.09.30～2025.10.21',
    upper5: ['菈乌玛', '纳西妲'],
    lower5: ['菲林斯', '夜兰'],
    upper4: ['芭芭拉', '久岐忍', '卡维'],
    lower4: ['爱诺', '砂糖', '多莉'],
  },
  {
    version: '5.8 绘夏！烈日？度假村！',
    date: '2025.07.30～2025.08.19 / 2025.08.19～2025.09.09',
    upper5: ['伊涅芙', '茜特菈莉'],
    lower5: ['玛拉妮', '恰斯卡'],
    upper4: ['赛索斯', '行秋', '菲谢尔'],
    lower4: ['伊法', '欧洛伦', '班尼特'],
  },
  {
    version: '5.7 你存在的时空',
    date: '2025.06.18～2025.07.08 / 2025.07.08～2025.07.29',
    upper5: ['丝柯克', '申鹤'],
    lower5: ['玛薇卡', '艾梅莉埃'],
    upper4: ['塔利雅', '坎蒂丝', '迪奥娜'],
    lower4: ['伊安珊', '瑶瑶', '香菱'],
  },
  {
    version: '5.6 悖理',
    date: '2025.05.07～2025.05.27 / 2025.05.27～2025.06.17',
    upper5: ['爱可菲', '娜维娅'],
    lower5: ['基尼奇', '雷电将军'],
    upper4: ['伊法', '欧洛伦', '莱依拉'],
    lower4: ['托马', '九条裟罗', '琳妮特'],
  },
  {
    version: '5.5 众火溯还之日',
    date: '2025.03.26～2025.04.15 / 2025.04.15～2025.05.06',
    upper5: ['瓦雷莎', '闲云'],
    lower5: ['希诺宁', '温迪'],
    upper4: ['伊安珊', '夏沃蕾', '嘉明'],
    lower4: ['珐露珊', '北斗', '烟绯'],
  },
];

export function renderGacha() {
  const frag = document.createDocumentFragment();
  frag.appendChild(createSectionTitle('祈愿卡池'));

  // 搜索框
  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'gacha-search-wrapper';
  searchWrapper.innerHTML = `
    <input type="text" id="gachaSearchInput" placeholder="搜索版本名称 / 五星角色名 ..." autocomplete="off">
    <div id="gachaSearchClear" class="gacha-search-clear">×</div>
  `;
  frag.appendChild(searchWrapper);

  const searchResults = document.createElement('div');
  searchResults.id = 'gachaSearchResults';
  searchResults.className = 'gacha-search-results-new';
  frag.appendChild(searchResults);

  // 卡池内容
  gachaData.forEach(g => {
    const card = document.createElement('div');
    card.className = 'cmd-card';
    card.style.cssText = 'background:#f9f0ff;border-left:4px solid #722ed1';
    card.dataset.searchable = `${g.version} ${g.upper5.join(' ')} ${g.lower5.join(' ')}`.toLowerCase();

    const versionTitle = document.createElement('div');
    versionTitle.className = 'boss-title';
    versionTitle.style.color = '#722ed1';
    versionTitle.textContent = g.version;
    card.appendChild(versionTitle);

    const desc = document.createElement('div');
    desc.className = 'cmd-desc';
    desc.innerHTML = `
      <div style="margin-bottom:6px;color:#888;">${g.date}</div>
      <strong>上半五星：</strong> ${g.upper5.map(n => `<span class="five-star">${n}</span>`).join(' ')}<br>
      <strong>四星陪跑：</strong> ${g.upper4.map(n => `<span class="four-star">${n}</span>`).join(' ')}<br>
      <strong>下半五星：</strong> ${g.lower5.map(n => `<span class="five-star">${n}</span>`).join(' ')}<br>
      <strong>四星陪跑：</strong> ${g.lower4.map(n => `<span class="four-star">${n}</span>`).join(' ')}
    `;
    card.appendChild(desc);

    frag.appendChild(card);
  });

  // 搜索事件（挂载后绑定）
  setTimeout(() => {
    const input = document.getElementById('gachaSearchInput');
    const clearBtn = document.getElementById('gachaSearchClear');
    const results = document.getElementById('gachaSearchResults');

    if (!input) return;

    let debounce;
    input.addEventListener('input', () => {
      clearTimeout(debounce);
      const val = input.value.trim();
      clearBtn.style.display = val ? 'block' : 'none';

      debounce = setTimeout(() => {
        if (!val) {
          results.style.display = 'none';
          // 显示所有卡池
          document.querySelectorAll('#questNewSection .cmd-card[data-searchable]').forEach(c => c.style.display = '');
          return;
        }

        const lower = val.toLowerCase();
        const cards = document.querySelectorAll('#questNewSection .cmd-card[data-searchable]');
        let found = 0;

        cards.forEach(c => {
          const text = c.dataset.searchable;
          if (text.includes(lower)) {
            c.style.display = '';
            found++;
          } else {
            c.style.display = 'none';
          }
        });

        results.innerHTML = `<div style="padding:12px;text-align:center;color:#666;">找到 ${found} 个卡池</div>`;
        results.style.display = 'block';
      }, 300);
    });

    clearBtn?.addEventListener('click', () => {
      input.value = '';
      clearBtn.style.display = 'none';
      results.style.display = 'none';
      document.querySelectorAll('#questNewSection .cmd-card[data-searchable]').forEach(c => c.style.display = '');
    });
  }, 100);

  return frag;
}
