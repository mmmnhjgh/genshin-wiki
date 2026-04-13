import { createSectionTitle } from '../utils/render.js';
import { copyText } from '../utils/copy.js';

export function renderMonsters() {
  const frag = document.createDocumentFragment();
  frag.appendChild(createSectionTitle('自定义怪物属性'));

  const desc = document.createElement('div');
  desc.className = 'cmd-desc';
  desc.textContent = '你可以在这里自由定义任何你想要的怪物属性';
  desc.style.marginBottom = '20px';
  frag.appendChild(desc);

  // 基础设置卡片
  const basicCard = document.createElement('div');
  basicCard.className = 'cmd-card';
  basicCard.style.background = '#f0f9ff';
  basicCard.innerHTML = `
    <div style="display: flex; flex-wrap: wrap; gap: 20px;">
      <div style="flex: 1; min-width: 200px;">
        <div class="boss-title" style="margin-bottom: 5px;">怪物ID</div>
        <input type="text" id="monsterId" value="24010101" placeholder="例如 24010101"
               style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
      </div>
      <div style="flex: 1; min-width: 200px;">
        <div class="boss-title" style="margin-bottom: 5px;">等级</div>
        <input type="number" id="monsterLevel" placeholder="留空默认为1" min="1" max="200"
               style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
      </div>
      <div style="flex: 1; min-width: 200px;">
        <div class="boss-title" style="margin-bottom: 5px;">数量</div>
        <input type="number" id="monsterCount" placeholder="留空默认为1" min="1" max="999"
               style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
      </div>
    </div>
    <div style="margin-top: 10px; display: flex; align-items: center;">
      <input type="checkbox" id="noAttack" style="margin-right: 6px;">
      <label for="noAttack" style="font-size: 13px; color: #666;">无攻击性（木桩）</label>
    </div>
  `;
  frag.appendChild(basicCard);

  // 属性网格
  const attrGroups = [
    {
      title: '基础属性',
      attrs: [
        { id: 'atk', label: '攻击力' }, { id: 'def', label: '防御力' },
        { id: 'hp', label: '生命值' }, { id: 'em', label: '元素精通' },
        { id: 'er', label: '元素充能效率' }, { id: 'cr', label: '暴击率' },
        { id: 'cd', label: '暴击伤害' }, { id: 'heal', label: '治疗加成' },
        { id: 'shield', label: '护盾强效' },
      ],
    },
    {
      title: '元素伤害加成',
      attrs: [
        { id: 'pyro', label: '火元素伤害' }, { id: 'hydro', label: '水元素伤害' },
        { id: 'electro', label: '雷元素伤害' }, { id: 'cryo', label: '冰元素伤害' },
        { id: 'anemo', label: '风元素伤害' }, { id: 'geo', label: '岩元素伤害' },
        { id: 'dendro', label: '草元素伤害' },
      ],
    },
    {
      title: '元素抗性',
      attrs: [
        { id: 'res_pyro', label: '火元素抗性' }, { id: 'res_hydro', label: '水元素抗性' },
        { id: 'res_electro', label: '雷元素抗性' }, { id: 'res_cryo', label: '冰元素抗性' },
        { id: 'res_anemo', label: '风元素抗性' }, { id: 'res_geo', label: '岩元素抗性' },
        { id: 'res_dendro', label: '草元素抗性' }, { id: 'res_physical', label: '物理抗性' },
      ],
    },
    {
      title: '其他属性',
      attrs: [
        { id: 'physical', label: '物理伤害加成' }, { id: 'def_ignore', label: '无视防御' },
        { id: 'cdr', label: '冷却缩减' }, { id: 'aspd', label: '攻击速度' },
        { id: 'move', label: '移动速度' },
      ],
    },
  ];

  attrGroups.forEach(group => {
    const title = document.createElement('div');
    title.className = 'boss-title';
    title.style.marginTop = '20px';
    title.style.color = '#1677ff';
    title.textContent = group.title;
    frag.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'card-grid';

    group.attrs.forEach(attr => {
      const card = document.createElement('div');
      card.className = 'info-card';
      card.innerHTML = `
        <div class="card-name">${attr.label}</div>
        <input type="number" id="${attr.id}" placeholder="数值"
               style="width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 4px; margin-top: 4px;">
      `;
      grid.appendChild(card);
    });

    frag.appendChild(grid);
  });

  // 生成按钮
  const btnWrap = document.createElement('div');
  btnWrap.style.marginTop = '25px';
  const genBtn = document.createElement('button');
  genBtn.style.cssText = 'padding:12px 24px;background:#1677ff;color:white;border:none;border-radius:8px;font-size:16px;cursor:pointer;width:100%';
  genBtn.textContent = '生成怪物指令';
  genBtn.addEventListener('click', generateMonsterCommand);
  btnWrap.appendChild(genBtn);
  frag.appendChild(btnWrap);

  // 结果展示
  const resultDiv = document.createElement('div');
  resultDiv.id = 'monsterCommandDisplay';
  resultDiv.style.cssText = 'display:none;margin-top:20px;background:#f0f5ff;border-radius:8px;padding:15px';
  resultDiv.innerHTML = `
    <div style="font-weight:bold;margin-bottom:10px;">生成的指令：</div>
    <div id="monsterCommandText" style="background:white;padding:12px;border-radius:6px;font-family:Consolas;word-break:break-all;color:#1677ff"></div>
    <button id="copyMonsterBtn" style="margin-top:12px;padding:8px 16px;background:#52c41a;color:white;border:none;border-radius:4px;cursor:pointer">复制指令</button>
  `;
  frag.appendChild(resultDiv);

  // 说明
  const helpCard = document.createElement('div');
  helpCard.className = 'cmd-card';
  helpCard.style.cssText = 'margin-top:30px;background:#fff7e6;border-left:4px solid #fa8c16';
  helpCard.innerHTML = `
    <div class="boss-title" style="color:#fa8c16">使用说明</div>
    <div class="cmd-desc">
      • 填写怪物ID、等级（可选）和数量（可选）<br>
      • 在下方属性框中输入想要的数值（留空表示不设置该属性）<br>
      • 点击"生成怪物指令"按钮<br>
      • 属性值请直接填写数字（如50表示50%）
    </div>
  `;
  frag.appendChild(helpCard);

  return frag;
}

