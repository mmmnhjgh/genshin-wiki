import { showCopyTip } from '../components/copyTip.js';

export async function copyText(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      showCopyTip();
      return true;
    }
  } catch (e) { /* fallback */ }

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
  } catch (e) { /* fallback */ }

  // 最终fallback：弹窗手动复制
  showManualCopy(text);
  return false;
}

function showManualCopy(text) {
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';
  modal.innerHTML = `
    <div style="background:white;border-radius:12px;padding:20px;max-width:90%;">
      <div style="font-size:18px;font-weight:bold;margin-bottom:10px;">请手动复制</div>
      <div style="background:#f0f9ff;padding:15px;border-radius:8px;margin:15px 0;font-family:monospace;word-break:break-all;">${text}</div>
      <button style="padding:10px 20px;background:#1677ff;color:white;border:none;border-radius:6px;width:100%;cursor:pointer;">我已复制</button>
    </div>
  `;
  modal.querySelector('button').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}
