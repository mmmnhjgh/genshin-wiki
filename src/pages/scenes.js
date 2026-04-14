import scenes from '../data/scenes.json';
import { createCmdCard, createSectionTitle, el } from '../utils/render.js';

function getVersions() {
  const set = new Set();
  scenes.forEach(s => set.add(s.version));
  return [...set].sort((a, b) => parseFloat(a) - parseFloat(b));
}

function getVersionRanges(versions) {
  const ranges = [];
  const grouped = {};
  versions.forEach(v => {
    const major = Math.floor(parseFloat(v));
    const key = `${major}.0`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(v);
  });
  Object.keys(grouped).sort((a, b) => parseFloat(a) - parseFloat(b)).forEach(key => {
    const vs = grouped[key];
    const label = vs.length === 1 ? `v${vs[0]}` : `v${vs[0]} ~ v${vs[vs.length - 1]}`;
    ranges.push({ key, label, versions: vs });
  });
  return ranges;
}

export function renderScenes() {
  const frag = document.createDocumentFragment();
  frag.appendChild(createSectionTitle('所有场景/秘境ID'));

  const versions = getVersions();
  const ranges = getVersionRanges(versions);

  // Version tabs
  const nav = el('div', { className: 'tab-nav', id: 'sceneVersionNav' });
  ranges.forEach((range, i) => {
    const btn = el('button', {
      className: `btn${i === 0 ? ' active' : ''}`,
      textContent: range.label,
      onClick() { switchSceneVersion(range.key); },
    });
    btn.dataset.version = range.key;
    nav.appendChild(btn);
  });
  frag.appendChild(nav);

  // Version sections
  ranges.forEach((range, i) => {
    const section = el('div', {
      id: `sceneVer${range.key.replace('.', '')}`,
      style: { display: i === 0 ? 'block' : 'none' },
    });

    range.versions.forEach(ver => {
      const verScenes = scenes.filter(s => s.version === ver);
      if (verScenes.length === 0) return;

      section.appendChild(el('div', {
        className: 'sub-title',
        textContent: `v${ver}`,
        style: { marginTop: '12px' },
      }));

      verScenes.forEach(s => {
        section.appendChild(createCmdCard(s.cmd, `（${s.name}）`));
      });
    });

    frag.appendChild(section);
  });

  return frag;
}

function switchSceneVersion(versionKey) {
  document.querySelectorAll('#sceneVersionNav ~ div[id^="sceneVer"]').forEach(s => { s.style.display = 'none'; });
  const target = document.getElementById(`sceneVer${versionKey.replace('.', '')}`);
  if (target) target.style.display = 'block';

  document.querySelectorAll('#sceneVersionNav .btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.version === versionKey);
  });
}
