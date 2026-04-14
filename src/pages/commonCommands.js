import commands from '../data/commands.json';
import { createCmdCard, createSectionTitle, createSubTitle } from '../utils/render.js';

export function renderCommonCommands() {
  const frag = document.createDocumentFragment();
  frag.appendChild(createSectionTitle('常用指令'));

  const categories = ['基础', '角色', '武器', '材料', '功能', '危险'];
  const categoryLabels = {
    '基础': '基础指令',
    '角色': '角色相关指令',
    '武器': '武器相关指令',
    '材料': '常用材料',
    '功能': '常用功能',
    '危险': '谨慎使用！！！',
  };

  categories.forEach(cat => {
    const items = commands.filter(c => c.category === cat);
    if (items.length === 0) return;

    const subTitle = createSubTitle(categoryLabels[cat]);
    if (cat === '危险') {
      subTitle.style.color = 'var(--danger)';
    }
    frag.appendChild(subTitle);

    items.forEach(item => {
      frag.appendChild(createCmdCard(item.cmd, item.desc));
    });
  });

  return frag;
}
