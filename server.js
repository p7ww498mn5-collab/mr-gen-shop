require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const app = express();
app.disable('x-powered-by');
const PORT = process.env.PORT || 5000;

// ========== CONFIG - تقدر تعدلها من قائمة الادمن في الموقع ==========
let ZEROPOINT_API_KEY = process.env.ZEROPOINT_API_KEY || 'ZP_CookieChecker_Xn4F7AsMGgB7u73FFFxSF7tPojOvS5f2';
let ZAPZONEX_API_KEY = process.env.ZAPZONEX_API_KEY || '22b12d4b2efe0cf3.4370bfd721b26b1d1ec51e74d1e45899';
let ZAPZONEX_PLACE_ID = process.env.ZAPZONEX_PLACE_ID || '2753915549';
let DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1541445184976330813/H8sHiu5UZ7qSqET7fq9od4AkqCIMtaqWbu6YOdHnL9IsrHwyQ0y6YCpwbCx7y02852Ul';
const SESSION_SECRET = process.env.SESSION_SECRET || 'mr-checker-secret-change-me';
let DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || '1520933782667001856';
let DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || '';
let DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || `https://mr-gen.shop:${PORT}/auth/discord/callback`;
let BOT_TOKEN = process.env.BOT_TOKEN || process.env.DISCORD_BOT_TOKEN || '';
let ADMIN_IDS = (process.env.ADMIN_IDS || '1520933782667001856').split(',').map(s=>s.trim()).filter(Boolean);
// ===== Wallet / Recharge config =====
let RECEIVE_IBAN = process.env.RECEIVE_IBAN || '';
let RECEIVE_NAME = process.env.RECEIVE_NAME || '';
let RECEIVE_BRAG_NUMBER = process.env.RECEIVE_BRAG_NUMBER || '';
let CAPTCHA_COST = parseFloat(process.env.CAPTCHA_COST || String(2.5/30)) || (2.5/30);
const CAPTCHA_MIN_ACCOUNTS = 30;

// تحميل config محفوظ من الادمن (لو موجود)
const CONFIG_PATH = path.join(__dirname, 'config.json');
try {
    if (fs.existsSync(CONFIG_PATH)) {
        const saved = JSON.parse(fs.readFileSync(CONFIG_PATH,'utf8'));
if (saved.ZEROPOINT_API_KEY) ZEROPOINT_API_KEY = saved.ZEROPOINT_API_KEY;
if (saved.ZAPZONEX_API_KEY) ZAPZONEX_API_KEY = saved.ZAPZONEX_API_KEY;
if (saved.ZAPZONEX_PLACE_ID) ZAPZONEX_PLACE_ID = saved.ZAPZONEX_PLACE_ID;
        if (saved.RECEIVE_IBAN) RECEIVE_IBAN = saved.RECEIVE_IBAN;
        if (saved.RECEIVE_NAME) RECEIVE_NAME = saved.RECEIVE_NAME;
        if (saved.RECEIVE_BRAG_NUMBER) RECEIVE_BRAG_NUMBER = saved.RECEIVE_BRAG_NUMBER;
        if (saved.CAPTCHA_COST) CAPTCHA_COST = parseFloat(saved.CAPTCHA_COST) || CAPTCHA_COST;
        if (saved.DISCORD_WEBHOOK_URL) DISCORD_WEBHOOK_URL = saved.DISCORD_WEBHOOK_URL;
        if (saved.DISCORD_CLIENT_SECRET) { DISCORD_CLIENT_SECRET = saved.DISCORD_CLIENT_SECRET; process.env.DISCORD_CLIENT_SECRET = saved.DISCORD_CLIENT_SECRET; }
        if (saved.ADMIN_IDS) ADMIN_IDS = saved.ADMIN_IDS;
        if (saved.BOT_TOKEN) BOT_TOKEN = saved.BOT_TOKEN;
        console.log('📂 تم تحميل config.json');
    }
    // جرب تحميل من bot/.env لو ما لقى
    if (!BOT_TOKEN) {
        try {
            const botEnvPath = path.join(__dirname, 'bot', '.env');
            if (fs.existsSync(botEnvPath)) {
                const botEnv = fs.readFileSync(botEnvPath,'utf8');
                const m = botEnv.match(/BOT_TOKEN\s*=\s*(.+)/);
                if (m && m[1].trim()) BOT_TOKEN = m[1].trim();
            }
        } catch(e){}
    }
    if (BOT_TOKEN) console.log('🤖 BOT_TOKEN محمل');
    else console.warn('⚠️ BOT_TOKEN غير موجود — الخاص لن يرسل');
} catch(e){ console.warn('config load failed', e.message); }

function saveConfig(obj){
    try { fs.writeFileSync(CONFIG_PATH, JSON.stringify(obj, null, 2)); } catch(e){ console.error('save config failed', e.message); }
    // حاول تحديث bot/.env أيضاً
    try {
        const botEnv = path.join(__dirname, 'bot', '.env');
        if (fs.existsSync(path.join(__dirname, 'bot'))) {
            let content = fs.existsSync(botEnv) ? fs.readFileSync(botEnv,'utf8') : '';
            if (obj.BOT_TOKEN) {
                if (content.includes('BOT_TOKEN=')) content = content.replace(/BOT_TOKEN=.*/,'BOT_TOKEN='+obj.BOT_TOKEN);
                else content += '\nBOT_TOKEN='+obj.BOT_TOKEN;
            }
            if (obj.DISCORD_WEBHOOK_URL) {
                if (content.includes('WEBHOOK_URL=')) content = content.replace(/WEBHOOK_URL=.*/,'WEBHOOK_URL='+obj.DISCORD_WEBHOOK_URL);
                else content += '\nWEBHOOK_URL='+obj.DISCORD_WEBHOOK_URL;
            }
            fs.writeFileSync(botEnv, content);
        }
    } catch(e){}
}

