import { showCopyTip } from '../components/copyTip.js';

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showCopyTip();
    return true;
  } catch { /* fallback */ }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    if (ok) {
      showCopyTip();
      return true;
    }
  } catch { /* fallback */ }

  showManualCopy(text);
  return false;
}

function showManualCopy(text) {
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';
  modal.innerHTML = `
    <div style="background:var(--bg-card);border-radius:var(--radius-md);padding:24px;max-width:90%;color:var(--text-primary)">
      <div style="font-size:18px;font-weight:bold;margin-bottom:12px">请手动复制</div>
      <div style="background:var(--code-bg);padding:15px;border-radius:var(--radius-sm);margin:15px 0;font-family:monospace;word-break:break-all;border:1px solid var(--border-color)">${text}</div>
      <button class="btn btn--primary" style="width:100%;justify-content:center">我已复制</button>
    </div>
  `;
  modal.querySelector('button').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}
