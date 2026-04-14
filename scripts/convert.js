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
  const colorRaw = fs.readFileSync(path.join(SOURCE, 'AvatarColor.txt'), 'utf-8');
  const colorMap = {};
  colorRaw.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#') || line.startsWith('\uFEFF')) return;
    const idx = line.indexOf(':');
    if (idx > 0) {
      const id = line.substring(0, idx).trim();
      const val = line.substring(idx + 1).trim();
      colorMap[id] = val;
    }
  });

  const characters = [];

  // 纳塔新角色星级补充（AvatarColor.txt不包含4100+的ID）
  const natlanStars = { 4100: 4, 4101: 5, 4102: 5, 4103: 5, 4104: 5, 4105: 4, 4106: 5, 4107: 5, 4108: 4, 4109: 5, 4110: 4, 4111: 5, 4112: 5, 4113: 4, 4114: 5, 4115: 4, 4116: 5, 4119: 5, 4120: 5, 4121: 4, 4122: 5, 4123: 5, 4124: 4, 4125: 5, 4126: 5, 4127: 4, 4128: 5, 4130: 5 };

  // 主角
  characters.push(
    { id: 10000005, name: '旅行者（男）', star: 5, cmd: '/give 10000005 lv90 c6 sl15' },
    { id: 10000007, name: '旅行者（女）', star: 5, cmd: '/give 10000007 lv90 c6 sl15' },
  );

  Object.entries(avatarMap).forEach(([id, name]) => {
    if (['1005', '1007'].includes(id)) return;
    const numId = parseInt(id);
    const fullId = numId >= 1000 ? numId : 10000000 + numId;

    let star;
    if (natlanStars[numId] !== undefined) {
      star = natlanStars[numId];
    } else {
      const colorVal = colorMap[id] || colorMap[String(numId)] || '';
      star = parseInt(colorVal) || 5;
      if (star < 1 || star > 5) star = 5;
    }

    characters.push({
      id: fullId,
      name,
      star,
      cmd: `/give ${fullId} lv90 c6 sl15`,
    });
  });

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

  // 圣遗物部位定义
  const slotNames = {
    1: '空之杯', 2: '死之羽', 3: '理之冠', 4: '生之花', 5: '时之沙',
  };

  // 各部位可用的主词条ID
  const slotMainStats = {
    1: [15002,15004,15006,15007,15008,15009,15010,15011,15012,15013,15014,15015],
    2: [12001],
    3: [13002,13004,13006,13007,13008,13009,13010],
    4: [10001],
    5: [10002,10004,10006,10007,10008],
  };

  // 圣遗物套装 - 增加每套装星级信息
  const sets = Object.entries(catMap).map(([id, name]) => {
    const setId = parseInt(id);
    const pieces = Object.entries(artifactMap)
      .filter(([aId]) => aId.startsWith(id))
      .map(([aId, aName]) => {
        const numId = parseInt(aId);
        const slot = numId % 100 < 10 ? numId % 10 : Math.floor((numId % 100) / 10);
        return { id: numId, name: aName, slot };
      });

    // 从件数推断可用星级
    const uniqueStars = [...new Set(pieces.map(p => Math.floor((p.id % 1000) / 100)))].filter(s => s >= 1 && s <= 5).sort();

    return { id: setId, name, stars: uniqueStars, pieces };
  });

  // 主词条
  const mainStats = Object.entries(mainAttr).map(([id, name]) => ({
    id,
    name,
  }));

  // 副词条 - 按星级和类型分组
  const subStats = Object.entries(subAttr).map(([id, name]) => {
    const star = parseInt(String(id).charAt(0));
    return { id, name, star };
  });

  const artifactData = { sets, mainStats, subStats, slotNames, slotMainStats };
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
  // 从 CustomCommands.txt 读取自定义指令
  const cmdFile = path.join(SOURCE_ZH, 'CustomCommands.txt');
  const existing = [
    { cmd: '/prop unlockmap 1', desc: '解锁全地图', category: '基础' },
    { cmd: '/unlockall', desc: '解锁全功能', category: '基础' },
    { cmd: '/give avatars lv100 c6 sl15', desc: '全角色100级6命15级天赋', category: '角色' },
    { cmd: '/give weapons lv91 x2 r5', desc: '全武器精5', category: '武器' },
    { cmd: '/setprop player_level 60', desc: '冒险等级60级', category: '基础' },
    { cmd: '/prop worldlevel 9', desc: '世界等级9', category: '基础' },
    { cmd: '/give mats x9999', desc: '含材料，皮肤等道具', category: '材料' },
    { cmd: '/give 104003 lv200 x1000000', desc: '经验书', category: '材料' },
    { cmd: '/give 201 x100000', desc: '十万原石', category: '材料' },
    { cmd: '/give 202 x100000000', desc: '一亿摩拉', category: '材料' },
    { cmd: '/give 223 x10000', desc: '一万纠缠之缘', category: '材料' },
    { cmd: '/give 224 x10000', desc: '一万相遇之缘', category: '材料' },
    { cmd: '/give 1201 x1', desc: '获取珍珠纪行', category: '材料' },
    { cmd: '/give 1202 x999', desc: '获取月卡', category: '材料' },
    { cmd: '/heal', desc: '恢复全队血量', category: '功能' },
    { cmd: '/e get', desc: '恢复元素能量', category: '功能' },
    { cmd: '/killall', desc: '杀死所有怪物', category: '功能' },
    { cmd: '/achievement grantall', desc: '达成全部成就', category: '功能' },
    { cmd: '/setConst 6 all', desc: '全角色满命', category: '功能' },
    { cmd: '/setprop unlimitedenergy 1', desc: '无限能量', category: '功能' },
    { cmd: '/setprop godmode 1', desc: '无敌', category: '功能' },
    { cmd: '/setstats cdr 100%', desc: '无cd', category: '功能' },
    { cmd: '/prop unlimitedstamina on', desc: '无限体力', category: '功能' },
    { cmd: '/prop setopenstate all', desc: '解锁所有功能访问并包括完成所有教程', category: '功能' },
    { cmd: '/quest finish +任务ID', desc: '完成/跳过任务', category: '功能' },
    { cmd: '/resetconst', desc: '清空当前角色的命座 需重登', category: '危险' },
    { cmd: '/resetconst all', desc: '清空全部角色的命座 需重登', category: '危险' },
    { cmd: '/quest clear all', desc: '完全重置你的任务进度', category: '危险' },
    { cmd: '/clear all', desc: '重置该帐号上的所有内容', category: '危险' },
    { cmd: '/item clear', desc: '清空你的背包', category: '危险' },
    // 来自 CustomCommands.txt
    { cmd: '/prop god on', desc: '无敌', category: '功能' },
    { cmd: '/prop ns on', desc: '无限体力', category: '功能' },
    { cmd: '/prop ue on', desc: '无限能量', category: '功能' },
    { cmd: '/give 102 x1880200', desc: '冒险等阶升60级', category: '基础' },
    { cmd: '/give 121 x10900', desc: '尘歌壶信任值升到10级', category: '基础' },
    { cmd: '/prop wl 8', desc: '设置世界等级8', category: '基础' },
    { cmd: '/prop ut 12', desc: '一键解锁深渊12层', category: '功能' },
    { cmd: '/prop bp 50', desc: '设置纪行等级50', category: '基础' },
    { cmd: '/setfetterlevel 10', desc: '设置好感等级10', category: '功能' },
    { cmd: '/h', desc: '回血', category: '功能' },
    { cmd: '/kill 0', desc: '自杀', category: '危险' },
    { cmd: '/spawn 2008 x25', desc: '全队充能', category: '功能' },
    { cmd: '/pos', desc: '查看坐标', category: '功能' },
    { cmd: '/give all x9999 lv90 c6 r5 sl10', desc: '获取全部物品', category: '材料' },
    { cmd: '/kick', desc: '重登', category: '功能' },
    { cmd: '/clear wp lv90 r5 5*', desc: '清空武器', category: '危险' },
    { cmd: '/clear art lv20 5*', desc: '清空圣遗物', category: '危险' },
    { cmd: '/clear mat', desc: '清空材料', category: '危险' },
    { cmd: '/coop', desc: '进入多人游戏', category: '功能' },
    { cmd: '/tpall', desc: '[多人游戏]全体传送', category: '功能' },
    { cmd: '/list uid', desc: '玩家列表', category: '功能' },
    { cmd: '/say 大家好啊~', desc: '发送广播', category: '功能' },
    { cmd: '/prop fly on', desc: '风之翼', category: '功能' },
    { cmd: '/tp ~ ~100 ~', desc: '芜湖~起飞！', category: '功能' },
  ];

  // 去重
  const seen = new Set();
  const commands = existing.filter(c => {
    if (seen.has(c.cmd)) return false;
    seen.add(c.cmd);
    return true;
  });

  fs.writeFileSync(path.join(OUT, 'commands.json'), JSON.stringify(commands, null, 2));
  console.log(`✓ commands.json: ${commands.length} 条指令`);
}