function isAdminUser(user){ if(!user||!user.id) return false; if(!ADMIN_IDS.length) return false; return ADMIN_IDS.includes(String(user.id)); }

async function sendDM(userId, embed, fileContent, filename) {
    if (!BOT_TOKEN) { console.warn('[DM] BOT_TOKEN missing'); return false; }
    if (!userId) return false;
    try {
        const dmRes = await axios.post('https://discord.com/api/users/@me/channels', { recipient_id: String(userId) }, { headers: { Authorization: `Bot ${BOT_TOKEN}`, 'Content-Type': 'application/json' }, timeout: 10000 });
        const channelId = dmRes.data?.id;
        if (!channelId) return false;
        if (fileContent) {
            const form = new FormData();
            form.append('payload_json', JSON.stringify({ embeds: [embed] }));
            const blob = new Blob([fileContent], { type: 'text/plain' });
            form.append('file', blob, filename || 'salim.txt');
            await axios.post(`https://discord.com/api/channels/${channelId}/messages`, form, { headers: { Authorization: `Bot ${BOT_TOKEN}` }, timeout: 15000 });
        } else {
            await axios.post(`https://discord.com/api/channels/${channelId}/messages`, { embeds: [embed] }, { headers: { Authorization: `Bot ${BOT_TOKEN}`, 'Content-Type': 'application/json' }, timeout: 10000 });
        }
        return true;
    } catch(e){ console.error('[DM] failed:', e.response?.data || e.message); return false; }
}
const userHistoryStore = new Map();
// ===== Registered Discord users =====
const usersStore = new Map();
const USERS_PATH = path.join(__dirname, 'users.json');
function loadUsers(){ try{ if (fs.existsSync(USERS_PATH)) { const arr = JSON.parse(fs.readFileSync(USERS_PATH,'utf8')); if (Array.isArray(arr)) arr.forEach(function(u){ usersStore.set(String(u.id), u); }); } }catch(e){ console.warn('users load failed', e.message); } }
function saveUsers(){ try{ fs.writeFileSync(USERS_PATH, JSON.stringify(Array.from(usersStore.values()), null, 2)); }catch(e){ console.error('save users failed', e.message); } }
function saveUser(u){ if(!u||!u.id) return; usersStore.set(String(u.id), { id:String(u.id), username:u.username, global_name:u.global_name||u.username, avatar:u.avatar||null, email:u.email||null, banned: !!u.banned }); saveUsers(); }
loadUsers();
function addUserHistory(userId, entry){
    if(!userId) return;
    if(!userHistoryStore.has(userId)) userHistoryStore.set(userId, []);
    const arr=userHistoryStore.get(userId);
    arr.unshift(entry);
    if(arr.length>100) arr.splice(100);
    try{ const file=require('path').join(__dirname,'user_history.json'); const obj=Object.fromEntries(userHistoryStore); require('fs').writeFileSync(file, JSON.stringify(obj,null,2)); }catch(e){}
}
function getUserHistory(userId){ return userHistoryStore.get(userId)||[]; }

// ===== Wallets & Recharges =====
const walletStore = new Map();
const rechargeStore = new Map();
// رصد حالة مهام حل الكابتشا (تعرض للواجهة: pending/processing/completed/failed/cancelled)
const solveJobs = new Map();
const WALLETS_PATH = path.join(__dirname, 'wallets.json');
const RECHARGES_PATH = path.join(__dirname, 'recharges.json');
function loadWallets(){
    try{ if (fs.existsSync(WALLETS_PATH)) { const obj = JSON.parse(fs.readFileSync(WALLETS_PATH,'utf8')); for (const [k,v] of Object.entries(obj)) walletStore.set(k, v); } }catch(e){ console.warn('wallets load failed', e.message); }
}
function saveWallets(){
    try{ fs.writeFileSync(WALLETS_PATH, JSON.stringify(Object.fromEntries(walletStore), null, 2)); }catch(e){ console.error('save wallets failed', e.message); }
}
function loadRecharges(){
    try{ if (fs.existsSync(RECHARGES_PATH)) { const arr = JSON.parse(fs.readFileSync(RECHARGES_PATH,'utf8')); if (Array.isArray(arr)) arr.forEach(r => rechargeStore.set(r.id, r)); } }catch(e){ console.warn('recharges load failed', e.message); }
}
function saveRecharges(){
    try{ fs.writeFileSync(RECHARGES_PATH, JSON.stringify(Array.from(rechargeStore.values()), null, 2)); }catch(e){ console.error('save recharges failed', e.message); }
}
function getWallet(userId){
    if (!walletStore.has(userId)) walletStore.set(userId, { balance: 0 });
    return walletStore.get(userId);
}
function creditWallet(userId, amount){ const w = getWallet(userId); w.balance = (Number(w.balance)||0) + Number(amount); saveWallets(); return w.balance; }
function debitWallet(userId, amount){ const w = getWallet(userId); if ((Number(w.balance)||0) < Number(amount)) return false; w.balance = (Number(w.balance)||0) - Number(amount); saveWallets(); return true; }
function addRecharge(rec){ rechargeStore.set(rec.id, rec); saveRecharges(); }
async function sendDiscordImage(webhookUrl, embed, buffer, filename){
    if (!webhookUrl) webhookUrl = DISCORD_WEBHOOK_URL;
    if (!webhookUrl || !buffer) return;
    try{
        const form = new FormData();
        form.append('payload_json', JSON.stringify({ username:'MR CHECKER', avatar_url:'https://cdn.discordapp.com/embed/avatars/0.png', embeds:[embed] }));
        form.append('file', new Blob([buffer], { type:'image/png' }), filename||'receipt.png');
        await axios.post(webhookUrl, form, { timeout: 15000 });
    }catch(e){ console.error('[Discord Image]', e.message); }
}
loadWallets(); loadRecharges();
try{
    const file=require('path').join(__dirname,'user_history.json');
    if(require('fs').existsSync(file)){
        const obj=JSON.parse(require('fs').readFileSync(file,'utf8'));
        for(const [k,v] of Object.entries(obj)) userHistoryStore.set(k,v);
        console.log('📂 Loaded per-user history for', userHistoryStore.size, 'users');
    }
}catch(e){}
function requireLogin(req,res,next){ if(!req.session.user) return res.status(401).json({ status:'error', message:'يجب تسجيل الدخول بالديسكورد أولاً' }); var bu = usersStore.get(String(req.session.user.id)); if (bu && bu.banned) return res.status(403).json({ status:'error', message:'تم حظرك من استخدام الخدمة' }); next(); }

