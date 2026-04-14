const API_BASE = '/api/data';

const DATA_TYPES = {
  characters: { label: '角色', fields: [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'name', label: '名称', type: 'text' },
    { key: 'star', label: '星级', type: 'number' },
    { key: 'cmd', label: '指令', type: 'text' },
  ]},
  weapons: { label: '武器', fields: [
    { key: 'id', label: 'ID', type: 'text' },
    { key: 'name', label: '名称', type: 'text' },
    { key: 'type', label: '类型', type: 'text' },
    { key: 'star', label: '星级', type: 'number' },
    { key: 'cmd', label: '指令', type: 'text' },
  ]},
  commands: { label: '指令', fields: [
    { key: 'cmd', label: '指令', type: 'text' },
    { key: 'desc', label: '描述', type: 'text' },
    { key: 'category', label: '分类', type: 'text' },
  ]},
  bosses: { label: 'Boss', fields: [
    { key: 'name', label: '名称', type: 'text' },
    { key: 'english', label: '英文名', type: 'text' },
  ]},
  scenes: { label: '场景', fields: [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'name', label: '名称', type: 'text' },
    { key: 'cmd', label: '指令', type: 'text' },
    { key: 'version', label: '版本', type: 'text' },
  ]},
};

let store = {};
let currentTab = 'characters';
let editingIndex = -1;

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', async () => {
  await loadAllData();
  bindEvents();
  renderAllTabs();
});

async function loadAllData() {
  const types = Object.keys(DATA_TYPES);
  const results = await Promise.all(
    types.map(t => fetch(`${API_BASE}/${t}`).then(r => r.json()).catch(() => []))
  );
  types.forEach((t, i) => { store[t] = results[i]; });
}

// ========== 事件绑定 ==========
function bindEvents() {
  // Tab 切换
  document.querySelectorAll('.admin-nav .nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-nav .nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
      currentTab = btn.dataset.tab;
    });
  });

  // 弹窗
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  document.getElementById('modalSave').addEventListener('click', saveModal);
}

// ========== 渲染所有 Tab ==========
function renderAllTabs() {
  Object.keys(DATA_TYPES).forEach(type => renderTab(type));
}

function renderTab(type, filter = '') {
  const config = DATA_TYPES[type];
  const data = store[type] || [];
  const filtered = filter
    ? data.filter(item => JSON.stringify(item).toLowerCase().includes(filter.toLowerCase()))
    : data;

  const container = document.getElementById(`tab-${type}`);
  container.innerHTML = `
    <h2>${config.label}管理 <span class="count">共 ${data.length} 条</span></h2>
    <div class="toolbar">
      <input type="text" placeholder="搜索 ${config.label}..." data-search="${type}">
      <button class="btn-primary" data-add="${type}">+ 添加</button>
    </div>
    <div class="data-list" id="list-${type}"></div>
  `;

  const list = container.querySelector(`#list-${type}`);
  filtered.forEach((item, i) => {
    const actualIndex = data.indexOf(item);
    const row = document.createElement('div');
    row.className = 'data-row';

    const name = item.name || item.desc || item.cmd || `#${item.id}`;
    const meta = config.fields
      .filter(f => f.key !== 'name' && f.key !== 'desc' && item[f.key] !== undefined)
      .map(f => `<span class="meta">${f.label}: ${item[f.key]}</span>`)
      .join(' ');

    row.innerHTML = `
      <span class="name">${escapeHtml(String(name))}</span>
      <span class="meta-group">${meta}</span>
      <span class="actions">
        <button class="btn-edit" data-type="${type}" data-idx="${actualIndex}">编辑</button>
        <button class="btn-danger" data-type="${type}" data-idx="${actualIndex}">删除</button>
      </span>
    `;
    list.appendChild(row);
  });

  // 绑定搜索
  const searchInput = container.querySelector(`[data-search="${type}"]`);
  let debounce;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => renderTab(type, e.target.value), 300);
  });

  // 绑定添加
  container.querySelector(`[data-add="${type}"]`).addEventListener('click', () => openModal(type));

  // 绑定编辑/删除
  list.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.type, parseInt(btn.dataset.idx)));
  });
  list.querySelectorAll('.btn-danger').forEach(btn => {
    btn.addEventListener('click', () => deleteItem(btn.dataset.type, parseInt(btn.dataset.idx)));
  });
}

// ========== 弹窗 ==========
function openModal(type, index = -1) {
  editingIndex = index;
  const config = DATA_TYPES[type];
  const item = index >= 0 ? store[type][index] : {};

  document.getElementById('modalTitle').textContent = `${index >= 0 ? '编辑' : '添加'}${config.label}`;
  document.getElementById('modalFields').innerHTML = config.fields.map(f => `
    <div class="form-group">
      <label>${f.label}</label>
      <input id="f-${f.key}" type="${f.type}" value="${escapeHtml(String(item[f.key] ?? ''))}">
    </div>
  `).join('');

  document.getElementById('modalFields').dataset.type = type;
  document.getElementById('editModal').classList.add('active');
}

function closeModal() {
  document.getElementById('editModal').classList.remove('active');
  editingIndex = -1;
}

function saveModal() {
  const type = document.getElementById('modalFields').dataset.type;
  const config = DATA_TYPES[type];
  const item = {};

  config.fields.forEach(f => {
    const val = document.getElementById(`f-${f.key}`).value;
    item[f.key] = f.type === 'number' ? (parseInt(val) || 0) : val;
  });

  if (editingIndex >= 0) {
    store[type][editingIndex] = item;
  } else {
    store[type].push(item);
  }

  saveData(type);
  closeModal();
}

function deleteItem(type, index) {
  const item = store[type][index];
  const name = item.name || item.desc || item.cmd || `#${item.id}`;
  if (confirm(`确定删除「${name}」？`)) {
    store[type].splice(index, 1);
    saveData(type);
  }
}

// ========== 数据保存 ==========
async function saveData(type) {
  try {
    const res = await fetch(`${API_BASE}/${type}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(store[type], null, 2),
    });
    const result = await res.json();
    if (result.success) {
      showToast('保存成功！');
      renderTab(type);
    } else {
      showToast('保存失败', true);
    }
  } catch (e) {
    showToast('保存失败: ' + e.message, true);
  }
}

// ========== 工具函数 ==========
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast${isError ? ' error' : ''}`;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 2000);
}