// ===== 9. 成就 =====
function convertAchievements() {
  const content = fs.readFileSync(path.join(SOURCE_ZH, 'Achievement.txt'), 'utf-8');
  const achievements = [];
  content.split('\n').forEach(line => {
    line = line.trim().replace(/^\uFEFF/, '');
    if (!line || line.startsWith('//') || line.startsWith('#')) return;
    const idx = line.indexOf(':');
    if (idx < 0) return;
    const id = parseInt(line.substring(0, idx).trim());
    const rest = line.substring(idx + 1).trim();
    if (!id || rest.startsWith('[N/A]')) return;
    const dashIdx = rest.indexOf(' - ');
    let name, description;
    if (dashIdx > 0) {
      name = rest.substring(0, dashIdx).trim();
      description = rest.substring(dashIdx + 3).trim();
    } else {
      name = rest;
      description = '';
    }
    let category;
    if (id >= 86000) category = '联机';
    else if (id >= 85000) category = '其他';
    else if (id >= 84000) category = '纳塔';
    else if (id >= 83000) category = '枫丹';
    else if (id >= 82000) category = '须弥';
    else if (id >= 81500) category = '渊下宫';
    else if (id >= 81000) category = '稻妻';
    else if (id >= 80500) category = '层岩';
    else if (id >= 80000) category = '蒙德·璃月';
    else category = '其他';

    achievements.push({ id, name, description, category });
  });

  fs.writeFileSync(path.join(OUT, 'achievements.json'), JSON.stringify(achievements, null, 2));
  console.log(`✓ achievements.json: ${achievements.length} 个成就`);
}

