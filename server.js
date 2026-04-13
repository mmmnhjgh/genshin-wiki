import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// 数据读取API
app.get('/api/data/:type', (req, res) => {
  const filePath = path.join(__dirname, 'src', 'data', `${req.params.type}.json`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Data file not found' });
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  res.json(data);
});

// 数据写入API（管理界面用）
app.put('/api/data/:type', (req, res) => {
  const filePath = path.join(__dirname, 'src', 'data', `${req.params.type}.json`);
  try {
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2), 'utf-8');
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
