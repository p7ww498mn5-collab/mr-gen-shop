require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ═══════ التخزين ═══════
const DB_FILE = path.join(__dirname, 'data.json');

function loadDB() {
    try {
        if (fs.existsSync(DB_FILE)) {
            return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        }
    } catch (e) {
        console.error('DB load error:', e.message);
    }
    return {};
}

function saveDB(db) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    } catch (e) {
        console.error('DB save error:', e.message);
    }
}

let database = loadDB();

// ═══════ Middleware: تحقق من API Key ═══════
function checkAuth(req, res, next) {
    const key = req.headers['x-api-key'] ||
                (req.headers['authorization'] || '').replace('Bearer ', '');
    if (!key || key !== API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

// ═══════ استقبال بيانات من السكربت ═══════
app.post('/api/player/stats', checkAuth, (req, res) => {
    const data = req.body;

    if (!data || !data.userId) {
        return res.status(400).json({ error: 'Missing userId' });
    }

    const id = String(data.userId);
    const existing = database[id] || {};

    database[id] = {
        userId: id,
        username: data.username || existing.username || 'Unknown',
        level: data.level != null ? data.level : (existing.level || 0),
        cash: data.cash != null ? data.cash : (existing.cash || 0),
        bank: data.bank != null ? data.bank : (existing.bank || 0),
        vehicles: Array.isArray(data.vehicles) ? data.vehicles : (existing.vehicles || []),
        lastSeen: Date.now(),
        history: existing.history || [],
    };

    // نخزن آخر 50 نقطة في الهيستوري
    database[id].history.push({
        t: Date.now(),
        level: database[id].level,
        cash: database[id].cash,
        bank: database[id].bank,
    });
    if (database[id].history.length > 50) {
        database[id].history.shift();
    }

    saveDB(database);
    res.json({ ok: true });
});

// ═══════ إرجاع كل الحسابات ═══════
app.get('/api/players', (req, res) => {
    const list = Object.values(database).map(p => ({
        userId: p.userId,
        username: p.username,
        level: p.level,
        cash: p.cash,
        bank: p.bank,
        vehicles: p.vehicles,
        lastSeen: p.lastSeen,
        online: (Date.now() - p.lastSeen) < 30000,
    }));
    list.sort((a, b) => b.lastSeen - a.lastSeen);
    res.json(list);
});

// ═══════ إحصائيات حساب معين ═══════
app.get('/api/player/:id', (req, res) => {
    const p = database[req.params.id];
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(p);
});

// ═══════ تشغيل ═══════
app.listen(PORT, () => {
    console.log(`══════════════════════════════════════════`);
    console.log(`  Hero Hub Tracker · Running on port ${PORT}`);
    console.log(`  Dashboard: http://localhost:${PORT}`);
    console.log(`  API Key: ${API_KEY.slice(0, 8)}...`);
    console.log(`══════════════════════════════════════════`);
});
