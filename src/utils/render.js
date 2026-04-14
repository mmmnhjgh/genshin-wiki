import { copyText } from './copy.js';

export function el(tag, attrs, ...children) {
  const node = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'className') node.className = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'innerHTML') node.innerHTML = v;
      else if (k === 'textContent') node.textContent = v;
      else node.setAttribute(k, v);
    }
  }
  for (const child of children) {
    if (child == null) continue;
    if (typeof child === 'string') node.appendChild(document.createTextNode(child));
    else if (child instanceof Node) node.appendChild(child);
    else if (Array.isArray(child)) child.forEach(c => c && node.appendChild(c));
  }
  return node;
}

export function createCmdCard(cmd, desc) {
  const codeDiv = el('div', { className: 'cmd-card__code' }, cmd);

  const descDiv = desc
    ? el('div', { className: 'cmd-card__desc' }, desc)
    : null;

  const copyBtn = el('button', {
    className: 'btn btn--sm btn--primary',
    textContent: '一键复制',
    onClick() {
      copyText(cmd);
      copyBtn.textContent = '✓ 已复制';
      copyBtn.style.background = 'var(--success)';
      setTimeout(() => {
        copyBtn.textContent = '一键复制';
        copyBtn.style.background = '';
      }, 1200);
    },
  });

  const actionsDiv = el('div', { className: 'cmd-card__actions' }, copyBtn);
  const card = el('div', { className: 'cmd-card' }, codeDiv);

  if (descDiv) card.appendChild(descDiv);
  card.appendChild(actionsDiv);

  return card;
}

export function createSectionTitle(text) {
  return el('h2', { className: 'section-title', textContent: text });
}

export function createSubTitle(text) {
  return el('div', { className: 'sub-title', textContent: text });
}

export function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(str).replace(/[&<>"']/g, c => map[c]);
}
