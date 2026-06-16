const STORAGE_KEY = 'boring-click-game:v2';
const MAX_SAFE_CLICKS = 9999999;
const thresholds = [0, 10, 30, 60, 100, 160, 250, 400];
const paths = ['tree', 'chicken', 'house'];

const pathThemes = {
  tree: {
    accent: '#2f8f5b',
    accent2: '#9cd66d',
    accent3: '#f0ba41',
    glow: 'rgba(47, 143, 91, 0.36)',
    skyTop: '#f6c98d',
    skyMid: '#f7efe2',
    groundTop: '#9cc776',
    groundDeep: '#334634'
  },
  chicken: {
    accent: '#c66a25',
    accent2: '#ffd166',
    accent3: '#ef4444',
    glow: 'rgba(246, 164, 61, 0.42)',
    skyTop: '#f4a261',
    skyMid: '#fff0c7',
    groundTop: '#d9a460',
    groundDeep: '#684832'
  },
  house: {
    accent: '#2478a6',
    accent2: '#5fc7e5',
    accent3: '#8b7cf6',
    glow: 'rgba(54, 178, 215, 0.42)',
    skyTop: '#83c5be',
    skyMid: '#edf6f9',
    groundTop: '#89b8a7',
    groundDeep: '#324b62'
  }
};

const stageMeta = {
  tree: [
    { scale: 0.28, crown: 0, trunk: 0, fruit: 0, aura: 0 },
    { scale: 0.34, crown: 1, trunk: 0.2, fruit: 0, aura: 0 },
    { scale: 0.45, crown: 2, trunk: 0.4, fruit: 0, aura: 0 },
    { scale: 0.58, crown: 3, trunk: 0.58, fruit: 0, aura: 0 },
    { scale: 0.72, crown: 4, trunk: 0.76, fruit: 0, aura: 0 },
    { scale: 0.86, crown: 5, trunk: 0.9, fruit: 0.2, aura: 0.15 },
    { scale: 0.94, crown: 5, trunk: 1, fruit: 1, aura: 0.28 },
    { scale: 1, crown: 6, trunk: 1.12, fruit: 0.55, aura: 0.62 }
  ],
  chicken: [
    { scale: 0.3, age: 0, plume: 0, tail: 0, aura: 0 },
    { scale: 0.34, age: 0.12, plume: 0, tail: 0, aura: 0 },
    { scale: 0.42, age: 0.28, plume: 0, tail: 0.1, aura: 0 },
    { scale: 0.5, age: 0.42, plume: 0.08, tail: 0.22, aura: 0 },
    { scale: 0.64, age: 0.58, plume: 0.25, tail: 0.42, aura: 0 },
    { scale: 0.76, age: 0.78, plume: 0.5, tail: 0.64, aura: 0.1 },
    { scale: 0.88, age: 0.92, plume: 0.74, tail: 0.84, aura: 0.24 },
    { scale: 1, age: 1, plume: 1, tail: 1, aura: 0.72 }
  ],
  house: [
    { scale: 0.28, floors: 0, tech: 0, aura: 0 },
    { scale: 0.38, floors: 1, tech: 0, aura: 0 },
    { scale: 0.48, floors: 2, tech: 0, aura: 0 },
    { scale: 0.58, floors: 3, tech: 0.08, aura: 0 },
    { scale: 0.68, floors: 4, tech: 0.2, aura: 0 },
    { scale: 0.78, floors: 6, tech: 0.4, aura: 0.08 },
    { scale: 0.9, floors: 8, tech: 0.62, aura: 0.18 },
    { scale: 1, floors: 10, tech: 1, aura: 0.62 }
  ]
};