// ========== MIDDLEWARE ==========
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com", "fonts.googleapis.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "cdn.discordapp.com", "avatars.githubusercontent.com"],
            fontSrc: ["'self'", "fonts.gstatic.com", "cdnjs.cloudflare.com", "data:"],
            connectSrc: ["'self'", "discord.com"],
        },
    },
    frameguard: { action: 'deny' }, noSniff: true, xssFilter: true,
}));
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// ===== Extra security headers =====
app.use((req,res,next)=>{
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('X-Download-Options','noopen');
  next();
});
// ===== Persistent file-based session store (survives restarts) =====
const SESSIONS_FILE = path.join(__dirname, 'sessions.json');
let __sessions = {};
try { __sessions = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8')); } catch (e) {}
function __persistSessions(){ try { fs.writeFileSync(SESSIONS_FILE, JSON.stringify(__sessions)); } catch (e) {} }
class FileSessionStore extends session.Store {
  get(sid, cb){ const s = __sessions[sid]; if (!s) return cb(null, null); const exp = s.cookie && s.cookie.expires; if (exp && new Date(exp) < new Date()){ delete __sessions[sid]; __persistSessions(); return cb(null, null); } cb(null, s); }
  set(sid, sess, cb){ __sessions[sid] = sess; __persistSessions(); cb(null); }
  destroy(sid, cb){ delete __sessions[sid]; __persistSessions(); cb(null); }
  touch(sid, sess, cb){ __sessions[sid] = sess; cb(null); }
}
app.use(session({
    store: new FileSessionStore(),
    secret: SESSION_SECRET, resave: false, saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 1000*60*60*24*7, sameSite: 'lax' }
}));
let availableSolvers = 798;

// Rate limiting
const apiLimiter = rateLimit({ windowMs: 60*1000, max: 60, message: { error: 'Too many requests' } });
const submitLimiter = rateLimit({ windowMs: 20*1000, max: 1, message: { error: 'Rate limited 20s' } });
const globalLimiter = rateLimit({ windowMs: 60*1000, max: 300, message: { error: 'Too many requests' } });
app.use('/api', globalLimiter);

