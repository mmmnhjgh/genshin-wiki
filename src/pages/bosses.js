import { createCmdCard, createSectionTitle } from '../utils/render.js';

const bosses = [
  {
    name: '裂空的魔龙',
    english: 'Stormterror',
    note: null,
    items: [
      { cmd: '/spawn 29010101 x1 lv200', desc: '风魔龙-初战test中才会行动，主线任务' },
      { cmd: '/spawn 29010102 x1 lv200', desc: '周本行动，重复一套攻击' },
      { cmd: '/spawn 29010103 x1 lv200', desc: '风魔龙-初战test中才会行动，主线任务' },
      { cmd: '/spawn 29010104 x1 lv200', desc: '周本行动，重复一套攻击，主线任务' },
    ],
  },
  {
    name: '北风的王狼',
    english: 'Lupus Boreas, Dominator of Wolves',
    note: '均无法被直接击杀',
    items: [
      { cmd: '/spawn 29020101 x1 lv200', desc: '' },
      { cmd: '/spawn 29020102 x1 lv200', desc: '' },
    ],
  },
  {
    name: '「公子」达达利亚',
    english: '[Childe]Tartaglia',
    note: null,
    items: [
      { cmd: '/spawn 29030101 x1 lv200', desc: '主线任务' },
      { cmd: '/spawn 29030102 x1 lv200', desc: '主线任务' },
      { cmd: '/spawn 29030103 x1 lv200', desc: '主线任务' },
      { cmd: '/spawn 29030104 x1 lv200', desc: '正常实机' },
      { cmd: '/spawn 29030105 x1 lv200', desc: '正常实机' },
      { cmd: '/spawn 29030106 x1 lv200', desc: '正常实机' },
    ],
  },
  {
    name: '若陀龙王',
    english: 'Azhdaha',
    note: null,
    items: [
      { cmd: '/spawn 29040101 x1 lv200', desc: '雷火' },
      { cmd: '/spawn 29040102 x1 lv200', desc: '冰火' },
      { cmd: '/spawn 29040103 x1 lv200', desc: '雷水' },
      { cmd: '/spawn 29040104 x1 lv200', desc: '冰水' },
      { cmd: '/spawn 29040111 x1 lv200', desc: '传说任务' },
    ],
  },
  {
    name: '「女士」焚尽的炽炎魔女',
    english: '[La Signora]Crimson Witch of Embers',
    note: null,
    items: [
      { cmd: '/spawn 29050101 x1 lv200', desc: '主线任务' },
      { cmd: '/spawn 29050102 x1 lv200', desc: '主线任务' },
      { cmd: '/spawn 29050103 x1 lv200', desc: '正常实机' },
      { cmd: '/spawn 29050104 x1 lv200', desc: '正常实机' },
    ],
  },
  {
    name: '祸津御建鸣神命',
    english: 'Magatsu Mitake Narukami no Mikoto',
    note: null,
    items: [
      { cmd: '/spawn 29060101 lv200 x1', desc: '充电宝，召唤出来恢复元素能量，主线任务' },
      { cmd: '/spawn 29060102 x1 lv200', desc: '主线任务' },
      { cmd: '/spawn 29060201 x1 lv200', desc: '传说任务' },
      { cmd: '/spawn 29060202 x1 lv200', desc: '传说任务' },
      { cmd: '/spawn 29060203 x1 lv200', desc: '正常实机' },
    ],
  },
  {
    name: '「正机之神」七叶寂照秘密主',
    english: 'Shouki no Kami',
    note: '各种环境下均无法正常行动',
    items: [
      { cmd: '/spawn 29070101 x1 lv200', desc: '主线任务' },
      { cmd: '/spawn 29070102 x1 lv200', desc: '特殊模型ID' },
      { cmd: '/spawn 29070103 x1 lv200', desc: '正常实机' },
      { cmd: '/spawn 29070104 x1 lv200', desc: '正常实机' },
      { cmd: '/spawn 29070105 x1 lv200', desc: '主线任务' },
      { cmd: '/spawn 29070106 x1 lv200', desc: '主线任务3.3' },
    ],
  },
  {
    name: '阿佩普的绿洲守望者',
    english: 'Guardian of Apep\'s Oasis',
    note: null,
    items: [
      { cmd: '/spawn 29080101 x1 lv200', desc: '' },
      { cmd: '/spawn 29080102 x1 lv200', desc: '' },
      { cmd: '/spawn 29080103 x1 lv200', desc: '' },
      { cmd: '/spawn 29080104 x1 lv200', desc: '' },
    ],
  },
  {
    name: '吞星之鲸',
    english: 'All-Devouring Narwhal',
    note: '周本环境才能显示，否则会在地表下面生成',
    items: [
      { cmd: '/spawn 29090101 x1 lv200', desc: '正常实机' },
      { cmd: '/spawn 29090102 x1 lv200', desc: '主线任务' },
      { cmd: '/spawn 29090201 x1 lv200', desc: '正常实机' },
      { cmd: '/spawn 29090202 x1 lv200', desc: '主线任务' },
    ],
  },
  {
    name: '「仆人」两界之火的遗烬',
    english: '[The Knave]Cinder of Two Worlds\' Flames',
    note: null,
    items: [
      { cmd: '/spawn 29100101 x1 lv200', desc: '周本环境才会行动，传说任务' },
      { cmd: '/spawn 29100102 x1 lv200', desc: '周本环境才会行动，正常实机' },
      { cmd: '/spawn 29100103 x1 lv200', desc: '特殊模型ID，传说任务' },
      { cmd: '/spawn 29100104 x1 lv200', desc: '完整攻击模型，正常实机' },
    ],
  },
  {
    name: '蚀灭的源焰之主',
    english: 'Lord of Eroded Primal Fire',
    note: '在周本外过一段时间会消失',
    items: [
      { cmd: '/spawn 29110101 x1 lv200', desc: '主线任务' },
      { cmd: '/spawn 29110102 x1 lv200', desc: '正常实机' },
    ],
  },
  {
    name: '门扉前的弈局',
    english: 'The Game Before the Gate',
    note: null,
    items: [
      { cmd: '/spawn 29120101 x1 lv200', desc: '' },
      { cmd: '/spawn 29120102 x1 lv200', desc: '' },
      { cmd: '/spawn 29120201 x1 lv200', desc: '' },
      { cmd: '/spawn 29120202 x1 lv200', desc: '' },
    ],
  },
  {
    name: '「博士」赝月的异端者',
    english: '[The Doctor]Heretic of the False Moon',
    note: '需要在周本才正常行动，有些召唤出来就消失',
    items: [
      { cmd: '/spawn 29130101 x1 lv200', desc: '' },
      { cmd: '/spawn 29130201 x1 lv200', desc: '主线任务' },
      { cmd: '/spawn 29130202 x1 lv200', desc: '正常实机' },
      { cmd: '/spawn 29130301 x1 lv200', desc: '正常实机' },
      { cmd: '/spawn 29130302 x1 lv200', desc: '正常实机' },
      { cmd: '/spawn 29130401 x1 lv200', desc: '主线任务' },
    ],
  },
  {
    name: '「猎月人」渎死之罪',
    english: 'Rächer of Solnari',
    note: null,
    items: [
      { cmd: '/spawn 29140101 x1 lv200', desc: '主线任务' },
    ],
  },
];