// ===== 10. 物品（按类别拆分，过滤超大类别） =====
function convertItems() {
  const content = fs.readFileSync(path.join(SOURCE_ZH, 'Item.txt'), 'utf-8');
  const categories = {};
  let currentCat = '未分类';

  content.split('\n').forEach(line => {
    line = line.trim().replace(/^\uFEFF/, '');
    if (!line) return;
    if (line.startsWith('//')) {
      currentCat = line.replace(/^\/\/\s*/, '').trim();
      if (!categories[currentCat]) categories[currentCat] = [];
      return;
    }
    const idx = line.indexOf(':');
    if (idx < 0) return;
    const id = parseInt(line.substring(0, idx).trim());
    const name = line.substring(idx + 1).trim();
    if (!id || !name || name.startsWith('[N/A]')) return;
    if (currentCat === '角色' || currentCat === '武器') return;
    if (!categories[currentCat]) categories[currentCat] = [];
    categories[currentCat].push({ id, name });
  });

  // 过滤掉太大的类别（尘歌壶摆设3500+, 任务2600+, 七圣召唤1700+）
  const excludeCats = ['尘歌壶摆设', '尘歌壶室内摆设', '尘歌壶摆设套装', '任务', '七圣召唤-卡片-正面', '七圣召唤-卡片'];
  const filtered = {};
  for (const [cat, items] of Object.entries(categories)) {
    if (excludeCats.includes(cat)) continue;
    filtered[cat] = items;
  }

  fs.writeFileSync(path.join(OUT, 'items.json'), JSON.stringify(filtered, null, 2));
  const totalItems = Object.values(filtered).reduce((s, a) => s + a.length, 0);
  console.log(`✓ items.json: ${Object.keys(filtered).length} 个类别, ${totalItems} 个物品 (过滤前 ${Object.keys(categories).length} 类, ${Object.values(categories).reduce((s, a) => s + a.length, 0)} 个)`);
}

