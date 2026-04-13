import { renderHeader } from './components/header.js';
import { renderNavBar } from './components/navBar.js';
import { renderCopyTip } from './components/copyTip.js';
import { renderAllSections } from './components/section.js';
import { state } from './store/state.js';

import { buildSearchIndex } from './utils/search.js';

export function initApp() {
  const app = document.getElementById('app');

  // 搜索结果容器（全局固定定位）
  const searchResults = document.createElement('div');
  searchResults.id = 'searchResults';
  searchResults.className = 'search-results-container';
  app.appendChild(searchResults);

  const searchCount = document.createElement('div');
  searchCount.id = 'searchCount';
  searchCount.className = 'search-result-count';
  app.appendChild(searchCount);

  // 渲染复制提示（全局固定定位）
  app.appendChild(renderCopyTip());

  // 渲染头部
  app.appendChild(renderHeader());

  // 渲染导航栏
  app.appendChild(renderNavBar());

  // 渲染所有内容区块
  const sections = renderAllSections();
  sections.forEach(s => app.appendChild(s));

  // 默认显示首页
  state.currentSection = 'homeSection';

  // 构建搜索索引
  buildSearchIndex();
}
