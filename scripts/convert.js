/**
 * 数据转换脚本：将 GrasscutterCommandGenerator 的 txt/json 文件转为结构化 JSON
 * 使用方法：node scripts/convert.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE = path.join(__dirname, '..', '..', 'GrasscutterCommandGenerator-main', 'GrasscutterCommandGenerator-main', 'Source', 'GrasscutterTools', 'Resources');
const SOURCE_ZH = path.join(SOURCE, 'zh-cn');
const OUT = path.join(__dirname, '..', 'src', 'data');

// 工具函数
function parseTxt(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const map = {};
  content.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const idx = line.indexOf(':');
    if (idx > 0) {
      const id = line.substring(0, idx).trim();
      const name = line.substring(idx + 1).trim();
      if (id && name && !name.startsWith('[N/A]')) {
        map[id] = name;
      }
    }
  });
  return map;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// 武器类型推断
function getWeaponType(id) {
  const prefix = String(id).substring(0, 2);
  const typeMap = { '11': 'sword', '12': 'claymore', '13': 'polearm', '14': 'catalyst', '15': 'bow' };
  return typeMap[prefix] || 'unknown';
}

function getWeaponTypeLabel(type) {
  const labels = { sword: '单手剑', claymore: '双手剑', polearm: '长柄武器', catalyst: '法器', bow: '弓' };
  return labels[type] || type;
}

// ===== 1. 角色 =====
function convertCharacters() {
  const avatarMap = parseTxt(path.join(SOURCE_ZH, 'Avatar.txt'));
  const colorMap = parseTxt(path.join(SOURCE, 'AvatarColor.txt'));

  const characters = Object.entries(avatarMap)
    .filter(([id]) => !['1005', '1007'].includes(id)) // 排除主角（单独处理）
    .map(([id, name]) => {
      const numId = parseInt(id);
      const fullId = numId >= 1000 ? numId : 10000000 + numId;
      const color = colorMap[id] || '';
      let star = 5;
      if (color === 'purple' || color === 'blue' || color.includes('4')) star = 4;
      else if (color === 'gold' || color.includes('5')) star = 5;
      // 从原始HTML中补充星级
      const fourStars = [1006,1014,1015,1020,1021,1023,1024,1025,1027,1031,1032,1034,1036,1039,1043,1044,1045,1048,1050,1053,1055,1056,1059,1061,1064,1065,1067,1068,1072,1074,1076,1077,1080,1081,1083,1085,1088,1090,1092,1097,4100,4105,4108,4110,4113,4115,4121,4124,4127];
      if (fourStars.includes(fullId)) star = 4;

      return {
        id: fullId,
        name,
        star,
        cmd: `/give ${fullId} lv90 c6 sl15`,
      };
    });

  // 添加主角
  characters.unshift(
    { id: 10000005, name: '旅行者（男）', star: 5, cmd: '/give 10000005 lv90 c6 sl15' },
    { id: 10000007, name: '旅行者（女）', star: 5, cmd: '/give 10000007 lv90 c6 sl15' },
  );

  fs.writeFileSync(path.join(OUT, 'characters.json'), JSON.stringify(characters, null, 2));
  console.log(`✓ characters.json: ${characters.length} 个角色`);
}

// ===== 2. 武器 =====
function convertWeapons() {
  const weaponMap = parseTxt(path.join(SOURCE_ZH, 'Weapon.txt'));
  const colorMap = parseTxt(path.join(SOURCE, 'WeaponColor.txt'));

  const weapons = Object.entries(weaponMap)
    .filter(([id]) => id !== '10009') // 排除测试武器
    .map(([id, name]) => {
      const type = getWeaponType(id);
      const color = colorMap[id] || '';
      let star = 3;
      if (color === 'gold' || color.includes('5')) star = 5;
      else if (color === 'purple' || color.includes('4')) star = 4;
      else if (color === 'blue' || color.includes('3')) star = 3;
      // 从ID推断星级
      const idStr = String(id);
      const starDigit = idStr.charAt(2);
      if (starDigit === '5') star = 5;
      else if (starDigit === '4') star = 4;
      else if (starDigit === '3') star = 3;
      else if (starDigit === '2') star = 2;
      else if (starDigit === '1') star = 1;

      return {
        id,
        name,
        type,
        typeLabel: getWeaponTypeLabel(type),
        star,
        cmd: `/give ${id} x1 lv90 r5`,
      };
    });

  fs.writeFileSync(path.join(OUT, 'weapons.json'), JSON.stringify(weapons, null, 2));
  console.log(`✓ weapons.json: ${weapons.length} 件武器`);
}

// ===== 3. 怪物/Boss =====
function convertMonsters() {
  const monsterMap = parseTxt(path.join(SOURCE_ZH, 'Monsters.txt'));

  // Boss ID 前缀
  const bossPrefixes = {
    '2901': '裂空的魔龙',
    '2902': '北风的王狼',
    '2903': '「公子」达达利亚',
    '2904': '若陀龙王',
    '2905': '「女士」焚尽的炽炎魔女',
    '2906': '祸津御建鸣神命',
    '2907': '「正机之神」七叶寂照秘密主',
    '2908': '阿佩普的绿洲守望者',
    '2909': '吞星之鲸',
    '2910': '「仆人」两界之火的遗烬',
    '2911': '蚀灭的源焰之主',
    '2912': '门扉前的弈局',
    '2913': '「博士」赝月的异端者',
    '2914': '「猎月人」渎死之罪',
  };

  const bosses = [];
  const bossIds = new Set();

  // 从现有数据保留 boss 信息
  const existingBosses = [
    { prefix: '2901', name: '裂空的魔龙', english: 'Stormterror', note: null, items: [
      { cmd: '/spawn 29010101 x1 lv200', desc: '风魔龙-初战' },
      { cmd: '/spawn 29010102 x1 lv200', desc: '周本行动' },
    ]},
    { prefix: '2902', name: '北风的王狼', english: 'Lupus Boreas', note: '均无法被直接击杀', items: [
      { cmd: '/spawn 29020101 x1 lv200', desc: '' },
      { cmd: '/spawn 29020102 x1 lv200', desc: '' },
    ]},
    { prefix: '2903', name: '「公子」达达利亚', english: 'Tartaglia', note: null, items: [
      { cmd: '/spawn 29030101 x1 lv200', desc: '主线任务' },
      { cmd: '/spawn 29030104 x1 lv200', desc: '正常实机' },
    ]},
    { prefix: '2904', name: '若陀龙王', english: 'Azhdaha', note: null, items: [
      { cmd: '/spawn 29040101 x1 lv200', desc: '雷火' },
      { cmd: '/spawn 29040102 x1 lv200', desc: '冰火' },
    ]},
    { prefix: '2905', name: '「女士」焚尽的炽炎魔女', english: 'La Signora', note: null, items: [
      { cmd: '/spawn 29050101 x1 lv200', desc: '主线任务' },
      { cmd: '/spawn 29050103 x1 lv200', desc: '正常实机' },
    ]},
    { prefix: '2906', name: '祸津御建鸣神命', english: 'Magatsu Mitake', note: null, items: [
      { cmd: '/spawn 29060101 lv200 x1', desc: '充电宝' },
      { cmd: '/spawn 29060203 x1 lv200', desc: '正常实机' },
    ]},
    { prefix: '2907', name: '「正机之神」七叶寂照秘密主', english: 'Shouki no Kami', note: null, items: [
      { cmd: '/spawn 29070101 x1 lv200', desc: '主线任务' },
      { cmd: '/spawn 29070103 x1 lv200', desc: '正常实机' },
    ]},
    { prefix: '2908', name: '阿佩普的绿洲守望者', english: 'Guardian of Apep', note: null, items: [
      { cmd: '/spawn 29080101 x1 lv200', desc: '' },
    ]},
    { prefix: '2909', name: '吞星之鲸', english: 'All-Devouring Narwhal', note: null, items: [
      { cmd: '/spawn 29090101 x1 lv200', desc: '正常实机' },
    ]},
    { prefix: '2910', name: '「仆人」两界之火的遗烬', english: 'The Knave', note: null, items: [
      { cmd: '/spawn 29100102 x1 lv200', desc: '正常实机' },
      { cmd: '/spawn 29100104 x1 lv200', desc: '完整攻击模型' },
    ]},
    { prefix: '2911', name: '蚀灭的源焰之主', english: 'Eroded Primal Fire', note: '在周本外过一段时间会消失', items: [
      { cmd: '/spawn 29110102 x1 lv200', desc: '正常实机' },
    ]},
    { prefix: '2912', name: '门扉前的弈局', english: 'The Game Before the Gate', note: null, items: [
      { cmd: '/spawn 29120101 x1 lv200', desc: '' },
    ]},
    { prefix: '2913', name: '「博士」赝月的异端者', english: 'The Doctor', note: null, items: [
      { cmd: '/spawn 29130202 x1 lv200', desc: '正常实机' },
    ]},
    { prefix: '2914', name: '「猎月人」渎死之罪', english: 'Rächer of Solnari', note: null, items: [
      { cmd: '/spawn 29140101 x1 lv200', desc: '主线任务' },
    ]},
  ];

  fs.writeFileSync(path.join(OUT, 'bosses.json'), JSON.stringify(existingBosses, null, 2));
  console.log(`✓ bosses.json: ${existingBosses.length} 个Boss`);
}

// ===== 4. 场景/秘境 =====
function convertScenes() {
  const sceneMap = parseTxt(path.join(SOURCE_ZH, 'Scene.txt'));
  const dungeonMap = parseTxt(path.join(SOURCE_ZH, 'Dungeon.txt'));

  // 从现有数据保留场景信息
  const existingScenes = [
    { id: 20008, name: '凯亚战斗训练任务地城test', cmd: '/tp 623 -58 206 20008', version: '1.0' },
    { id: 20009, name: '主线任务', cmd: '/tp -77 -7 102 20009', version: '1.0' },
    { id: 20010, name: '安柏传说任务', cmd: '/tp 549 -43 36 20010', version: '1.0' },
    { id: 20011, name: '丽莎,温迪传说任务', cmd: '/tp 342 -27 485 20011', version: '1.0' },
    { id: 20013, name: '狮之殿', cmd: '/tp 122 22 38 20013', version: '1.0' },
    { id: 20023, name: '迪卢克传说任务', cmd: '/tp 190 57 318 20023', version: '1.0' },
    { id: 20024, name: '琴,可莉传说任务', cmd: '/tp 1 100 41 20024', version: '1.0' },
    { id: 20026, name: '等级突破副本', cmd: '/tp 1 1 1 20026', version: '1.0' },
    { id: 20034, name: '公子周本', cmd: '/tp 1 1 1 20034', version: '1.0' },
    { id: 20035, name: '失落的忒耳摩冬遗迹', cmd: '/tp 352 -12 266 20035', version: '1.0' },
    { id: 20104, name: '「深渊」的诱惑', cmd: '/tp -158 1 -48 20104', version: '1.0' },
    { id: 20106, name: '若陀龙王周本', cmd: '/tp 518 74 493 20106', version: '1.0' },
    { id: 20111, name: '町奉行所收监处', cmd: '/tp 65 1 114 20111', version: '2.0' },
    { id: 20112, name: '千手百眼', cmd: '/tp 479 100 473 20112', version: '2.0' },
    { id: 20113, name: '邪眼工厂', cmd: '/tp -10 1 52 20113', version: '2.0' },
    { id: 20114, name: '鸣神岛·天守', cmd: '/tp 1 1 1 20114', version: '2.0' },
    { id: 20115, name: '女士周本', cmd: '/tp 1 1 1 20115', version: '2.0' },
    { id: 20121, name: '鸣神栖霞洞天', cmd: '/tp -35 -259 -29 20121', version: '2.0' },
    { id: 20125, name: '雷电将军周本', cmd: '/tp 3 1 8 20125', version: '2.0' },
    { id: 20127, name: '鹤径折旋之所', cmd: '/tp 10 49 126 20127', version: '2.0' },
    { id: 20129, name: '迷错幻渺之境', cmd: '/tp 325 199 494 20129', version: '2.0' },
    { id: 20132, name: '须弥兰娜罗梦境地城', cmd: '/tp 528 18 556 20132', version: '3.0' },
    { id: 20151, name: '神秘的遗迹', cmd: '/tp -11 1 75 20151', version: '3.0' },
    { id: 20154, name: '散兵周本', cmd: '/tp -8 -58 -13 20154', version: '3.0' },
    { id: 20159, name: '沙下灵囿', cmd: '/tp 457 68 499 20159', version: '3.0' },
    { id: 20163, name: '「降神工坊」', cmd: '/tp 3 58 -10 20163', version: '3.0' },
    { id: 20168, name: '正机之神殿', cmd: '/tp 1 5 13 20168', version: '3.0' },
    { id: 20179, name: '草龙周本', cmd: '/tp 300 10 100 20179', version: '3.0' },
    { id: 20186, name: '水之奥秘', cmd: '/tp 258 42 176 20186', version: '4.0' },
    { id: 20187, name: '魔术工坊', cmd: '/tp 76 43 -38 20187', version: '4.0' },
    { id: 20199, name: '鲸鱼周本', cmd: '/tp 1 -5 6 20199', version: '4.0' },
    { id: 20212, name: '厄舍的服装工厂', cmd: '/tp 130 21 265 20212', version: '4.0' },
    { id: 20214, name: '仆人周本', cmd: '/tp 121 528 843 20214', version: '4.0' },
    { id: 20228, name: '「秘源遗迹」', cmd: '/tp 425 260 583 20228', version: '5.0' },
    { id: 20229, name: '「夜神空间」', cmd: '/tp 570 28 547 20229', version: '5.0' },
    { id: 20236, name: '深渊火龙王周本', cmd: '/tp -3091 2 490 20236', version: '5.0' },
    { id: 20248, name: '步入「边界」', cmd: '/tp 759 46 704 20248', version: '5.0' },
    { id: 20249, name: '生死交界处', cmd: '/tp 374 6 563 20249', version: '5.0' },
    { id: 20274, name: '「虹雨的祭祀庭」楚普卡塔津', cmd: '/tp 732 1388 445 20274', version: '6.0' },
    { id: 20277, name: '6.0主线任务', cmd: '/tp 565 120 343 20277', version: '6.0' },
    { id: 20281, name: '6.1主线奈芙尔回忆地城', cmd: '/tp 59 12 48 20281', version: '6.0' },
    { id: 20322, name: '赝月研究所', cmd: '/tp 335 289 238 20322', version: '6.0' },
    { id: 20324, name: '月球 The Moon！', cmd: '/tp 478 77 431 20324', version: '6.0' },
  ];

  fs.writeFileSync(path.join(OUT, 'scenes.json'), JSON.stringify(existingScenes, null, 2));
  console.log(`✓ scenes.json: ${existingScenes.length} 个场景`);
}

// ===== 5. 祈愿卡池 =====
function convertGacha() {
  const bannersRaw = fs.readFileSync(path.join(SOURCE, 'Banners.json'), 'utf-8');
  const banners = JSON.parse(bannersRaw);

  // 按版本分组，取每个版本的卡池
  const gachaByVersion = {};

  banners.forEach(b => {
    const version = b.comment?.match(/(\d+\.\d+)/)?.[1];
    if (!version) return;

    if (!gachaByVersion[version]) {
      gachaByVersion[version] = {
        version,
        title: b.comment || '',
        upper5: [],
        lower5: [],
        upper4: [],
        lower4: [],
        date: '',
      };
    }

    // 根据 gachaType 判断上半/下半
    const isUpper = b.gachaType === 301 || b.gachaType === 400;

    if (b.rateUpItems5?.length) {
      if (isUpper) {
        gachaByVersion[version].upper5.push(...b.rateUpItems5);
      } else {
        gachaByVersion[version].lower5.push(...b.rateUpItems5);
      }
    }
    if (b.rateUpItems4?.length) {
      if (isUpper) {
        gachaByVersion[version].upper4.push(...b.rateUpItems4);
      } else {
        gachaByVersion[version].lower4.push(...b.rateUpItems4);
      }
    }
  });

  // 加载角色名映射
  const avatarMap = parseTxt(path.join(SOURCE_ZH, 'Avatar.txt'));

  // 转换 ID 为名称
  const result = Object.values(gachaByVersion)
    .reverse() // 最新版本在前
    .map(g => ({
      ...g,
      upper5: [...new Set(g.upper5)].map(id => avatarMap[String(id)] || `ID:${id}`),
      lower5: [...new Set(g.lower5)].map(id => avatarMap[String(id)] || `ID:${id}`),
      upper4: [...new Set(g.upper4)].map(id => avatarMap[String(id)] || `ID:${id}`),
      lower4: [...new Set(g.lower4)].map(id => avatarMap[String(id)] || `ID:${id}`),
    }));

  fs.writeFileSync(path.join(OUT, 'gacha.json'), JSON.stringify(result, null, 2));
  console.log(`✓ gacha.json: ${result.length} 个版本卡池`);
}

// ===== 6. 圣遗物 =====
function convertArtifacts() {
  const artifactMap = parseTxt(path.join(SOURCE_ZH, 'Artifact.txt'));
  const catMap = parseTxt(path.join(SOURCE_ZH, 'ArtifactCat.txt'));
  const mainAttr = parseTxt(path.join(SOURCE_ZH, 'ArtifactMainAttribution.txt'));
  const subAttr = parseTxt(path.join(SOURCE_ZH, 'ArtifactSubAttribution.txt'));

  // 圣遗物套装
  const sets = Object.entries(catMap).map(([id, name]) => ({
    id: parseInt(id),
    name,
    pieces: Object.entries(artifactMap)
      .filter(([aId]) => aId.startsWith(id))
      .map(([aId, aName]) => ({ id: parseInt(aId), name: aName })),
  }));

  // 主词条
  const mainStats = Object.entries(mainAttr).map(([id, name]) => ({
    id,
    name,
  }));

  // 副词条
  const subStats = Object.entries(subAttr).map(([id, name]) => ({
    id,
    name,
  }));

  const artifactData = { sets, mainStats, subStats };
  fs.writeFileSync(path.join(OUT, 'artifacts.json'), JSON.stringify(artifactData, null, 2));
  console.log(`✓ artifacts.json: ${sets.length} 套圣遗物, ${mainStats.length} 主词条, ${subStats.length} 副词条`);
}

// ===== 7. 属性定义 =====
function convertStats() {
  const statsFile = path.join(SOURCE_ZH, 'AvatarStats.json');
  if (fs.existsSync(statsFile)) {
    const stats = JSON.parse(fs.readFileSync(statsFile, 'utf-8'));
    fs.writeFileSync(path.join(OUT, 'stats.json'), JSON.stringify(stats, null, 2));
    console.log(`✓ stats.json: ${stats.length} 个属性定义`);
  }
}

// ===== 8. 常用指令 =====
function convertCommands() {
  // 保留现有 commands.json，不做修改
  console.log('✓ commands.json: 保留现有数据');
}

// ===== 执行 =====
console.log('开始数据转换...\n');
ensureDir(OUT);

convertCharacters();
convertWeapons();
convertMonsters();
convertScenes();
convertGacha();
convertArtifacts();
convertStats();
convertCommands();

console.log('\n所有数据转换完成！');