function generateMonsterCommand() {
  const monsterId = document.getElementById('monsterId')?.value.trim() || '24010101';
  const level = document.getElementById('monsterLevel')?.value.trim();
  const count = document.getElementById('monsterCount')?.value || '1';
  const attributes = ['atk','def','hp','em','er','cr','cd','heal','shield','pyro','hydro','electro','cryo','anemo','geo','dendro','res_pyro','res_hydro','res_electro','res_cryo','res_anemo','res_geo','res_dendro','res_physical','physical','def_ignore','cdr','aspd','move'];

  let attrParts = [];
  attributes.forEach(attr => {
    const input = document.getElementById(attr);
    if (input && input.value.trim() !== '') attrParts.push(`${attr}${input.value.trim()}`);
  });

  let command = `/s ${monsterId} x${count}`;
  if (level) command += ` lv${level}`;
  if (attrParts.length) command += ` ${attrParts.join(' ')}`;

  const noAttack = document.getElementById('noAttack');
  if (noAttack && noAttack.checked) command += ` ai12001001`;

  const display = document.getElementById('monsterCommandDisplay');
  const text = document.getElementById('monsterCommandText');
  if (display && text) {
    text.textContent = command;
    display.style.display = 'block';
  }

  const copyBtn = document.getElementById('copyMonsterBtn');
  if (copyBtn) {
    copyBtn.onclick = () => {
      copyText(command);
      copyBtn.textContent = '✓ 已复制';
      copyBtn.style.background = '#52c41a';
      setTimeout(() => {
        copyBtn.textContent = '复制指令';
      }, 1500);
    };
  }
}