const i18n = {
  zh: {
    kicker: 'Quiet Growth Lab',
    titles: { tree: '种树点击模拟器', chicken: '养鸡点击模拟器', house: '建房点击模拟器' },
    subtitle: '选择成长路线，点击世界推进下一阶段',
    tabs: {
      tree: { label: '树木', helper: '从种子到世界之树' },
      chicken: { label: '家禽', helper: '从鸡蛋到不死鸟' },
      house: { label: '建筑', helper: '从篝火到浮空城' }
    },
    stageLabel: '当前阶段',
    clicksLabel: '点击数',
    stageIndex: (current, total) => `阶段 ${current} / ${total}`,
    clickToGrow: '点击成长',
    soundOn: '音效开启',
    soundOff: '音效关闭',
    reset: '重置当前路线',
    resetToast: '当前路线已重置',
    savedToast: '进度已保存',
    instruction: '点击屏幕空白处或按空格成长；每条路线都会自动保存进度。',
    goalReached: '已达到最高形态，继续点击也会记录成长值',
    goalRemaining: (clicks, nextStage) => `距离进化为【${nextStage}】还需 ${clicks} 次点击`,
    upgradeToast: (name) => `新阶段解锁：${name}`,
    stages: {
      tree: ['一颗小种子', '生根发芽', '茁壮小苗', '青葱树苗', '茂盛小树', '参天大树', '硕果累累的大树', '远古世界之树'],
      chicken: ['鸡蛋', '破壳', '探头小鸡', '毛茸茸小鸡', '青年鸡', '成年大公鸡', '黄金斗鸡', '远古不死鸟'],
      house: ['平地篝火', '简易草屋', '温馨木屋', '坚固砖房', '现代别墅', '高层公寓', '摩天大楼', '赛博浮空城']
    }
  },
  en: {
    kicker: 'Quiet Growth Lab',
    titles: { tree: 'Boring Click Game', chicken: 'Chicken Click Game', house: 'Building Click Game' },
    subtitle: 'Choose a growth path, then click the world forward',
    tabs: {
      tree: { label: 'Tree', helper: 'Seed to world tree' },
      chicken: { label: 'Chicken', helper: 'Egg to phoenix' },
      house: { label: 'Building', helper: 'Campfire to sky city' }
    },
    stageLabel: 'Current stage',
    clicksLabel: 'Clicks',
    stageIndex: (current, total) => `Stage ${current} / ${total}`,
    clickToGrow: 'Click to grow',
    soundOn: 'Sound on',
    soundOff: 'Sound off',
    reset: 'Reset path',
    resetToast: 'Current path reset',
    savedToast: 'Progress saved',
    instruction: 'Click open space or press Space to grow. Each path saves automatically.',
    goalReached: 'Maximum form reached. Extra clicks still count as growth.',
    goalRemaining: (clicks, nextStage) => `${clicks} clicks until 【${nextStage}】`,
    upgradeToast: (name) => `New stage unlocked: ${name}`,
    stages: {
      tree: ['A Tiny Seed', 'Sprouting', 'Sturdy Seedling', 'Lush Sapling', 'Thriving Tree', 'Towering Tree', 'Fruitful Tree', 'Ancient World Tree'],
      chicken: ['Egg', 'Cracking Egg', 'Hatching Chick', 'Baby Chick', 'Young Chicken', 'Adult Rooster', 'Golden Chicken', 'Legendary Phoenix'],
      house: ['Campfire', 'Straw Hut', 'Wooden Cabin', 'Brick House', 'Modern Villa', 'Apartment Building', 'Skyscraper', 'Futuristic Sky City']
    }
  }
};

const defaultState = {
  currentPath: 'tree',
  currentLang: 'en',
  soundEnabled: true,
  paths: {
    tree: { clicks: 0, stageIndex: 0 },
    chicken: { clicks: 0, stageIndex: 0 },
    house: { clicks: 0, stageIndex: 0 }
  }
};

