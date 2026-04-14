import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 白名单：允许访问的数据文件
const ALLOWED_TYPES = [
  'characters', 'weapons', 'bosses', 'scenes', 'gacha',
  'commands', 'artifacts', 'stats',
];

// 数据目录
const DATA_DIR = path.join(__dirname, 'src', 'data');

// 验证文件路径安全性
function safePath(type) {
  if (!ALLOWED_TYPES.includes(type)) return null;
  const filePath = path.join(DATA_DIR, `${type}.json`);
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(DATA_DIR)) return null;
  return resolved;
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// 数据读取API
app.get('/api/data/:type', (req, res) => {
  const filePath = safePath(req.params.type);
  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Data file not found' });
  }
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Invalid JSON' });
  }
});

// 数据写入API
app.put('/api/data/:type', (req, res) => {
  const filePath = safePath(req.params.type);
  if (!filePath) {
    return res.status(400).json({ error: 'Invalid data type' });
  }
  try {
    // 验证 JSON 格式
    const json = JSON.stringify(req.body, null, 2);
    JSON.parse(json); // 确保是有效 JSON
    fs.writeFileSync(filePath, json, 'utf-8');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 管理界面
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
});