// ===== Discord Webhook Helpers =====
async function sendWebhook({ title, description, color, fields, username, webhookUrl, components, thumbnail }) {
    const url = webhookUrl || DISCORD_WEBHOOK_URL;
    if (!url) return;
    try {
        const payload = {
            username: username || 'MR CHECKER',
            avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
            embeds: [{ title: title||'MR CHECKER', description: description||'', color: color||0x8b5cf6, fields: fields||[], timestamp: new Date().toISOString(), footer: { text: 'MR CHECKER • mr.cartier.gg' }, thumbnail: thumbnail?{url:thumbnail}:undefined }]
        };
        if (components) payload.components = components;
        await axios.post(url, payload, { timeout: 8000 });
    } catch(e){ console.error('[Webhook]', e.message); }
}
async function sendWebhookWithFile(webhookUrl, embed, fileContent, filename){
    if (!webhookUrl) webhookUrl = DISCORD_WEBHOOK_URL;
    if (!webhookUrl) return;
    try {
        const form = new FormData();
        form.append('payload_json', JSON.stringify({ username: 'MR CHECKER', avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png', embeds: [embed] }));
        const blob = new Blob([fileContent], { type: 'text/plain' });
        form.append('file', blob, filename||'salim.txt');
        await axios.post(webhookUrl, form, { timeout: 15000 });
    } catch(e){
        console.error('[Webhook File]', e.message);
        try{ await sendWebhook({ ...embed, webhookUrl }); }catch(_){}
    }
}

// ========== DISCORD OAUTH - مربوط على الموقع ==========
app.get('/auth/discord', (req,res)=>{
    if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
        return res.status(500).send(`<html dir="rtl" style="font-family:Tajawal,system-ui;background:#09090b;color:#e5e7eb;padding:40px"><h2 style="color:#f87171">Discord OAuth غير مُعد</h2><p>ضع في .env:</p><pre style="background:#1a1a1e;padding:12px;border-radius:8px">DISCORD_CLIENT_ID=1520933782667001856
DISCORD_CLIENT_SECRET=ضع_السيكرت_هنا
DISCORD_REDIRECT_URI=http://localhost:${PORT}/auth/discord/callback
ADMIN_IDS=1520933782667001856</pre><p>جيب السيكرت من https://discord.com/developers/applications → OAuth2 → Client Secret</p><a href="/" style="color:#8b5cf6">عودة</a></html>`);
    }
    const url = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify%20email`;
    res.redirect(url);
});
app.get('/auth/discord/callback', async (req,res)=>{
    const code = req.query.code;
    if (!code) return res.status(400).send('No code');
    try {
        const tokenRes = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: DISCORD_CLIENT_ID, client_secret: DISCORD_CLIENT_SECRET, grant_type: 'authorization_code', code: String(code), redirect_uri: DISCORD_REDIRECT_URI, scope: 'identify email'
        }), { headers: {'Content-Type':'application/x-www-form-urlencoded'} });
        const accessToken = tokenRes.data.access_token;
        const userRes = await axios.get('https://discord.com/api/users/@me', { headers: { Authorization: `Bearer ${accessToken}` } });
        const user = userRes.data;
        const tempUser = { id: String(user.id), username: user.username, discriminator: user.discriminator, avatar: user.avatar?`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`:null, email: user.email||null, global_name: user.global_name||user.username };
        req.session.user = tempUser; req.session.isAdmin = isAdminUser(tempUser);
        saveUser(tempUser);
        res.redirect('/');
    } catch(err){
        console.error('[OAuth]', err.response?.data||err.message);
        res.status(500).send(`<h3>OAuth failed</h3><pre>${JSON.stringify(err.response?.data||err.message,null,2)}</pre><a href="/">Back</a>`);
    }
});
app.get('/api/me', (req,res)=>{
    if (!req.session.user) return res.json({ authenticated:false, user:null, isAdmin:false });
    res.json({ authenticated:true, user:req.session.user, isAdmin: !!req.session.isAdmin });
});
app.post('/api/logout', (req,res)=>{ req.session.destroy(()=>{ res.clearCookie('connect.sid'); res.json({ok:true}); }); });

function requireAdmin(req,res,next){ if(!req.session.user||!req.session.isAdmin) return res.status(403).json({error:'Admin only'}); next(); }

// ===== Admin Config API - تعديل التوكنات من قائمة الادمن =====
app.get('/api/admin/config', requireAdmin, (req,res)=>{
    res.json({
        ZEROPOINT_API_KEY: ZEROPOINT_API_KEY ? ZEROPOINT_API_KEY.slice(0,8)+'...'+ZEROPOINT_API_KEY.slice(-4) : '',
        ZAPZONEX_API_KEY: ZAPZONEX_API_KEY ? ZAPZONEX_API_KEY.slice(0,8)+'...'+ZAPZONEX_API_KEY.slice(-4) : '',
        zapzonexPlaceId: ZAPZONEX_PLACE_ID,
        DISCORD_WEBHOOK_URL: DISCORD_WEBHOOK_URL || '',
        DISCORD_CLIENT_ID, DISCORD_REDIRECT_URI, ADMIN_IDS,
        RECEIVE_IBAN, RECEIVE_NAME, RECEIVE_BRAG_NUMBER, CAPTCHA_COST,
        hasClientSecret: !!DISCORD_CLIENT_SECRET
    });
});
app.post('/api/admin/config', requireAdmin, (req,res)=>{
    const { ZEROPOINT_API_KEY: zp, ZAPZONEX_API_KEY: zz, ZAPZONEX_PLACE_ID: zplace, DISCORD_WEBHOOK_URL: wh, DISCORD_CLIENT_SECRET: cs, ADMIN_IDS: aids, BOT_TOKEN, RECEIVE_IBAN: iban, RECEIVE_NAME: rname, RECEIVE_BRAG_NUMBER: brag, CAPTCHA_COST: cost } = req.body;
    const updated = {};
    if (typeof zp === 'string' && zp.trim()) { ZEROPOINT_API_KEY = zp.trim(); updated.ZEROPOINT_API_KEY = zp.trim(); }
    if (typeof zz === 'string' && zz.trim()) { ZAPZONEX_API_KEY = zz.trim(); updated.ZAPZONEX_API_KEY = zz.trim(); }
    if (typeof zplace === 'string' && zplace.trim()) { ZAPZONEX_PLACE_ID = zplace.trim(); updated.ZAPZONEX_PLACE_ID = zplace.trim(); }
    if (typeof wh === 'string' && wh.trim()) { DISCORD_WEBHOOK_URL = wh.trim(); updated.DISCORD_WEBHOOK_URL = wh.trim(); }
    if (typeof cs === 'string' && cs.trim()) { DISCORD_CLIENT_SECRET = cs.trim(); process.env.DISCORD_CLIENT_SECRET = cs.trim(); updated.DISCORD_CLIENT_SECRET = cs.trim(); }
    if (typeof aids === 'string') { ADMIN_IDS = aids.split(',').map(s=>s.trim()).filter(Boolean); updated.ADMIN_IDS = ADMIN_IDS; }
    else if (Array.isArray(aids)) { ADMIN_IDS = aids.map(String); updated.ADMIN_IDS = ADMIN_IDS; }
    if (BOT_TOKEN && typeof BOT_TOKEN === 'string' && BOT_TOKEN.trim()) updated.BOT_TOKEN = BOT_TOKEN.trim();
    if (typeof iban === 'string') { RECEIVE_IBAN = iban.trim(); updated.RECEIVE_IBAN = RECEIVE_IBAN; }
    if (typeof rname === 'string') { RECEIVE_NAME = rname.trim(); updated.RECEIVE_NAME = RECEIVE_NAME; }
    if (typeof brag === 'string') { RECEIVE_BRAG_NUMBER = brag.trim(); updated.RECEIVE_BRAG_NUMBER = RECEIVE_BRAG_NUMBER; }
    if (cost !== undefined && cost !== null && !isNaN(parseFloat(cost))) { CAPTCHA_COST = parseFloat(cost) || 0; updated.CAPTCHA_COST = CAPTCHA_COST; }
    // احفظ
    try {
        const cur = fs.existsSync(CONFIG_PATH) ? JSON.parse(fs.readFileSync(CONFIG_PATH,'utf8')) : {};
        saveConfig({ ...cur, ...updated });
    } catch(e){}
    res.json({ ok:true, saved: Object.keys(updated) });
});

app.get('/api/admin/stats', requireAdmin, (req,res)=>{
    res.json({ admin:req.session.user, serverTime:new Date().toISOString(), zeroPointKeySet:!!ZEROPOINT_API_KEY, zapzonexKeySet:!!ZAPZONEX_API_KEY, discordConfigured:!!(DISCORD_CLIENT_ID&&DISCORD_CLIENT_SECRET), webhookSet:!!DISCORD_WEBHOOK_URL });
});

// ========== MR Solver solver helpers ==========
const ZAPZONEX_BASE = 'https://api.zapzonex.net/v1';
function zapHeaders(){ return { 'Authorization': 'Bearer ' + ZAPZONEX_API_KEY, 'Content-Type': 'application/json' }; }

async function checkSolverCredits(){
    try{
        const r = await axios.get(ZAPZONEX_BASE + '/balance', { headers: zapHeaders(), timeout: 10000 });
        const cp = Number(r.data && r.data.balance_cp || 0);
        return { success:true, balance: cp/100, balanceCp: cp, data: r.data };
    }catch(e){ return {success:false, error:e.message}; }
}

// يحل حساب واحد عبر MR Solver /v1/solve ويرجع نتيجة موحّدة
async function zapSolveOne(accountLine, premium){
    const parts = String(accountLine).split(':');
    const cookie = parts.length >= 3 ? parts.slice(2).join(':') : (parts[0] || '');
    const username = parts.length >= 1 ? parts[0] : 'unknown';
    const qs = premium ? '?priority=premium' : '';
    try{
        const r = await axios.post(ZAPZONEX_BASE + '/solve' + qs, { cookie: cookie, placeId: ZAPZONEX_PLACE_ID, username: username, api_key: ZAPZONEX_API_KEY }, { headers: zapHeaders(), timeout: 95000 });
        const d = r.data || {};
        const status = d.status;
        if (d.success === true && status === 'CAPTCHA_SUCCESS') return { ok:true, solved:true, raw: accountLine };
        if (d.success === true && status === 'NO_CAPTCHA') return { ok:true, solved:false, skip:true, raw: accountLine };
        if (d.success === false && ['CAPTCHA_FAILED','SOLVER_ERROR','SERVER_BUSY'].indexOf(status) !== -1) return { ok:true, solved:false, failed:true, raw: accountLine };
        return { ok:false, fatal:true, error: (d.error || status || 'MR Solver error'), raw: accountLine };
    }catch(e){
        let msg = e.message, code = e.response && e.response.status;
        if (e.response && e.response.data) msg = e.response.data.error || e.response.data.status || e.response.data.message || msg;
        return { ok:false, fatal:true, error: msg, raw: accountLine };
    }
}

// ========== API ENDPOINTS ==========
app.post('/api/check', apiLimiter, submitLimiter, requireLogin, async (req, res) => {
    const { accounts } = req.body;
    if (!accounts || !Array.isArray(accounts) || accounts.length === 0) return res.status(400).json({ status: 'error', message: 'No accounts' });
    if (accounts.length > 500) return res.status(400).json({ status: 'error', message: 'الحد الأقصى 500 حساب لكل طلب' });
    try {
        let allResults=[]; let totalAlive=0,totalDead=0,totalBanned=0,totalFacelock=0,totalCaptcha=0;
        const batchSize=100; const batches=[]; for(let i=0;i<accounts.length;i+=batchSize) batches.push(accounts.slice(i,i+batchSize));
        for(let b=0;b<batches.length;b++){
            const batch=batches[b];
            const cookieLines=batch.map(function(acc){ if(acc.cookie) return (acc.username||'unknown')+':'+(acc.password||'')+':'+acc.cookie; return acc.raw||''; }).filter(function(line){return line.trim();});
            if(!cookieLines.length) continue;
            const cookiesText=cookieLines.join('\n');
            const response=await axios.post('https://zeropoint.to/api/cookie-checker-api/submit',{cookies:cookiesText},{headers:{'X-API-Key':ZEROPOINT_API_KEY,'Content-Type':'application/json'},timeout:60000});
            const sessionId=response.data?.session_id; if(!sessionId) continue;
            let statusResult; let attempts=0; const maxAttempts=60;
            while(attempts<maxAttempts){
                await new Promise(function(resolve){setTimeout(resolve,2000);});
                const statusResponse=await axios.get(`https://zeropoint.to/api/cookie-checker-api/status/${sessionId}`,{headers:{'X-API-Key':ZEROPOINT_API_KEY},timeout:10000});
                statusResult=statusResponse.data;
                if(statusResult?.status==='completed'||statusResult?.status==='error') break;
                attempts++;
            }
            if(!statusResult||statusResult.status!=='completed') continue;
            const resultTypes=['alive','dead','face_lock','captcha_lock','ban_warn']; const downloadedResults={};
            for(var i=0;i<resultTypes.length;i++){
                var type=resultTypes[i];
                try{
                    const downloadResponse=await axios.get(`https://zeropoint.to/api/cookie-checker-api/download/${sessionId}/${type}`,{headers:{'X-API-Key':ZEROPOINT_API_KEY},timeout:15000,responseType:'text'});
                    if(downloadResponse.data) downloadedResults[type]=downloadResponse.data.split('\n').filter(function(line){return line.trim();});
                }catch(e){}
            }
            for(var typeKey in downloadedResults){
                if(downloadedResults.hasOwnProperty(typeKey)){
                    var lines=downloadedResults[typeKey];
                    for(var j=0;j<lines.length;j++){
                        var line=lines[j]; var username='unknown'; var cookie=''; var parts=line.split(':'); if(parts.length>=1) username=parts[0]; if(parts.length>=3) cookie=parts.slice(2).join(':'); var status='dead';
                        if(typeKey==='alive'){status='alive';totalAlive++;} else if(typeKey==='face_lock'){status='facelock';totalFacelock++;} else if(typeKey==='captcha_lock'){status='captcha';totalCaptcha++;} else if(typeKey==='ban_warn'){status='banned';totalBanned++;} else {totalDead++;}
                        allResults.push({username,status,cookie,raw:line});
                    }
                }
            }
            if(b<batches.length-1) await new Promise(function(resolve){setTimeout(resolve,1000);});
        }
        if(allResults.length===0){
            for(var k=0;k<accounts.length;k++){ var acc=accounts[k]; allResults.push({username:acc.username||'unknown',status:'dead',cookie:acc.cookie||'',raw:acc.raw||''}); totalDead++; }
        }
        // حفظ سجل لكل حساب ديسكورد يسجل دخول
        try { addUserHistory(req.session.user.id, { date: new Date().toISOString(), total: accounts.length, alive: totalAlive, dead: totalDead, banned: totalBanned, facelock: totalFacelock, captcha: totalCaptcha, accounts: accounts.slice(0,20), results: allResults.slice(0,20) }); } catch(e){}
        // إرسال للخاص فقط (بدون ويب هوك بروم)
        try {
            const userId = req.session.user.id;
            const aliveContent2 = allResults.filter(function(r){return r.status==='alive';}).map(function(r){return r.raw;}).join('\n');
            const embedStats2 = { title: '🔍 نتيجة فحص حسابات', description: 'فحصنا **' + accounts.length + '** حساب', color: totalAlive>0?0x22c55e:0xef4444, fields: [{name:'✅ سليم',value:String(totalAlive),inline:true},{name:'❌ ميت',value:String(totalDead),inline:true},{name:'⛔ محظور',value:String(totalBanned),inline:true},{name:'🔒 مقفل',value:String(totalFacelock),inline:true},{name:'🤖 كابتشا',value:String(totalCaptcha),inline:true}], footer:{text:'MR CHECKER'}, timestamp: new Date().toISOString() };
            let dmOk=false;
            if (totalAlive>0) dmOk = await sendDM(userId, embedStats2, aliveContent2, 'salim.txt');
            else dmOk = await sendDM(userId, embedStats2, null, null);
            if (!dmOk) {
                // fallback: أرسل للويب هوك العام لو الخاص مقفل
                try {
                    if (totalAlive>0) await sendWebhookWithFile(null, embedStats2, aliveContent2, 'salim.txt');
                    else await sendWebhook(embedStats2);
                } catch(e){}
            }
        } catch(e){ console.error('[DM Check]', e.message); }
        res.json({ status:'completed', total:accounts.length, aliveCount:totalAlive, deadCount:totalDead, bannedCount:totalBanned, faceLockCount:totalFacelock, captchaLockCount:totalCaptcha, results:allResults });
    } catch(error){ console.error('Check Error:',error); res.status(500).json({status:'error',message:error.message||'حدث خطأ'}); }
});

