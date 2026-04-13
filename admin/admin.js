const API_BASE = '/api/data';

let characters = [];
let commands = [];

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  bindEvents();
  renderCharacters();
  renderCommands();
});

async function loadData() {
  try {
    const [charRes, cmdRes] = await Promise.all([
      fetch(`${API_BASE}/characters`).then(r => r.json()),
      fetch(`${API_BASE}/commands`).then(r => r.json()),
    ]);
    characters = charRes;
    commands = cmdRes;
  } catch (e) {
    showToast('加载数据失败: ' + e.message, true);
  }
}

// ========== 事件绑定 ==========
function bindEvents() {
  // Tab切换
  document.querySelectorAll('.admin-nav .nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-nav .nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });

  // 搜索
  document.getElementById('charSearch').addEventListener('input', (e) => renderCharacters(e.target.value));
  document.getElementById('cmdSearch').addEventListener('input', (e) => renderCommands(e.target.value));

  // 添加按钮
  document.getElementById('addCharBtn').addEventListener('click', () => openCharModal());
  document.getElementById('addCmdBtn').addEventListener('click', () => openCmdModal());

  // 弹窗
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  document.getElementById('modalSave').addEventListener('click', saveModal);
}

// ========== 角色渲染 ==========
function renderCharacters(filter = '') {
  const list = document.getElementById('charList');
  const filtered = filter
    ? characters.filter(c => c.name.includes(filter) || c.cmd.includes(filter))
    : characters;

  document.getElementById('charCount').textContent = `共 ${characters.length} 个`;

  list.innerHTML = filtered.map((c, i) => `
    <div class="data-row" data-index="${characters.indexOf(c)}">
      <span class="name">${c.name}</span>
      <span class="star">${c.star}★</span>
      <span class="code">${c.cmd}</span>
      <span class="actions">
        <button class="btn-edit" onclick="editChar(${characters.indexOf(c)})">编辑</button>
        <button class="btn-danger" onclick="deleteChar(${characters.indexOf(c)})">删除</button>
      </span>
    </div>
  `).join('');
}

// ========== 指令渲染 ==========
function renderCommands(filter = '') {
  const list = document.getElementById('cmdList');
  const filtered = filter
    ? commands.filter(c => c.desc.includes(filter) || c.cmd.includes(filter))
    : commands;

  document.getElementById('cmdCount').textContent = `共 ${commands.length} 条`;

  list.innerHTML = filtered.map((c) => `
    <div class="data-row" data-index="${commands.indexOf(c)}">
      <span class="name">${c.desc}</span>
      <span class="code">${c.cmd}</span>
      <span class="star" style="min-width:60px">${c.category}</span>
      <span class="actions">
        <button class="btn-edit" onclick="editCmd(${commands.indexOf(c)})">编辑</button>
        <button class="btn-danger" onclick="deleteCmd(${commands.indexOf(c)})">删除</button>
      </span>
    </div>
  `).join('');
}

// ========== 角色弹窗 ==========
let editingCharIndex = -1;

function openCharModal(index = -1) {
  editingCharIndex = index;
  const c = index >= 0 ? characters[index] : { id: '', name: '', star: 5, cmd: '' };

  document.getElementById('modalTitle').textContent = index >= 0 ? '编辑角色' : '添加角色';
  document.getElementById('modalFields').innerHTML = `
    <div class="form-group"><label>角色ID</label><input id="f-charId" value="${c.id}"></div>
    <div class="form-group"><label>角色名</label><input id="f-charName" value="${c.name}"></div>
    <div class="form-group"><label>星级 (4/5)</label><input id="f-charStar" type="number" value="${c.star}" min="4" max="5"></div>
    <div class="form-group"><label>指令</label><input id="f-charCmd" value="${c.cmd}"></div>
  `;
  document.getElementById('editModal').classList.add('active');
}

function editChar(index) { openCharModal(index); }

function deleteChar(index) {
  if (confirm(`确定删除角色「${characters[index].name}」？`)) {
    characters.splice(index, 1);
    saveData('characters', characters);
    renderCharacters();
  }
}

// ========== 指令弹窗 ==========
let editingCmdIndex = -1;

function openCmdModal(index = -1) {
  editingCmdIndex = index;
  const c = index >= 0 ? commands[index] : { cmd: '', desc: '', category: '基础' };

  document.getElementById('modalTitle').textContent = index >= 0 ? '编辑指令' : '添加指令';
  document.getElementById('modalFields').innerHTML = `
    <div class="form-group"><label>指令</label><input id="f-cmdCmd" value="${c.cmd}"></div>
    <div class="form-group"><label>描述</label><input id="f-cmdDesc" value="${c.desc}"></div>
    <div class="form-group"><label>分类 (基础/角色/武器/材料/功能/危险)</label><input id="f-cmdCat" value="${c.category}"></div>
  `;
  document.getElementById('editModal').classList.add('active');
}

function editCmd(index) { openCmdModal(index); }

function deleteCmd(index) {
  if (confirm(`确定删除指令「${commands[index].cmd}」？`)) {
    commands.splice(index, 1);
    saveData('commands', commands);
    renderCommands();
  }
}

// ========== 弹窗保存 ==========
function saveModal() {
  if (editingCharIndex >= -1 && document.getElementById('f-charId')) {
    // 保存角色
    const data = {
      id: parseInt(document.getElementById('f-charId').value),
      name: document.getElementById('f-charName').value,
      star: parseInt(document.getElementById('f-charStar').value),
      cmd: document.getElementById('f-charCmd').value,
    };
    if (editingCharIndex >= 0) {
      characters[editingCharIndex] = data;
    } else {
      characters.push(data);
    }
    saveData('characters', characters);
    renderCharacters();
  } else {
    // 保存指令
    const data = {
      cmd: document.getElementById('f-cmdCmd').value,
      desc: document.getElementById('f-cmdDesc').value,
      category: document.getElementById('f-cmdCat').value,
    };
    if (editingCmdIndex >= 0) {
      commands[editingCmdIndex] = data;
    } else {
      commands.push(data);
    }
    saveData('commands', commands);
    renderCommands();
  }
  closeModal();
}

function closeModal() {
  document.getElementById('editModal').classList.remove('active');
  editingCharIndex = -1;
  editingCmdIndex = -1;
}

// ========== 数据保存 ==========
async function saveData(type, data) {
  try {
    const res = await fetch(`${API_BASE}/${type}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data, null, 2),
    });
    const result = await res.json();
    if (result.success) {
      showToast('保存成功！');
    } else {
      showToast('保存失败', true);
    }
  } catch (e) {
    showToast('保存失败: ' + e.message, true);
  }
}

// ========== 提示 ==========
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast${isError ? ' error' : ''}`;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 2000);
}