// ===== 11. 活动 =====
function convertActivities() {
  const content = fs.readFileSync(path.join(SOURCE_ZH, 'Activity.txt'), 'utf-8');
  const activities = [];
  let currentVersion = '';

  content.split('\n').forEach(line => {
    line = line.trim().replace(/^\uFEFF/, '');
    if (!line) return;
    if (line.startsWith('//')) {
      const ver = line.replace(/^\/\/\s*/, '').trim();
      if (/^\d+\.\d+$/.test(ver)) currentVersion = ver;
      return;
    }
    const idx = line.indexOf(':');
    if (idx < 0) return;
    const id = parseInt(line.substring(0, idx).trim());
    const name = line.substring(idx + 1).trim();
    if (!id || !name || name.startsWith('[N/A]')) return;
    // 从名称提取版本号
    const verMatch = name.match(/^(\d+\.\d+)/);
    const version = verMatch ? verMatch[1] : currentVersion;
    activities.push({ id, name, version });
  });

  fs.writeFileSync(path.join(OUT, 'activities.json'), JSON.stringify(activities, null, 2));
  console.log(`✓ activities.json: ${activities.length} 个活动`);
}

// ===== 12. 场景（扩展） =====
function convertScenesFull() {
  const sceneContent = fs.readFileSync(path.join(SOURCE_ZH, 'Scene.txt'), 'utf-8');
  const scenes = [];
  sceneContent.split('\n').forEach(line => {
    line = line.trim().replace(/^\uFEFF/, '');
    if (!line || line.startsWith('//') || line.startsWith('#')) return;
    const idx = line.indexOf(':');
    if (idx < 0) return;
    const id = parseInt(line.substring(0, idx).trim());
    const name = line.substring(idx + 1).trim();
    if (!id || !name || name.startsWith('[N/A]')) return;
    // 过滤掉 test 场景
    if (name.includes('(test)') || name.includes('Test') || name.includes('test')) return;
    let category;
    if (id < 2000) category = 'BigWorld探索';
    else if (id >= 2000 && id < 3000) category = '尘歌壶';
    else if (id >= 10000 && id < 20000) category = '主世界';
    else if (id >= 20000 && id < 30000) category = '剧情秘境';
    else if (id >= 30000 && id < 40000) category = '深境螺旋';
    else if (id >= 40000 && id < 50000) category = '教程';
    else category = '其他';
    scenes.push({ id, name, category });
  });

  // 保留现有带有传送坐标的场景
  const existingWithCmd = [
    { id: 20009, cmd: '/tp -77 -7 102 20009' },
    { id: 20106, cmd: '/tp 518 74 493 20106' },
    { id: 20115, cmd: '/tp 1 1 1 20115' },
    { id: 20125, cmd: '/tp 3 1 8 20125' },
    { id: 20154, cmd: '/tp -8 -58 -13 20154' },
    { id: 20179, cmd: '/tp 300 10 100 20179' },
    { id: 20199, cmd: '/tp 1 -5 6 20199' },
    { id: 20214, cmd: '/tp 121 528 843 20214' },
    { id: 20236, cmd: '/tp -3091 2 490 20236' },
  ];

  const cmdMap = {};
  existingWithCmd.forEach(e => { cmdMap[e.id] = e.cmd; });

  const finalScenes = scenes.map(s => ({
    ...s,
    ...(cmdMap[s.id] ? { cmd: cmdMap[s.id] } : {}),
  }));

  fs.writeFileSync(path.join(OUT, 'scenes.json'), JSON.stringify(finalScenes, null, 2));
  console.log(`✓ scenes.json: ${finalScenes.length} 个场景`);
}

// ===== 执行 =====
console.log('开始数据转换...\n');
ensureDir(OUT);

convertCharacters();
convertWeapons();
convertMonsters();
convertScenesFull();
convertGacha();
convertArtifacts();
convertStats();
convertCommands();
convertAchievements();
convertItems();
convertActivities();

console.log('\n所有数据转换完成！');
