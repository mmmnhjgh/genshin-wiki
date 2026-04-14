import { createSectionTitle, createSubTitle, el } from '../utils/render.js';
import { copyText } from '../utils/copy.js';

export function renderMonsters() {
  const frag = document.createDocumentFragment();
  frag.appendChild(createSectionTitle('自定义怪物属性'));

  frag.appendChild(el('div', {
    className: 'cmd-card__desc',
    textContent: '你可以在这里自由定义任何你想要的怪物属性',
    style: { marginBottom: '20px', fontSize: '0.9rem' },
  }));

  // Basic settings card
  const basicCard = el('div', { className: 'cmd-card' });
  basicCard.style.flexDirection = 'column';
  basicCard.style.alignItems = 'stretch';
  basicCard.style.background = 'rgba(0,136,255,0.04)';

  const row = el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '16px' } });

  const fields = [
    { id: 'monsterId', label: '怪物ID', default: '24010101', placeholder: '例如 24010101' },
    { id: 'monsterLevel', label: '等级', type: 'number', placeholder: '留空默认为1', min: '1', max: '200' },
    { id: 'monsterCount', label: '数量', type: 'number', placeholder: '留空默认为1', min: '1', max: '999' },
  ];

  fields.forEach(f => {
    const wrap = el('div', { style: { flex: '1', minWidth: '180px' } },
      el('div', { style: { fontWeight: 600, marginBottom: '6px', fontSize: '0.85rem' }, textContent: f.label }),
      el('input', {
        type: f.type || 'text',
        id: f.id,
        value: f.default || '',
        placeholder: f.placeholder,
        min: f.min,
        max: f.max,
        style: {
          width: '100%', padding: '8px', borderRadius: '8px',
          border: '1px solid var(--border-color)', background: 'var(--bg-input)',
          color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none',
        },
      })
    );
    row.appendChild(wrap);
  });
  basicCard.appendChild(row);

  // No-attack checkbox
  basicCard.appendChild(el('div', {
    style: { marginTop: '12px', display: 'flex', alignItems: 'center' },
  },
    el('input', { type: 'checkbox', id: 'noAttack', style: { marginRight: '8px' } }),
    el('label', { htmlFor: 'noAttack', style: { fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer' }, textContent: '无攻击性（木桩）' })
  ));

  frag.appendChild(basicCard);

  // Attribute groups
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
    frag.appendChild(createSubTitle(group.title));

    const grid = el('div', { className: 'info-grid' });
    group.attrs.forEach(attr => {
      const chip = el('div', { className: 'info-chip' },
        el('div', { className: 'info-chip__name', textContent: attr.label }),
        el('input', {
          type: 'number',
          id: attr.id,
          placeholder: '数值',
          style: {
            width: '100%', padding: '6px', borderRadius: '6px',
            border: '1px solid var(--border-color)', background: 'var(--bg-input)',
            color: 'var(--text-primary)', fontSize: '0.82rem', marginTop: '6px',
            textAlign: 'center', outline: 'none',
          },
        })
      );
      grid.appendChild(chip);
    });
    frag.appendChild(grid);
  });

  // Generate button
  frag.appendChild(el('div', { style: { marginTop: '24px' } },
    el('button', {
      className: 'btn btn--primary',
      textContent: '生成怪物指令',
      style: { width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem' },
      onClick: generateMonsterCommand,
    })
  ));

  // Result display
  const resultDiv = el('div', {
    id: 'monsterCommandDisplay',
    style: { display: 'none', marginTop: '20px' },
  });

  const resultCard = el('div', { className: 'cmd-card' });
  resultCard.style.flexDirection = 'column';
  resultCard.style.alignItems = 'stretch';
  resultCard.style.background = 'rgba(0,136,255,0.04)';

  resultCard.appendChild(el('div', { style: { fontWeight: 600, marginBottom: '8px' }, textContent: '生成的指令：' }));
  resultCard.appendChild(el('div', {
    id: 'monsterCommandText',
    className: 'cmd-card__code',
    style: { marginBottom: '12px' },
  }));
  resultCard.appendChild(el('button', {
    id: 'copyMonsterBtn',
    className: 'btn btn--success',
    textContent: '复制指令',
    style: { width: '100%', justifyContent: 'center' },
  }));

  resultDiv.appendChild(resultCard);
  frag.appendChild(resultDiv);

  // Help card
  const helpCard = el('div', { className: 'cmd-card' });
  helpCard.style.flexDirection = 'column';
  helpCard.style.alignItems = 'stretch';
  helpCard.style.marginTop = '24px';
  helpCard.style.background = 'rgba(250,140,22,0.04)';
  helpCard.style.borderLeft = '4px solid var(--warning)';

  helpCard.appendChild(el('div', { style: { fontWeight: 600, color: 'var(--warning)', marginBottom: '8px' }, textContent: '使用说明' }));
  helpCard.appendChild(el('div', {
    style: { fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.8' },
    innerHTML: '• 填写怪物ID、等级（可选）和数量（可选）<br>• 在下方属性框中输入想要的数值（留空表示不设置该属性）<br>• 点击"生成怪物指令"按钮<br>• 属性值请直接填写数字（如50表示50%）',
  }));
  frag.appendChild(helpCard);

  return frag;
}

function generateMonsterCommand() {
  const monsterId = document.getElementById('monsterId')?.value.trim() || '24010101';
  const level = document.getElementById('monsterLevel')?.value.trim();
  const count = document.getElementById('monsterCount')?.value || '1';
  const attributes = ['atk','def','hp','em','er','cr','cd','heal','shield','pyro','hydro','electro','cryo','anemo','geo','dendro','res_pyro','res_hydro','res_electro','res_cryo','res_anemo','res_geo','res_dendro','res_physical','physical','def_ignore','cdr','aspd','move'];

  const attrParts = [];
  attributes.forEach(attr => {
    const input = document.getElementById(attr);
    if (input && input.value.trim() !== '') attrParts.push(`${attr}${input.value.trim()}`);
  });

  let command = `/s ${monsterId} x${count}`;
  if (level) command += ` lv${level}`;
  if (attrParts.length) command += ` ${attrParts.join(' ')}`;

  const noAttack = document.getElementById('noAttack');
  if (noAttack?.checked) command += ' ai12001001';

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
      copyBtn.style.background = 'var(--success)';
      setTimeout(() => {
        copyBtn.textContent = '复制指令';
        copyBtn.style.background = '';
      }, 1500);
    };
  }
}
