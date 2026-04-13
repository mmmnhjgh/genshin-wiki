export function renderCopyTip() {
  const tip = document.createElement('div');
  tip.className = 'copy-tip';
  tip.id = 'copyTip';
  tip.textContent = '复制成功！';
  return tip;
}

export function showCopyTip() {
  const tip = document.getElementById('copyTip');
  if (tip) {
    tip.style.display = 'block';
    setTimeout(() => tip.style.display = 'none', 1000);
  }
}