export function renderBosses() {
  const frag = document.createDocumentFragment();
  frag.appendChild(createSectionTitle('值得铭记的强敌'));

  const noteDiv = document.createElement('div');
  noteDiv.className = 'boss-note';
  noteDiv.textContent = '颜色意义译释：特别/尤其注意 | 来源/出处 | 和官服一样的周本 | 效果描述';
  frag.appendChild(noteDiv);

  bosses.forEach(boss => {
    const title = document.createElement('div');
    title.className = 'boss-title';
    title.textContent = boss.name;
    frag.appendChild(title);

    if (boss.english) {
      const eng = document.createElement('div');
      eng.className = 'boss-english';
      eng.textContent = boss.english;
      frag.appendChild(eng);
    }

    if (boss.note) {
      const note = document.createElement('div');
      note.className = 'boss-note';
      note.textContent = `（${boss.note}）`;
      frag.appendChild(note);
    }

    boss.items.forEach(item => {
      frag.appendChild(createCmdCard(item.cmd, item.desc ? `（${item.desc}）` : ''));
    });
  });

  // 致谢
  const thanks = document.createElement('div');
  thanks.className = 'thanks-note';
  thanks.textContent = '感谢由@梦里 Sleeping @嗨，想我了吗♪ @蓝焰 等大佬提供的周本数据ID与解惑！';
  frag.appendChild(thanks);

  return frag;
}