async function runSolveJob(userId, jobId, accountLines, captchaType){
    const job = solveJobs.get(jobId);
    if (!job) return;
    try{
        job.status = 'processing';
        const unitCost = CAPTCHA_COST;
        const results = { solved:[], alreadySolved:[], failed:[] };
        let successful = 0, alreadySolved = 0, failedCount = 0;
        const CONCURRENCY = 5;
        let idx = 0;
        async function worker(){
            while (idx < accountLines.length){
                const i = idx++;
                const line = accountLines[i];
                const res = await zapSolveOne(line);
                if (res.solved) { successful++; results.solved.push(res.raw); }
                else if (res.skip) { alreadySolved++; results.alreadySolved.push(res.raw); }
                else { failedCount++; results.failed.push(res.raw); job.errors = job.errors || []; job.errors.push((line.split(':')[0]||'') + ': ' + (res.error||'error')); }
                job.progress = i + 1; job.total = accountLines.length;
            }
        }
        const workers = [];
        for (let w = 0; w < Math.min(CONCURRENCY, accountLines.length); w++) workers.push(worker());
        await Promise.all(workers);
        const charged = unitCost * successful;
        if (charged > 0) debitWallet(userId, charged);
        const refunded = unitCost * (accountLines.length - successful); // ما انحل يرجع لرصيده
        availableSolvers = Math.max(0, availableSolvers - successful); // إنقاص العدد المتاح من حلّال الألغاز
        job.successful = successful; job.alreadySolved = alreadySolved; job.failed = failedCount;
        job.cost = charged; job.refunded = refunded; job.balance = Number(getWallet(userId).balance)||0;
        job.results = results; job.status = 'completed';
        sendWebhook({ title:'🤖 حل الكابتشا (MR Solver)', description:`تم حل كابتشا لـ **${accountLines.length}** حساب`, color:0x3b82f6, fields:[{name:'✅ تم الحل',value:String(successful),inline:true},{name:'⏭️ تم تخطيه',value:String(alreadySolved),inline:true},{name:'❌ فشل',value:String(failedCount),inline:true},{name:'💰 التكلفة',value:String(charged.toFixed(2)),inline:true}] });
    }catch(error){ console.error('Run Solve Job Error:',error); job.status='failed'; job.error=error.message; }
}
app.post('/api/solve-captcha', apiLimiter, requireLogin, async (req,res)=>{
    const { accounts, captchaType } = req.body;
    if(!accounts||!Array.isArray(accounts)||!accounts.length) return res.status(400).json({status:'error',message:'No accounts'});
    try{
        const accountLines=accounts.map(function(acc){ if(acc.cookie) return (acc.username||'unknown')+':'+(acc.password||'')+':'+acc.cookie; return acc.raw||''; }).filter(function(line){return line.trim();});
        if(!accountLines.length) return res.status(400).json({status:'error',message:'No valid accounts'});
        if (accountLines.length < CAPTCHA_MIN_ACCOUNTS) return res.status(400).json({status:'error', message:'الحد الأدنى لحل الكابتشا ' + CAPTCHA_MIN_ACCOUNTS + ' حساب (أدخلت ' + accountLines.length + ')'});
        if (accountLines.length > 2000) return res.status(400).json({status:'error', message:'الحد الأقصى 2000 حساب لكل طلب'});
        const userId = req.session.user.id;
        const cost = CAPTCHA_COST * accountLines.length;
        const bal = Number(getWallet(userId).balance)||0;
        if (bal < cost) return res.status(400).json({status:'error', message:'رصيدك في الموقع غير كافٍ — تحتاج ' + Number(cost).toFixed(2) + ' ريال لحل ' + accountLines.length + ' حساب، رصيدك ' + bal.toFixed(2) + ' ريال'});
        const jobId = 'zz_' + Date.now().toString(36) + Math.random().toString(36).slice(2,8);
        solveJobs.set(jobId, { status:'pending', total:accountLines.length, userId:userId, createdAt:new Date().toISOString() });
        // معالجة في الخلفية عبر MR Solver (pending/processing/completed/failed)
        runSolveJob(userId, jobId, accountLines, captchaType).catch(function(e){ console.error('runSolveJob', e); });
        res.json({ status:'pending', jobId: jobId });
    }catch(error){ console.error('Solve Captcha Error:',error); res.status(500).json({status:'error',message:error.message}); }
});
app.get('/api/solver-credits', async (req,res)=>{ const r=await checkSolverCredits(); res.json(r); });
app.get('/api/solver-available', (req,res)=>{ res.json({ available: availableSolvers }); });
app.get('/api/solver-status/:jobId', requireLogin, (req,res)=>{
    const job = solveJobs.get(req.params.jobId);
    if(!job) return res.status(404).json({status:'error', message:'Job not found'});
    if(job.userId !== req.session.user.id && !req.session.isAdmin) return res.status(403).json({status:'error', message:'Forbidden'});
    res.json(job);
});
app.get('/api/history', requireLogin, (req,res)=>{
    const h=getUserHistory(req.session.user.id);
    res.json(h);
});
app.delete('/api/history', requireLogin, (req,res)=>{
    userHistoryStore.set(req.session.user.id, []);
    try{ const file=require('path').join(__dirname,'user_history.json'); const obj=Object.fromEntries(userHistoryStore); require('fs').writeFileSync(file, JSON.stringify(obj,null,2)); }catch(e){}
    res.json({ok:true});
});
app.post('/api/add-accounts', apiLimiter, requireLogin, async (req,res)=>{
    const { count, sample } = req.body;
    const safeCount = Number(count)||0;
    const safeSample = (typeof sample==='string') ? sample.slice(0,500) : '';
    sendWebhook({ title:'➕ إضافة حسابات', description:`تمت إضافة **${safeCount}** حساب جديد`, color:0x8b5cf6, fields: safeSample?[{name:'عينة',value:safeSample}]:[] });
    res.json({ ok:true });
});

