import artifactsData from '../data/artifacts.json';
import { createSectionTitle, createSubTitle, el } from '../utils/render.js';
import { copyText } from '../utils/copy.js';

const { sets, mainStats, subStats, slotNames, slotMainStats } = artifactsData;

const SLOT_KEYS = [4, 5, 2, 1, 3];
const SLOT_ICONS = { 4: '🌸', 5: '⏳', 2: '🪶', 1: '🥂', 3: '👑' };

const MAIN_STAT_MAP = {};
mainStats.forEach(s => { MAIN_STAT_MAP[s.id] = s.name; });

const SUB_STAT_TYPES = [
  { key: 'hp', label: '生命值' },
  { key: 'hp_', label: '生命值%' },
  { key: 'atk', label: '攻击力' },
  { key: 'atk_', label: '攻击力%' },
  { key: 'def', label: '防御力' },
  { key: 'def_', label: '防御力%' },
  { key: 'cr', label: '暴击率' },
  { key: 'cd', label: '暴击伤害' },
  { key: 'em', label: '元素精通' },
  { key: 'er', label: '元素充能效率' },
];

function parseSubStatType(name) {
  if (name.includes('暴击伤害')) return 'cd';
  if (name.includes('暴击率')) return 'cr';
  if (name.includes('元素充能效率')) return 'er';
  if (name.includes('元素精通')) return 'em';
  if (name.includes('攻击力百分比') || name.includes('攻击力%')) return 'atk_';
  if (name.includes('防御力百分比') || name.includes('防御力%')) return 'def_';
  if (name.includes('生命值百分比') || name.includes('生命值%')) return 'hp_';
  if (name.includes('攻击力')) return 'atk';
  if (name.includes('防御力')) return 'def';
  if (name.includes('生命值')) return 'hp';
  return null;
}

const SUB_STATS_BY_STAR_AND_TYPE = {};
for (let s = 1; s <= 5; s++) {
  SUB_STATS_BY_STAR_AND_TYPE[s] = {};
  SUB_STAT_TYPES.forEach(t => { SUB_STATS_BY_STAR_AND_TYPE[s][t.key] = []; });
}
subStats.forEach(s => {
  if (s.star < 1 || s.star > 5) return;
  const type = parseSubStatType(s.name);
  if (type && SUB_STATS_BY_STAR_AND_TYPE[s.star][type]) {
    SUB_STATS_BY_STAR_AND_TYPE[s.star][type].push({ id: s.id, name: s.name });
  }
});

function getPieceId(setId, star, slot, subCount) {
  return setId * 1000 + star * 100 + slot * 10 + subCount;
}

function getAvailableStars(set) {
  if (set.stars && set.stars.length > 0) return set.stars;
  return [5];
}

let currentSet = sets[0];
let currentStar = getAvailableStars(sets[0]).slice(-1)[0];
let currentSlot = 4;
let currentLevel = 20;
let currentMainStat = null;
let subStatEntries = [{ type: 'cr', roll: 0 }, { type: 'cd', roll: 0 }, null, null];

export function renderArtifacts() {
  const frag = document.createDocumentFragment();
  frag.appendChild(createSectionTitle('圣遗物数据库'));

  const nav = el('div', { className: 'tab-nav', id: 'artifactNav' });
  const tabs = [
    { id: 'artifactConfigSection', label: '🔧 圣遗物配置器' },
    { id: 'artifactSetsSection', label: '📋 套装列表' },
    { id: 'artifactGuideSection', label: '📝 参考词条' },
  ];
  tabs.forEach((tab, i) => {
    const btn = el('button', {
      className: `btn${i === 0 ? ' active' : ''}`,
      textContent: tab.label,
      dataset: { tab: tab.id },
      onClick() {
        document.querySelectorAll('.artifact-sub').forEach(s => { s.style.display = 'none'; });
        const target = document.getElementById(tab.id);
        if (target) target.style.display = 'block';
        nav.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      },
    });
    nav.appendChild(btn);
  });
  frag.appendChild(nav);

  frag.appendChild(buildConfigSection());
  frag.appendChild(buildSetsSection());
  frag.appendChild(buildGuideSection());

  return frag;
}