const els = {
  gameArea: document.getElementById('game-area'),
  kicker: document.getElementById('ui-kicker'),
  title: document.getElementById('ui-title'),
  subtitle: document.getElementById('ui-subtitle'),
  soundToggle: document.getElementById('sound-toggle'),
  pathTabs: document.getElementById('path-tabs'),
  modelWrap: document.getElementById('model-wrap'),
  modelContainer: document.getElementById('model-container'),
  stageIndexLabel: document.getElementById('stage-index-label'),
  entityName: document.getElementById('entity-name'),
  stageLabel: document.getElementById('stage-label'),
  stageName: document.getElementById('stage-name'),
  clicksLabel: document.getElementById('clicks-label'),
  clickCount: document.getElementById('click-count'),
  nextGoal: document.getElementById('next-goal'),
  progressPercent: document.getElementById('progress-percent'),
  progressFill: document.getElementById('progress-fill'),
  milestones: document.getElementById('milestones'),
  instruction: document.getElementById('ui-instruction'),
  resetButton: document.getElementById('reset-button'),
  toast: document.getElementById('toast')
};

let state = loadState();
let toastTimer = 0;
let saveTimer = 0;
let audioContext = null;

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(defaultState));
}

function sanitizeClicks(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(MAX_SAFE_CLICKS, Math.floor(value)));
}

function sanitizeState(value) {
  const next = cloneDefaultState();
  if (!value || typeof value !== 'object') return next;

  if (paths.includes(value.currentPath)) next.currentPath = value.currentPath;
  if (i18n[value.currentLang]) next.currentLang = value.currentLang;
  if (typeof value.soundEnabled === 'boolean') next.soundEnabled = value.soundEnabled;

  paths.forEach((path) => {
    const savedPath = value.paths?.[path];
    const clicks = sanitizeClicks(savedPath?.clicks);
    next.paths[path] = { clicks, stageIndex: getStageIndex(clicks) };
  });

  return next;
}

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return sanitizeState(raw ? JSON.parse(raw) : null);
  } catch {
    return cloneDefaultState();
  }
}

function scheduleSave(showSaved = false) {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      if (showSaved) showToast(getLang().savedToast);
    } catch {
      // localStorage may be disabled; gameplay should continue without persistence.
    }
  }, 120);
}

function getLang() {
  return i18n[state.currentLang] || i18n.zh;
}

function currentData() {
  return state.paths[state.currentPath] || state.paths.tree;
}

function getStageIndex(clicks) {
  for (let index = thresholds.length - 1; index >= 0; index -= 1) {
    if (clicks >= thresholds[index]) return index;
  }
  return 0;
}

function icon(path) {
  const icons = {
    tree: '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3 5 16h6L4 25h10v4h4v-4h10l-7-9h6L16 3Z"/></svg>',
    chicken: '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M20 4c1 2 1 4-1 6 4 1 7 4 7 9 0 6-5 10-11 10S4 25 4 19c0-5 4-9 9-9 0-3 2-5 7-6Zm-5 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm8 2 6 2-6 3v-5Z"/></svg>',
    house: '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M4 15 16 5l12 10-2 2v11h-7v-8h-6v8H6V17l-2-2Z"/></svg>'
  };
  return icons[path] || '';
}

function modelShell(width, height, inner, scale = 1) {
  const lang = getLang();
  const data = currentData();
  const label = lang.stages[state.currentPath][data.stageIndex];
  const modelWidth = Math.round(width * Math.min(1, Math.max(0.28, scale)));
  return `<svg class="model-svg" style="--model-width:${modelWidth}px" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">${inner}</svg>`;
}