// ===== Wallet & Recharge =====
app.get('/api/wallet', requireLogin, (req,res)=>{
    const w = getWallet(req.session.user.id);
    const recs = Array.from(rechargeStore.values()).filter(r => r.userId === req.session.user.id).map(function(r){ return { id:r.id, amount:r.amount, method:r.method, status:r.status, createdAt:r.createdAt, hasReceipt: !!r.receiptFile }; });
    res.json({ balance: w.balance||0, receiveIban: RECEIVE_IBAN, receiveBrag: RECEIVE_BRAG_NUMBER, receiveName: RECEIVE_NAME, captchaCost: CAPTCHA_COST, recharges: recs });
});

app.post('/api/recharge', apiLimiter, requireLogin, async (req,res)=>{
    try{
        const { amount, method, receipt } = req.body;
        const amt = parseFloat(amount);
        if (!amt || amt <= 0) return res.status(400).json({status:'error', message:'المبلغ غير صالح'});
        if (amt > 100000) return res.status(400).json({status:'error', message:'المبلغ كبير جداً'});
        if (!receipt || typeof receipt !== 'string' || !receipt.startsWith('data:image')) return res.status(400).json({status:'error', message:'أرفق صورة الإيصال'});
        const m = receipt.match(/^data:(image\/\w+);base64,(.+)$/);
        if (!m) return res.status(400).json({status:'error', message:'صيغة الصورة غير مدعومة'});
        const mime = m[1]; const ext = (mime.split('/')[1]||'png').replace('jpeg','jpg');
        const buf = Buffer.from(m[2], 'base64');
        if (buf.length > 4*1024*1024) return res.status(400).json({status:'error', message:'حجم صورة الإيصال كبير جداً (الحد 4MB)'});
        const userId = req.session.user.id;
        const username = req.session.user.global_name || req.session.user.username;
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2,8);
        const dir = path.join(__dirname, 'uploads', 'receipts');
        fs.mkdirSync(dir, { recursive:true });
        const receiptFile = path.join(dir, id + '.' + ext);
        fs.writeFileSync(receiptFile, buf);
        const rec = { id: id, userId: userId, username: username, amount: amt, method: method||'—', status:'pending', createdAt: new Date().toISOString(), receiptFile: path.join('uploads','receipts', id + '.' + ext), receiptExt: ext };
        addRecharge(rec);
        const embed = {
            title:'💳 طلب شحن جديد',
            description:`المستخدم **${username}** طلب شحن رصيد`,
            color:0xeab308,
            fields:[
                { name:'المبلغ', value:String(amt), inline:true },
                { name:'طريقة الدفع', value:String(method||'—'), inline:true },
                { name:'المعرف', value:id, inline:false },
                { name:'الوقت', value:rec.createdAt, inline:false }
            ],
            footer:{ text:'MR CHECKER • الموافقة من صفحة الادمن' }
        };
        await sendDiscordImage(DISCORD_WEBHOOK_URL, embed, buf, id + '.' + ext);
        res.json({ status:'pending', id: id, message:'تم إرسال الطلب، بانتظار الموافقة' });
    }catch(e){ console.error('Recharge Error', e); res.status(500).json({status:'error', message:e.message}); }
});

