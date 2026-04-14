import { renderHeader } from './components/header.js';
import { renderNavBar } from './components/navBar.js';
import { renderCopyTip } from './components/copyTip.js';
import { renderAllSections } from './components/section.js';
import { state } from './store/state.js';
import { buildSearchIndex } from './utils/search.js';

export function initApp() {
  const app = document.getElementById('app');

  app.appendChild(renderCopyTip());

  const searchResults = document.createElement('div');
  searchResults.id = 'searchResults';
  searchResults.className = 'search-results';
  app.appendChild(searchResults);

  const searchCount = document.createElement('div');
  searchCount.id = 'searchCount';
  searchCount.className = 'search-count';
  app.appendChild(searchCount);

  app.appendChild(renderHeader());
  app.appendChild(renderNavBar());

  const sections = renderAllSections();
  sections.forEach(s => app.appendChild(s));

  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.id = 'backToTop';
  backToTop.textContent = '↑';
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  app.appendChild(backToTop);

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 300);
  });

  initTheme();
  buildSearchIndex();

  const hash = window.location.hash.slice(1);
  if (hash) {
    state.currentSection = hash;
  } else {
    state.currentSection = 'homeSection';
  }
}

function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);

  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.textContent = theme === 'dark' ? '🌙' : '☀️';
  }
}