function buildConfigSection() {
  const section = el('div', { id: 'artifactConfigSection', className: 'artifact-sub' });

  const searchInput = el('input', {
    type: 'text',
    className: 'search-input',
    placeholder: '搜索套装名称...',
    style: { width: '100%', marginBottom: '12px' },
  });

  const searchWrap = el('div', { className: 'artifact-search-wrap' }, searchInput);

  const setGrid = el('div', { className: 'artifact-set-grid' });
  renderSetGrid(setGrid, '');

  searchInput.addEventListener('input', () => {
    renderSetGrid(setGrid, searchInput.value.trim());
  });

  const slotRow = el('div', { className: 'artifact-slot-row', id: 'slotRow' });
  const levelRow = el('div', { className: 'artifact-config-row' });
  const mainStatRow = el('div', { className: 'artifact-config-row' });
  const subStatsContainer = el('div', { className: 'artifact-substats', id: 'subStatsContainer' });

  const levelLabel = el('span', { className: 'artifact-label', textContent: '等级:' });
  const levelValue = el('span', { id: 'levelValue', className: 'artifact-level-value', textContent: '20' });
  const levelSlider = el('input', {
    type: 'range', min: '0', max: '20', value: '20',
    className: 'artifact-slider',
    id: 'levelSlider',
    onInput() {
      currentLevel = parseInt(levelSlider.value);
      levelValue.textContent = currentLevel;
      updateCommand();
    },
  });
  levelRow.appendChild(levelLabel);
  levelRow.appendChild(levelSlider);
  levelRow.appendChild(levelValue);

  const mainStatLabel = el('span', { className: 'artifact-label', textContent: '主词条:' });
  const mainStatSelect = el('select', { className: 'artifact-select', id: 'mainStatSelect' });
  mainStatRow.appendChild(mainStatLabel);
  mainStatRow.appendChild(mainStatSelect);

  const cmdCard = el('div', { className: 'cmd-card artifact-cmd-card', id: 'artifactCmdCard' });
  const cmdCode = el('div', { className: 'cmd-card__code', id: 'artifactCmdText', textContent: '' });
  const copyBtn = el('button', {
    className: 'btn btn--primary',
    textContent: '一键复制',
    onClick() {
      const text = cmdCode.textContent;
      if (text) {
        copyText(text);
        copyBtn.textContent = '✓ 已复制';
        copyBtn.style.background = 'var(--success)';
        setTimeout(() => {
          copyBtn.textContent = '一键复制';
          copyBtn.style.background = '';
        }, 1200);
      }
    },
  });
  const cmdActions = el('div', { className: 'cmd-card__actions' }, copyBtn);
  cmdCard.appendChild(cmdCode);
  cmdCard.appendChild(cmdActions);

  const cmdNote = el('div', {
    className: 'artifact-note',
    textContent: '提示：食1/2/3/4代表初始副词条数量，如 51514 表示5星行者之心生之花(4个初始副词条)',
  });

  section.appendChild(searchWrap);
  section.appendChild(setGrid);
  section.appendChild(slotRow);
  section.appendChild(levelRow);
  section.appendChild(mainStatRow);
  section.appendChild(subStatsContainer);
  section.appendChild(cmdCard);
  section.appendChild(cmdNote);

  setTimeout(() => {
    renderSlots();
    renderMainStats();
    renderSubStats();
    updateCommand();
  }, 0);

  return section;
}