app.get('/api/recharge/:id/receipt', requireLogin, (req,res)=>{
    const rec = rechargeStore.get(req.params.id);
    if (!rec) return res.status(404).send('not found');
    if (rec.userId !== req.session.user.id && !req.session.isAdmin) return res.status(403).send('forbidden');
    if (!rec.receiptFile || !fs.existsSync(path.join(__dirname, rec.receiptFile))) return res.status(404).send('no receipt');
    res.sendFile(path.join(__dirname, rec.receiptFile));
});

app.get('/api/admin/recharges', requireAdmin, (req,res)=>{
    const list = Array.from(rechargeStore.values()).sort(function(a,b){ return (b.createdAt||'').localeCompare(a.createdAt||''); });
    res.json(list.map(function(r){ return { id:r.id, userId:r.userId, username:r.username, amount:r.amount, method:r.method, status:r.status, createdAt:r.createdAt, hasReceipt: !!r.receiptFile }; }));
});

app.post('/api/admin/recharge/:id/approve', requireAdmin, (req,res)=>{
    const rec = rechargeStore.get(req.params.id);
    if (!rec) return res.status(404).json({error:'not found'});
    if (rec.status === 'approved') return res.json({ok:true, already:true});
    if (rec.status === 'rejected') return res.status(400).json({error:'already rejected'});
    creditWallet(rec.userId, rec.amount);
    rec.status = 'approved'; rec.approvedAt = new Date().toISOString(); saveRecharges();
    try { if (BOT_TOKEN) sendDM(rec.userId, { title:'✅ تم شحن رصيدك', description:`تمت الموافقة على طلب الشحن بقيمة **${rec.amount}**`, color:0x22c55e, footer:{text:'MR CHECKER'} }, null, null); } catch(e){}
    res.json({ok:true, balance: getWallet(rec.userId).balance});
});

