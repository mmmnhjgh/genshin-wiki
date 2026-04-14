import bosses from '../data/bosses.json';
import { createCmdCard, createSectionTitle, createSubTitle, el } from '../utils/render.js';

export function renderBosses() {
  const frag = document.createDocumentFragment();
  frag.appendChild(createSectionTitle('值得铭记的强敌'));

  bosses.forEach(boss => {
    frag.appendChild(createSubTitle(boss.name));

    if (boss.english) {
      frag.appendChild(el('div', {
        style: { fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', paddingLeft: '12px' },
        textContent: boss.english,
      }));
    }

    if (boss.note) {
      frag.appendChild(el('div', {
        style: { fontSize: '0.8rem', color: 'var(--warning)', marginBottom: '8px', paddingLeft: '12px' },
        textContent: `（${boss.note}）`,
      }));
    }

    boss.items.forEach(item => {
      frag.appendChild(createCmdCard(item.cmd, item.desc ? `（${item.desc}）` : ''));
    });
  });

  // Thanks
  frag.appendChild(el('div', {
    className: 'thanks-note',
    textContent: '感谢由@梦里 Sleeping @嗨，想我了吗♪ @蓝焰 等大佬提供的周本数据ID与解惑！',
  }));

  return frag;
}