function renderSetGrid(container, filter) {
  container.innerHTML = '';
  const lowerFilter = (filter || '').toLowerCase();
  sets.forEach(set => {
    if (lowerFilter && !set.name.toLowerCase().includes(lowerFilter)) return;
    const btn = el('button', {
      className: `btn btn--sm artifact-set-btn${set.id === currentSet.id ? ' active' : ''}`,
      textContent: set.name,
      dataset: { setId: String(set.id) },
      onClick() {
        currentSet = set;
        const stars = getAvailableStars(set);
        currentStar = stars.slice(-1)[0];
        container.querySelectorAll('.artifact-set-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderSlots();
        renderMainStats();
        renderSubStats();
        updateCommand();
      },
    });
    container.appendChild(btn);
  });
}

function renderSlots() {
  const row = document.getElementById('slotRow');
  if (!row) return;
  row.innerHTML = '';

  const label = el('span', { className: 'artifact-label', textContent: '部位:' });
  row.appendChild(label);

  SLOT_KEYS.forEach(slot => {
    const btn = el('button', {
      className: `btn btn--sm artifact-slot-btn${slot === currentSlot ? ' active' : ''}`,
      innerHTML: `${SLOT_ICONS[slot]} ${slotNames[slot]}`,
      dataset: { slot: String(slot) },
      onClick() {
        currentSlot = slot;
        row.querySelectorAll('.artifact-slot-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMainStats();
        renderSubStats();
        updateCommand();
      },
    });
    row.appendChild(btn);
  });
}

function renderMainStats() {
  const select = document.getElementById('mainStatSelect');
  if (!select) return;
  select.innerHTML = '';

  const ids = slotMainStats[currentSlot] || [];
  const names = { 4: '生命值', 2: '攻击力' };

  if (ids.length === 0 && (currentSlot === 4 || currentSlot === 2)) {
    const fixedId = currentSlot === 4 ? '10001' : '12001';
    const fixedName = currentSlot === 4 ? '生命值' : '攻击力';
    const opt = el('option', { value: fixedId, textContent: `${fixedName}（固定）` });
    select.appendChild(opt);
    currentMainStat = fixedId;
  } else {
    if (currentSlot === 4) {
      const opt = el('option', { value: '10001', textContent: '生命值（固定）' });
      select.appendChild(opt);
      currentMainStat = '10001';
    } else if (currentSlot === 2) {
      const opt = el('option', { value: '12001', textContent: '攻击力（固定）' });
      select.appendChild(opt);
      currentMainStat = '12001';
    } else {
      ids.forEach(id => {
        const name = MAIN_STAT_MAP[String(id)] || `ID:${id}`;
        const opt = el('option', { value: String(id), textContent: name });
        select.appendChild(opt);
      });
      currentMainStat = String(ids[0]);
    }
  }

  select.addEventListener('change', () => {
    currentMainStat = select.value;
    updateCommand();
  });
}

function renderSubStats() {
  const container = document.getElementById('subStatsContainer');
  if (!container) return;
  container.innerHTML = '';

  const starSubs = SUB_STATS_BY_STAR_AND_TYPE[currentStar] || {};

  for (let i = 0; i < 4; i++) {
    const row = el('div', { className: 'artifact-substat-row' });
    const entry = subStatEntries[i] || { type: null, roll: 0 };

    const numLabel = el('span', { className: 'artifact-label artifact-label--sm', textContent: `副${i + 1}:` });
    const typeSelect = el('select', { className: 'artifact-select artifact-select--sm' });

    const noneOpt = el('option', { value: '', textContent: '（无）' });
    typeSelect.appendChild(noneOpt);

    SUB_STAT_TYPES.forEach(t => {
      const options = starSubs[t.key];
      if (options && options.length > 0) {
        const opt = el('option', { value: t.key, textContent: t.label });
        if (entry.type === t.key) opt.selected = true;
        typeSelect.appendChild(opt);
      }
    });

    const rollLabel = el('span', { className: 'artifact-label artifact-label--sm', textContent: '强化:' });
    const rollSelect = el('select', { className: 'artifact-select artifact-select--sm' });

    for (let r = 0; r <= 6; r++) {
      const opt = el('option', { value: String(r), textContent: String(r) });
      if (r === entry.roll) opt.selected = true;
      rollSelect.appendChild(opt);
    }

    const previewDiv = el('span', { className: 'artifact-substat-preview', id: `subPreview${i}` });

    const updatePreview = () => {
      const type = typeSelect.value || null;
      const roll = parseInt(rollSelect.value) || 0;
      subStatEntries[i] = type ? { type, roll } : null;
      updateSubPreview(previewDiv, type, roll);
      updateCommand();
    };

    typeSelect.addEventListener('change', updatePreview);
    rollSelect.addEventListener('change', updatePreview);

    row.appendChild(numLabel);
    row.appendChild(typeSelect);
    row.appendChild(rollLabel);
    row.appendChild(rollSelect);
    row.appendChild(previewDiv);
    container.appendChild(row);

    updateSubPreview(previewDiv, entry.type, entry.roll);
  }
}

function updateSubPreview(el, type, roll) {
  if (!type) {
    el.textContent = '';
    return;
  }
  const options = SUB_STATS_BY_STAR_AND_TYPE[currentStar]?.[type] || [];
  if (options.length === 0) {
    el.textContent = '';
    return;
  }
  const base = options[0];
  if (roll === 0) {
    el.textContent = `→ ${base.name}`;
  } else {
    el.textContent = `→ ${base.name}${roll > 0 ? ` ×${roll + 1}次` : ''}`;
  }
}

function updateCommand() {
  const cmdText = document.getElementById('artifactCmdText');
  if (!cmdText) return;

  const subCount = subStatEntries.filter(s => s !== null).length;
  if (subCount === 0) subStatEntries[0] = { type: 'cr', roll: 0 };

  const pieceId = getPieceId(currentSet.id, currentStar, currentSlot, subCount);
  let cmd = `/give ${pieceId} lv${currentLevel}`;

  if (currentMainStat) {
    cmd += ` ${currentMainStat}`;
  }

  subStatEntries.forEach(entry => {
    if (!entry || !entry.type) return;
    const options = SUB_STATS_BY_STAR_AND_TYPE[currentStar]?.[entry.type];
    if (!options || options.length === 0) return;
    const base = options[0];
    const count = entry.roll > 0 ? `,${entry.roll}` : '';
    cmd += ` ${base.id}${count}`;
  });

  cmdText.textContent = cmd;
}

function buildSetsSection() {
  const section = el('div', { id: 'artifactSetsSection', className: 'artifact-sub', style: { display: 'none' } });

  const searchInput = el('input', {
    type: 'text',
    className: 'search-input',
    placeholder: '搜索套装...',
    style: { width: '100%', marginBottom: '12px' },
  });

  const grid = el('div', { className: 'info-grid' });

  const renderFiltered = (filter) => {
    grid.innerHTML = '';
    const lf = (filter || '').toLowerCase();
    sets.forEach(set => {
      if (lf && !set.name.toLowerCase().includes(lf)) return;
      const starNums = (set.stars || [5]).join('⭐') || '⭐';
      const chip = el('div', {
        className: 'info-chip',
        onClick() {
          currentSet = set;
          const stars = getAvailableStars(set);
          currentStar = stars.slice(-1)[0];
          const configSec = document.getElementById('artifactConfigSection');
          if (configSec) {
            document.querySelectorAll('.artifact-sub').forEach(s => s.style.display = 'none');
            configSec.style.display = 'block';
            document.querySelectorAll('#artifactNav .btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('#artifactNav .btn').forEach(b => { if (b.dataset.tab === 'artifactConfigSection') b.classList.add('active'); });
            renderSlots();
            renderMainStats();
            renderSubStats();
            updateCommand();
          }
        },
      });
      chip.appendChild(el('div', { className: 'info-chip__id', textContent: String(set.id) }));
      chip.appendChild(el('div', { className: 'info-chip__name', textContent: set.name }));
      const starDiv = el('div', { className: `star-${Math.max(...(set.stars || [5]))}`, textContent: starNums });
      chip.appendChild(starDiv);
      grid.appendChild(chip);
    });
  };

  searchInput.addEventListener('input', () => renderFiltered(searchInput.value.trim()));
  renderFiltered('');

  section.appendChild(searchInput);
  section.appendChild(grid);
  return section;
}

function buildGuideSection() {
  const section = el('div', {
    id: 'artifactGuideSection',
    className: 'artifact-sub',
    style: { display: 'none' },
  });

  const templateCard = el('div', { className: 'cmd-card' });
  templateCard.style.flexDirection = 'column';
  templateCard.style.alignItems = 'stretch';
  templateCard.style.background = 'rgba(0,136,255,0.04)';
  templateCard.appendChild(el('div', { className: 'cmd-card__code', textContent: '/give <圣遗物ID> lv<等级> <主词条ID> [副词条ID[,强化次数]] ...' }));
  templateCard.appendChild(el('div', { className: 'cmd-card__desc', textContent: '【圣遗物指令通用模板】' }));
  section.appendChild(templateCard);

  const idCard = el('div', { className: 'cmd-card' });
  idCard.style.flexDirection = 'column';
  idCard.style.alignItems = 'stretch';
  idCard.style.background = 'rgba(0,136,255,0.04)';
  idCard.appendChild(el('div', { className: 'cmd-card__code', textContent: '圣遗物ID = 套装ID×1000 + 星级×100 + 部位×10 + 初始副词条数' }));
  idCard.appendChild(el('div', { className: 'cmd-card__desc', textContent: '部位: 1=空之杯 2=死之羽 3=理之冠 4=生之花 5=时之沙' }));
  section.appendChild(idCard);

  section.appendChild(createSubTitle('各部位可用主词条'));

  SLOT_KEYS.forEach(slot => {
    const slotSection = el('div', { className: 'cmd-card' });
    slotSection.style.flexDirection = 'column';
    slotSection.style.alignItems = 'stretch';

    slotSection.appendChild(el('div', {
      className: `star-${slot === 4 || slot === 2 ? 5 : 4}`,
      textContent: `${SLOT_ICONS[slot]} ${slotNames[slot]}`,
      style: { fontWeight: 600, marginBottom: '8px' },
    }));

    const ids = slotMainStats[slot] || (slot === 4 ? ['10001'] : slot === 2 ? ['12001'] : []);
    const statGrid = el('div', { className: 'info-grid' });
    ids.forEach(id => {
      const name = MAIN_STAT_MAP[String(id)] || `ID:${id}`;
      statGrid.appendChild(el('div', { className: 'info-chip' },
        el('div', { className: 'info-chip__id', textContent: String(id) }),
        el('div', { className: 'info-chip__name', textContent: name })
      ));
    });
    slotSection.appendChild(statGrid);
    section.appendChild(slotSection);
  });

  return section;
}