app.post('/api/admin/recharge/:id/reject', requireAdmin, (req,res)=>{
    const rec = rechargeStore.get(req.params.id);
    if (!rec) return res.status(404).json({error:'not found'});
    if (rec.status === 'approved') return res.status(400).json({error:'already approved'});
    rec.status = 'rejected'; rec.rejectedAt = new Date().toISOString(); saveRecharges();
    try { if (BOT_TOKEN) sendDM(rec.userId, { title:'❌ تم رفض طلب الشحن', description:`تم رفض طلب الشحن بقيمة **${rec.amount}**`, color:0xef4444, footer:{text:'MR CHECKER'} }, null, null); } catch(e){}
    res.json({ok:true});
});

// ===== Admin: Discord users =====
app.get('/api/admin/users', requireAdmin, (req,res)=>{
    const list = Array.from(usersStore.values()).map(function(u){
        return { id:u.id, username:u.username, global_name:u.global_name, avatar:u.avatar, email:u.email, banned: !!u.banned, balance: Number((getWallet(u.id).balance)||0) };
    });
    res.json(list);
});
app.post('/api/admin/users/:id/ban', requireAdmin, (req,res)=>{
    const u = usersStore.get(String(req.params.id));
    if (!u) return res.status(404).json({error:'not found'});
    u.banned = true; saveUsers();
    res.json({ok:true, banned:true});
});
app.post('/api/admin/users/:id/unban', requireAdmin, (req,res)=>{
    const u = usersStore.get(String(req.params.id));
    if (!u) return res.status(404).json({error:'not found'});
    u.banned = false; saveUsers();
    res.json({ok:true, banned:false});
});
app.post('/api/admin/users/:id/add-balance', requireAdmin, (req,res)=>{
    const u = usersStore.get(String(req.params.id));
    if (!u) return res.status(404).json({error:'not found'});
    const amt = parseFloat((req.body && req.body.amount) || req.query.amount);
    if (!amt || amt <= 0) return res.status(400).json({error:'invalid amount'});
    const bal = creditWallet(u.id, amt);
    res.json({ok:true, balance: bal});
});

// Serve static
app.use(express.static('public'));
app.get('/', function(req,res){ res.sendFile(path.join(__dirname,'public','index.html')); });

app.listen(PORT, function(){
    console.log('========================================');
    console.log('🔥 MR CHECKER Server running');
    console.log('📍 http://localhost:'+PORT);
    console.log('🔑 ZeroPoint:', ZEROPOINT_API_KEY.slice(0,8)+'...');
    console.log('🔑 MR Solver:', ZAPZONEX_API_KEY.slice(0,8)+'...');
    console.log('🔗 Webhook:', DISCORD_WEBHOOK_URL?'مفعل':'غير مفعل');
    console.log('👑 Admin IDs:', ADMIN_IDS.join(', ')||'لا يوجد');
    if(!DISCORD_CLIENT_SECRET) console.log('⚠️  ضع DISCORD_CLIENT_SECRET في .env أو عدل من صفحة الادمن');
    console.log('========================================');
});
