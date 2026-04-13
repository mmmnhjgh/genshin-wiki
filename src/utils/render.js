import { copyText } from './copy.js';

export function createCmdCard(cmd, desc) {
  const card = document.createElement('div');
  card.className = 'cmd-card';

  const codeDiv = document.createElement('div');
  codeDiv.className = 'cmd-code';
  codeDiv.textContent = cmd;
  card.appendChild(codeDiv);

  if (desc) {
    const descDiv = document.createElement('div');
    descDiv.className = 'cmd-desc';
    descDiv.textContent = desc;
    card.appendChild(descDiv);
  }

  const btn = document.createElement('button');
  btn.className = 'card-copy-btn';
  btn.textContent = '一键复制';
  btn.addEventListener('click', () => {
    copyText(cmd);
    btn.textContent = '✓ 已复制';
    btn.style.background = '#52c41a';
    setTimeout(() => {
      btn.textContent = '一键复制';
      btn.style.background = '';
    }, 1200);
  });
  card.appendChild(btn);

  return card;
}

export function createSectionTitle(text) {
  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = text;
  return title;
}

export function createSubTitle(text) {
  const title = document.createElement('div');
  title.className = 'boss-title';
  title.textContent = text;
  return title;
}