function renderTreeModel(params) {
  if (params.crown === 0) {
    return modelShell(520, 560, `
      <ellipse cx="260" cy="492" rx="124" ry="30" fill="#3b2b1d" opacity="0.2"/>
      <ellipse cx="260" cy="444" rx="82" ry="54" fill="#7a4b2a"/>
      <path d="M214 430 C246 402 282 402 314 430" fill="none" stroke="#3e2a1d" stroke-width="12" stroke-linecap="round"/>
      <path d="M260 390 C268 368 284 354 308 348" fill="none" stroke="#63a957" stroke-width="10" stroke-linecap="round"/>
      <circle cx="311" cy="346" r="16" fill="#9ad36e"/>
    `, params.scale);
  }

  const crownLayers = [
    [260, 166, 88, '#b7e77b'],
    [180, 246, 106, '#75bd5a'],
    [340, 238, 114, '#58a94d'],
    [254, 250, 132, '#3f9444'],
    [150, 318, 82, '#4f9f47'],
    [382, 322, 88, '#357f3c']
  ].slice(0, Math.min(6, params.crown));

  const fruit = params.fruit > 0 ? `
    <g opacity="${params.fruit}">
      <circle cx="176" cy="274" r="14" fill="#ef4444"/><circle cx="362" cy="260" r="13" fill="#f97316"/>
      <circle cx="260" cy="164" r="12" fill="#facc15"/><circle cx="226" cy="338" r="12" fill="#ef4444"/>
      <circle cx="318" cy="346" r="11" fill="#facc15"/>
    </g>` : '';

  return modelShell(520, 560, `
    <defs>
      <linearGradient id="treeTrunk" x1="0" x2="1"><stop offset="0%" stop-color="#4a2d1b"/><stop offset="52%" stop-color="#7c4a2b"/><stop offset="100%" stop-color="#2c1a11"/></linearGradient>
      <radialGradient id="treeAura" cx="50%" cy="32%" r="55%"><stop offset="0%" stop-color="#ecfccb"/><stop offset="58%" stop-color="#86efac" stop-opacity="0.42"/><stop offset="100%" stop-color="#86efac" stop-opacity="0"/></radialGradient>
    </defs>
    <circle cx="260" cy="238" r="220" fill="url(#treeAura)" opacity="${params.aura}"/>
    <path d="M260 530 C222 430 224 316 248 228 C254 205 266 205 272 228 C296 316 298 430 260 530 Z" fill="url(#treeTrunk)"/>
    <path d="M252 360 C190 326 144 288 112 220" stroke="#4a2d1b" stroke-width="${18 * params.trunk}" fill="none" stroke-linecap="round"/>
    <path d="M272 344 C334 304 384 250 418 180" stroke="#4a2d1b" stroke-width="${18 * params.trunk}" fill="none" stroke-linecap="round"/>
    ${crownLayers.map(([cx, cy, radius, fill]) => `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${fill}"/>`).join('')}
    <path d="M116 320 C178 364 344 368 410 312" fill="none" stroke="#dcfce7" stroke-width="8" opacity="0.52" stroke-linecap="round"/>
    ${fruit}
  `, params.scale);
}

function renderChickenModel(params) {
  if (params.age < 0.2) {
    const crack = params.age > 0 ? '<path d="M238 258 270 288 248 326 286 350 270 394" fill="none" stroke="#d97706" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>' : '';
    return modelShell(520, 560, `
      <ellipse cx="260" cy="492" rx="128" ry="32" fill="#3b2b1d" opacity="0.18"/>
      <path d="M260 116 C344 116 404 220 404 346 C404 442 344 502 260 502 C176 502 116 442 116 346 C116 220 176 116 260 116Z" fill="#fff5d6" stroke="#f2c35f" stroke-width="12"/>
      ${crack}
      <ellipse cx="224" cy="210" rx="34" ry="22" fill="#fffaf0" opacity="0.65"/>
    `, params.scale);
  }

  const bodyFill = params.age > 0.86 ? '#f5b73e' : params.age > 0.55 ? '#fff7d6' : '#f9d84f';
  const wingFill = params.age > 0.86 ? '#ef7b2d' : '#f2c447';
  const tailGroup = params.tail > 0 ? `
    <g opacity="${params.tail}">
      <path d="M142 374 C70 330 52 250 74 178 C132 220 174 274 206 342 Z" fill="${wingFill}"/>
      <path d="M128 418 C72 458 38 448 18 410 C88 436 142 398 206 350 Z" fill="#dd5f2a"/>
      <path d="M378 374 C450 330 468 250 446 178 C388 220 346 274 314 342 Z" fill="${wingFill}"/>
      <path d="M392 418 C448 458 482 448 502 410 C432 436 378 398 314 350 Z" fill="#dd5f2a"/>
    </g>` : '';
  const plumeGroup = params.plume > 0 ? `
    <g opacity="${params.plume}">
      <path d="M250 142 C270 70 330 72 350 132 C312 112 286 118 266 156 Z" fill="#ef4444"/>
      <path d="M238 146 C214 76 164 84 146 144 C186 120 216 124 238 164 Z" fill="#f97316"/>
      <path d="M260 116 C280 42 232 40 232 104 C246 96 256 102 260 116 Z" fill="#facc15"/>
    </g>` : '';

  return modelShell(520, 560, `
    <defs>
      <radialGradient id="phoenixAura" cx="50%" cy="48%" r="54%"><stop offset="0%" stop-color="#fff7ad"/><stop offset="64%" stop-color="#fb923c" stop-opacity="0.38"/><stop offset="100%" stop-color="#fb923c" stop-opacity="0"/></radialGradient>
    </defs>
    <circle cx="260" cy="292" r="220" fill="url(#phoenixAura)" opacity="${params.aura}"/>
    <ellipse cx="260" cy="492" rx="148" ry="32" fill="#3b2b1d" opacity="0.18"/>
    ${tailGroup}
    <path d="M214 486 L190 540 M306 486 L334 540" stroke="#d97706" stroke-width="12" stroke-linecap="round"/>
    <ellipse cx="260" cy="368" rx="104" ry="132" fill="${bodyFill}"/>
    <path d="M196 366 C156 352 134 320 134 282 C178 296 206 324 224 360 Z" fill="${wingFill}" opacity="0.86"/>
    <circle cx="278" cy="210" r="70" fill="${bodyFill}"/>
    ${plumeGroup}
    <circle cx="256" cy="194" r="9" fill="#111827"/>
    <circle cx="253" cy="190" r="3" fill="#ffffff"/>
    <path d="M318 214 L390 232 L318 256 Z" fill="#f59e0b"/>
    <path d="M294 268 C322 288 324 314 292 310" fill="#ef4444" opacity="${Math.max(0.35, params.plume)}"/>
    <path d="M210 390 C246 426 304 426 344 388" fill="none" stroke="#fffaf0" stroke-width="10" opacity="0.62" stroke-linecap="round"/>
  `, params.scale);
}

function renderHouseModel(params) {
  if (params.floors === 0) {
    return modelShell(520, 560, `
      <ellipse cx="260" cy="500" rx="150" ry="32" fill="#3b2b1d" opacity="0.18"/>
      <path d="M210 470 C246 420 240 376 260 318 C282 376 274 420 314 470 C280 498 244 498 210 470 Z" fill="#f97316"/>
      <path d="M238 464 C258 428 252 390 268 354 C286 394 286 430 308 464 C284 482 260 484 238 464 Z" fill="#fde047"/>
      <path d="M160 506 H360" stroke="#6b4226" stroke-width="18" stroke-linecap="round"/>
      <path d="M190 500 H330" stroke="#3f2a1d" stroke-width="10" stroke-linecap="round"/>
    `, params.scale);
  }

  const isTower = params.floors >= 6;
  const width = isTower ? 170 : 260;
  const baseX = 260 - width / 2;
  const height = isTower ? 70 + params.floors * 34 : 120 + params.floors * 20;
  const y = 500 - height;
  const windowRows = Array.from({ length: Math.min(8, params.floors + 1) }, (_, row) => row);
  const windowCols = isTower ? [0, 1, 2] : [0, 1, 2, 3];
  const windows = windowRows.map((row) => windowCols.map((col) => {
    const wx = baseX + 28 + col * (isTower ? 40 : 52);
    const wy = y + 36 + row * 38;
    if (wy > 452) return '';
    return `<rect x="${wx}" y="${wy}" width="${isTower ? 22 : 28}" height="24" rx="4" fill="${params.tech > 0.55 ? '#ecfeff' : '#bae6fd'}" opacity="${0.74 + params.tech * 0.2}"/>`;
  }).join('')).join('');
  const roof = isTower
    ? `<path d="M${baseX} ${y} L260 ${Math.max(52, y - 86)} L${baseX + width} ${y} Z" fill="${params.tech > 0.55 ? '#a5f3fc' : '#586577'}"/>`
    : `<path d="M${baseX - 34} ${y + 10} L260 ${y - 64} L${baseX + width + 34} ${y + 10} Z" fill="#51443b"/>`;
  const techLines = params.tech > 0 ? `
    <g opacity="${params.tech}">
      <path d="M72 444 C160 394 360 394 448 444" fill="none" stroke="#67e8f9" stroke-width="6" stroke-linecap="round"/>
      <path d="M112 518 C200 468 320 468 408 518" fill="none" stroke="#22d3ee" stroke-width="5" opacity="0.58" stroke-linecap="round"/>
      <circle cx="260" cy="${Math.max(34, y - 108)}" r="18" fill="#ecfeff"/>
    </g>` : '';

  return modelShell(520, 560, `
    <defs>
      <linearGradient id="buildingBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${params.tech > 0.55 ? '#cffafe' : '#f6f2e8'}"/><stop offset="52%" stop-color="${params.tech > 0.55 ? '#22d3ee' : '#d0c7b8'}"/><stop offset="100%" stop-color="${params.tech > 0.55 ? '#155e75' : '#8f7f6b'}"/></linearGradient>
      <radialGradient id="cityAura" cx="50%" cy="42%" r="58%"><stop offset="0%" stop-color="#ecfeff"/><stop offset="60%" stop-color="#22d3ee" stop-opacity="0.36"/><stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/></radialGradient>
    </defs>
    <circle cx="260" cy="280" r="224" fill="url(#cityAura)" opacity="${params.aura}"/>
    <ellipse cx="260" cy="500" rx="174" ry="34" fill="#1f2937" opacity="0.28"/>
    ${roof}
    <rect x="${baseX}" y="${y}" width="${width}" height="${height}" rx="${isTower ? 14 : 8}" fill="url(#buildingBody)"/>
    ${windows}
    <rect x="${260 - (isTower ? 23 : 32)}" y="${500 - (isTower ? 58 : 64)}" width="${isTower ? 46 : 64}" height="${isTower ? 58 : 64}" rx="5" fill="${params.tech > 0.55 ? '#164e63' : '#5d4037'}"/>
    ${techLines}
  `, params.scale);
}

const modelRenderers = {
  tree: renderTreeModel,
  chicken: renderChickenModel,
  house: renderHouseModel
};

function applyTheme() {
  const theme = pathThemes[state.currentPath] || pathThemes.tree;
  Object.entries({
    '--accent': theme.accent,
    '--accent-2': theme.accent2,
    '--accent-3': theme.accent3,
    '--glow': theme.glow,
    '--sky-top': theme.skyTop,
    '--sky-mid': theme.skyMid,
    '--ground-top': theme.groundTop,
    '--ground-deep': theme.groundDeep
  }).forEach(([key, value]) => document.documentElement.style.setProperty(key, value));
}

function renderPathTabs() {
  const lang = getLang();
  els.pathTabs.innerHTML = paths.map((path) => {
    const pathState = state.paths[path];
    const isActive = path === state.currentPath;
    return `
      <button class="path-button" type="button" data-path="${path}" aria-pressed="${isActive}">
        ${icon(path)}
        <span>
          <strong>${lang.tabs[path].label}</strong>
          <span>${lang.tabs[path].helper} · ${pathState.clicks}</span>
        </span>
      </button>`;
  }).join('');
}

function renderMilestones(stageIndex) {
  els.milestones.innerHTML = thresholds.map((_, index) => {
    const className = index < stageIndex ? 'milestone is-done' : index === stageIndex ? 'milestone is-current' : 'milestone';
    return `<span class="${className}"></span>`;
  }).join('');
}

function renderModel(stageIndex) {
  const params = stageMeta[state.currentPath]?.[stageIndex] || stageMeta.tree[0];
  const renderer = modelRenderers[state.currentPath] || renderTreeModel;
  els.modelContainer.innerHTML = renderer(params);
}

function updateLanguageButtons() {
  document.querySelectorAll('.lang-button').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.lang === state.currentLang));
  });
}

function updateSoundButton() {
  const lang = getLang();
  els.soundToggle.setAttribute('aria-pressed', String(state.soundEnabled));
  els.soundToggle.setAttribute('aria-label', state.soundEnabled ? lang.soundOn : lang.soundOff);
  els.soundToggle.textContent = state.soundEnabled ? '♪' : '×';
}

function getDocumentTitle(lang) {
  if (state.currentLang !== 'en') return lang.titles[state.currentPath];
  if (state.currentPath === 'tree') return 'Boring Click Game - Free Online Clicker Game';
  return `${lang.titles[state.currentPath]} | Boring Click Game`;
}

function updateUI(options = {}) {
  const lang = getLang();
  const data = currentData();
  const nextStageIndex = getStageIndex(data.clicks);
  const changedStage = nextStageIndex !== data.stageIndex || options.forceModel;
  data.stageIndex = nextStageIndex;
  const stageName = lang.stages[state.currentPath][data.stageIndex];

  applyTheme();
  document.documentElement.lang = state.currentLang === 'zh' ? 'zh-CN' : 'en';
  document.title = getDocumentTitle(lang);
  els.kicker.textContent = lang.kicker;
  els.title.textContent = lang.titles[state.currentPath];
  els.subtitle.textContent = lang.subtitle;
  els.stageLabel.textContent = lang.stageLabel;
  els.clicksLabel.textContent = lang.clicksLabel;
  els.instruction.textContent = lang.instruction;
  els.resetButton.textContent = lang.reset;
  els.entityName.textContent = stageName;
  els.stageName.textContent = stageName;
  els.stageIndexLabel.textContent = lang.stageIndex(data.stageIndex + 1, thresholds.length);
  els.clickCount.textContent = data.clicks;
  els.modelWrap.setAttribute('aria-label', `${lang.clickToGrow}: ${stageName}`);

  if (changedStage) {
    renderModel(data.stageIndex);
    restartAnimation(els.stageName, 'pop');
  }

  const currentThreshold = thresholds[data.stageIndex];
  const nextThreshold = thresholds[data.stageIndex + 1] ?? currentThreshold;
  let progress = 100;
  if (data.stageIndex < thresholds.length - 1) {
    progress = ((data.clicks - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    const nextName = lang.stages[state.currentPath][data.stageIndex + 1];
    els.nextGoal.textContent = lang.goalRemaining(nextThreshold - data.clicks, nextName);
  } else {
    els.nextGoal.textContent = lang.goalReached;
  }

  const clampedProgress = Math.max(0, Math.min(100, progress));
  els.progressFill.style.width = `${clampedProgress}%`;
  els.progressPercent.textContent = `${Math.round(clampedProgress)}%`;
  renderMilestones(data.stageIndex);
  renderPathTabs();
  updateLanguageButtons();
  updateSoundButton();
}

function restartAnimation(element, className) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

function switchPath(path) {
  if (!paths.includes(path) || path === state.currentPath) return;
  state.currentPath = path;
  updateUI({ forceModel: true });
  scheduleSave();
}

function switchLang(lang) {
  if (!i18n[lang] || lang === state.currentLang) return;
  state.currentLang = lang;
  updateUI({ forceModel: true });
  scheduleSave();
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  updateSoundButton();
  scheduleSave();
}

function resetCurrentPath() {
  state.paths[state.currentPath] = { clicks: 0, stageIndex: 0 };
  updateUI({ forceModel: true });
  scheduleSave();
  showToast(getLang().resetToast);
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add('is-visible');
  toastTimer = window.setTimeout(() => {
    els.toast.classList.remove('is-visible');
  }, 1450);
}

function showFloatingText(x, y) {
  const text = document.createElement('div');
  text.className = 'floating-number';
  text.textContent = '+1';
  text.style.left = `${x - 18}px`;
  text.style.top = `${y - 26}px`;
  text.style.setProperty('--drift', `${Math.round((Math.random() - 0.5) * 70)}px`);
  els.gameArea.appendChild(text);
  window.setTimeout(() => text.remove(), 820);
}

function spawnUpgradeParticles() {
  const rect = els.modelWrap.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height * 0.54;
  const theme = pathThemes[state.currentPath] || pathThemes.tree;
  const colors = [theme.accent, theme.accent2, theme.accent3, '#ffffff'];

  for (let i = 0; i < 34; i += 1) {
    const particle = document.createElement('span');
    const angle = Math.random() * Math.PI * 2;
    const distance = 58 + Math.random() * 150;
    const size = 5 + Math.random() * 9;
    particle.className = 'particle';
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;
    particle.style.setProperty('--size', `${size}px`);
    particle.style.setProperty('--vx', `${Math.cos(angle) * distance}px`);
    particle.style.setProperty('--vy', `${Math.sin(angle) * distance}px`);
    particle.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
    document.body.appendChild(particle);
    window.setTimeout(() => particle.remove(), 940);
  }
}

function playClickTone(isUpgrade) {
  if (!state.soundEnabled) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = isUpgrade ? 'triangle' : 'sine';
    oscillator.frequency.setValueAtTime(isUpgrade ? 540 : 300, now);
    oscillator.frequency.exponentialRampToValueAtTime(isUpgrade ? 880 : 420, now + 0.08);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(isUpgrade ? 0.09 : 0.045, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.18);
  } catch {
    state.soundEnabled = false;
    updateSoundButton();
  }
}

function registerClick(x, y) {
  const data = currentData();
  const previousStage = data.stageIndex;
  data.clicks = sanitizeClicks(data.clicks + 1);
  const nextStage = getStageIndex(data.clicks);
  const upgraded = nextStage !== previousStage;

  showFloatingText(x, y);
  els.clickCount.style.transform = 'scale(1.12)';
  window.setTimeout(() => { els.clickCount.style.transform = 'scale(1)'; }, 120);
  data.stageIndex = nextStage;
  updateUI();
  playClickTone(upgraded);
  scheduleSave(upgraded);

  if (upgraded) {
    spawnUpgradeParticles();
    showToast(getLang().upgradeToast(getLang().stages[state.currentPath][nextStage]));
  }
}

function getCenterPoint() {
  const rect = els.modelWrap.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
}

els.pathTabs.addEventListener('click', (event) => {
  const button = event.target.closest('[data-path]');
  if (!button) return;
  switchPath(button.dataset.path);
});

document.querySelectorAll('.lang-button').forEach((button) => {
  button.addEventListener('click', () => switchLang(button.dataset.lang));
});

els.soundToggle.addEventListener('click', toggleSound);
els.resetButton.addEventListener('click', resetCurrentPath);

els.gameArea.addEventListener('pointerdown', (event) => {
  if (event.button !== 0 || event.target.closest('.control-surface')) return;
  registerClick(event.clientX, event.clientY);
});

document.addEventListener('keydown', (event) => {
  if (event.code !== 'Space' && event.code !== 'Enter') return;
  const target = event.target;
  const isButton = target instanceof HTMLElement && (target.tagName === 'BUTTON' || target.closest('button'));
  if (isButton) return;
  event.preventDefault();
  const center = getCenterPoint();
  registerClick(center.x, center.y);
});

updateUI({ forceModel: true });
