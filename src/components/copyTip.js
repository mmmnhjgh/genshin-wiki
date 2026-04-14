export function renderCopyTip() {
  const tip = document.createElement('div');
  tip.className = 'copy-toast';
  tip.id = 'copyTip';
  tip.textContent = '复制成功！';
  return tip;
}

export function showCopyTip() {
  const tip = document.getElementById('copyTip');
  if (!tip) return;
  tip.classList.add('show');
  clearTimeout(tip._hideTimer);
  tip._hideTimer = setTimeout(() => tip.classList.remove('show'), 1200);
}
