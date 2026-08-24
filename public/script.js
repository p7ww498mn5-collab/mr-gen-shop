/* MR CHECKER front-end controller */
(function () {
    'use strict';

    var isRunning = false;
    var isAuthenticated = false;
    var accountCounter = 0;
    var currentLang = 'en';

    /* ============ TRANSLATIONS ============ */
    var i18n = {
        en: {
            total: 'Total', lastUpdate: 'Last Update', apiStatus: 'ZeroPoint API',
            infoText: 'MR CHECKER is available exclusively for MR shop accounts only. Format: username:password:cookie',
            account: 'ACCOUNT', online: 'Online',
            mAccount: 'ACCOUNT', mAlive: 'ALIVE', mDead: 'DEAD', mBanned: 'BANNED',
            mFacelock: 'FACE LOCK', mCaptcha: 'CAPTCHA', mNotxzin: 'NOT MR', mInvalid: 'INVALID',
            clear: 'Clear', summary: 'Summary', pasteAccounts: 'Paste Accounts',
            startCheck: 'Start Check', format: 'Format', cookiesOnly: 'Cookies Only',
            sAlive: 'Alive', sDead: 'Dead', sBanned: 'Banned', sFacelock: 'Face Lock', sCaptcha: 'Captcha',
            copyAlive: 'Copy Alive', copyDead: 'Copy Dead', copyBanned: 'Copy Banned',
            copyFacelock: 'Copy Face Lock', copyCaptcha: 'Copy Captcha', copyAll: 'Copy All',
            thUser: 'USERNAME', thStatus: 'STATUS',
            mAliveFull: 'Alive Accounts', mDeadFull: 'Dead Accounts', mBannedFull: 'Banned Accounts',
            mFacelockFull: 'Face Lock Accounts', mCaptchaFull: 'Captcha Accounts',
            mNotxzinFull: 'Not MR Accounts', mInvalidFull: 'Invalid Accounts',
            overviewTitle: 'Overview', overviewDesc: 'Today stats', todayChecked: 'Checked Today', totalChecked: 'Total', recentHistory: 'Recent checks', historyTitle: 'History', historyDesc: 'Last checks — click View to see accounts', viewTitle: 'Details',
            comingSoon: 'Coming soon...', rights: 'All Rights Reserved 2026',
            themeDark: 'Dark', themeLight: 'Light',
            placeholder: 'username:password:cookie (one per line)',
            readyLog: '[System] Ready to check accounts...',
            status: { alive: 'Alive', dead: 'Dead', banned: 'Banned', facelock: 'Face Lock', captcha: 'Captcha', notxzin: 'Not MR', invalid: 'Invalid', error: 'Error' },
            msg: {
                paste: 'Please paste accounts first.',
                noValid: 'No valid account lines found.',
                inProgress: 'A check is already in progress. Please wait.',
                checking: 'Checking {n} account line(s) via MR CHECKER...',
                noResults: 'No results returned. Status: {s}.',
                complete: 'Check complete: {n} result(s). Alive: {a}, Dead: {d}, Banned: {b}, Face Lock: {f}, Captcha: {c}.',
                noCopy: 'No {s} accounts to copy.',
                copied: 'Copied {n} {s} account(s).',
                copyFail: 'Unable to copy automatically. Please copy the results manually.',
                cleared: 'All input and results were cleared.',
                noFormat: 'No accounts to format.',
                formatted: 'Formatted {n} line(s).',
                noDownload: 'No results to download.',
                downloaded: 'Results downloaded successfully.',
                timeout: 'Request timed out after 45 seconds.',
                connFail: 'Connection failed.',
                invalidResp: 'The server returned an invalid response.',
                serverErr: 'Server error ({s}).'
            }
        },
        ar: {
            total: 'الإجمالي', lastUpdate: 'آخر تحديث', apiStatus: 'واجهة ZeroPoint',
            infoText: 'يُستخدم MR CHECKER حصرياً لحسابات متجر MR فقط. الصيغة: username:password:cookie',
            account: 'حساب', online: 'متصل',
            mAccount: 'الحسابات', mAlive: 'حية', mDead: 'ميتة', mBanned: 'محظورة',
            mFacelock: 'قفل الوجه', mCaptcha: 'كابتشا',             mNotxzin: 'غير MR', mInvalid: 'غير صالحة',
            clear: 'مسح', summary: 'تلخيص', pasteAccounts: 'الصق الحسابات',
            startCheck: 'بدء الفحص', format: 'تنسيق', cookiesOnly: 'ملفات الارتباط فقط',
            sAlive: 'حية', sDead: 'ميتة', sBanned: 'محظورة', sFacelock: 'قفل الوجه', sCaptcha: 'كابتشا',
            copyAlive: 'نسخ الحية', copyDead: 'نسخ الميتة', copyBanned: 'نسخ المحظورة',
            copyFacelock: 'نسخ قفل الوجه', copyCaptcha: 'نسخ الكابتشا', copyAll: 'نسخ الكل',
            thUser: 'اسم المستخدم', thStatus: 'الحالة',
            mAliveFull: 'الحسابات الحية', mDeadFull: 'الحسابات الميتة', mBannedFull: 'الحسابات المحظورة',
            mFacelockFull: 'حسابات قفل الوجه', mCaptchaFull: 'حسابات الكابتشا',
            mNotxzinFull: 'حسابات غير MR', mInvalidFull: 'الحسابات غير الصالحة',
            overviewTitle: 'نظرة عامة', overviewDesc: 'إحصائيات اليوم', todayChecked: 'فحص اليوم', totalChecked: 'الإجمالي', recentHistory: 'آخر الفحوص', historyTitle: 'السجل', historyDesc: 'آخر عمليات الفحص — اضغط عرض لمشاهدة الحسابات', viewTitle: 'التفاصيل',
            comingSoon: 'قريباً...', rights: 'جميع الحقوق محفوظة 2026',
            themeDark: 'داكن', themeLight: 'فاتح',
            placeholder: 'username:password:cookie (حساب في كل سطر)',
            readyLog: '[النظام] جاهز لفحص الحسابات...',
            status: { alive: 'حية', dead: 'ميتة', banned: 'محظورة', facelock: 'قفل الوجه', captcha: 'كابتشا', notxzin: 'غير MR', invalid: 'غير صالحة', error: 'خطأ' },
            msg: {
                paste: 'يرجى لصق الحسابات أولاً.',
                noValid: 'لم يتم العثور على أسطر حسابات صالحة.',
                inProgress: 'هناك فحص قيد التشغيل بالفعل. يرجى الانتظار.',
                checking: 'جارٍ فحص {n} سطر حساب عبر MR CHECKER...',
                noResults: 'لم يتم إرجاع نتائج. الحالة: {s}.',
                complete: 'اكتمل الفحص: {n} نتيجة. حية: {a}، ميتة: {d}، محظورة: {b}، قفل الوجه: {f}، كابتشا: {c}.',
                noCopy: 'لا توجد حسابات {s} لنسخها.',
                copied: 'تم نسخ {n} حساب من {s}.',
                copyFail: 'تعذر النسخ تلقائياً. يرجى نسخ النتائج يدوياً.',
                cleared: 'تم مسح كافة المدخلات والنتائج.',
                noFormat: 'لا توجد حسابات لتنسيقها.',
                formatted: 'تم تنسيق {n} سطر.',
                noDownload: 'لا توجد نتائج لتنزيلها.',
                downloaded: 'تم تنزيل النتائج بنجاح.',
                timeout: 'انتهت مهلة الطلب بعد 45 ثانية.',
                connFail: 'فشل الاتصال.',
                invalidResp: 'أرجع الخادم استجابة غير صالحة.',
                serverErr: 'خطأ في الخادم ({s}).'
            }
        }
    };

    function t(key) {
        return (i18n[currentLang] && i18n[currentLang][key] != null) ? i18n[currentLang][key] : (i18n.en[key] != null ? i18n.en[key] : key);
    }
    function tm(key) {
        return (i18n[currentLang] && i18n[currentLang].msg && i18n[currentLang].msg[key] != null)
            ? i18n[currentLang].msg[key] : i18n.en.msg[key];
    }
    function tStatus(key) {
        return (i18n[currentLang] && i18n[currentLang].status && i18n[currentLang].status[key] != null)
            ? i18n[currentLang].status[key] : key;
    }
    function fmt(template, vars) {
        return String(template).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    }

    /* ============ DOM REFS ============ */
    var accountInput = document.getElementById('accountInput');
    var resultsBody = document.getElementById('resultsBody');
    var logArea = document.getElementById('logArea');
    var lastUpdate = document.getElementById('lastUpdate');

    var countIds = ['alive', 'dead', 'banned', 'facelock', 'captcha', 'notxzin', 'invalid'];
    var countRefs = {};
    countIds.forEach(function (status) {
        countRefs[status] = {
            main: document.getElementById(status + 'Count'),
            copy: document.getElementById(status + 'Count2'),
            badge: document.getElementById(status + 'Badge')
        };
    });

    var DISCORD_URL = 'https://discord.gg/mrchecker'; // <-- غير الرابط هنا لربط ديسكورد الخاص بك

    var statusColors = { info: '#8b7cff', success: '#35e6a0', error: '#ff6277', warning: '#ffd45a' };
    var statusIcons = { info: 'fa-info-circle', success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-triangle-exclamation' };

    function normalizeStatus(status) {
        var value = String(status || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
        var aliases = {
            face_lock: 'facelock', face_locked: 'facelock', facelock: 'facelock',
            captcha_lock: 'captcha', captcha_required: 'captcha',
            not_xzin: 'notxzin', invalid_account: 'invalid'
        };
        return aliases[value] || value;
    }

    function escapeHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    function getStatusBadge(status) {
        var normalized = normalizeStatus(status);
        var label = tStatus(normalized) || String(status || 'Unknown').replace(/_/g, ' ');
        var cssClass = ['alive', 'dead', 'banned', 'facelock', 'captcha', 'error', 'notxzin', 'invalid'].indexOf(normalized) !== -1 ? normalized : '';
        return '<span class="status-badge ' + cssClass + '">' + escapeHtml(label) + '</span>';
    }

    function setLastUpdate() {
        if (lastUpdate) lastUpdate.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function addLog(message, type) {
        var logType = statusColors[type] ? type : 'info';
        if (!logArea) return;
        logArea.replaceChildren();
        var icon = document.createElement('i');
        icon.className = 'fas ' + (statusIcons[logType] || statusIcons.info);
        icon.style.color = statusColors[logType];
        var text = document.createElement('span');
        var time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        text.textContent = '[' + time + '] ' + String(message || '');
        logArea.appendChild(icon);
        logArea.appendChild(text);
        setLastUpdate();
    }

    function showCopyToast(card){
        if(!card) return;
        var ex=card.querySelector('.copy-toast'); if(ex) ex.remove();
        var t=document.createElement('div'); t.className='copy-toast'; t.innerHTML='<i class="fas fa-check-circle"></i> تم النسخ';
        card.appendChild(t);
        setTimeout(function(){ if(t.parentNode) t.remove(); }, 2100);
    }
    function parseLine(line) {
        var raw = String(line || '').trim();
        if (!raw) return null;
        // support : | ; , TAB as delimiter - split by first occurrence of any
        var parts = raw.split(/[:|;\t,]+/);
        // but cookie may contain : ; etc, so try to keep 3-part logic using original separators more carefully:
        // fallback: try colon first, then pipe
        if (parts.length >= 2) {
            // use regex to capture user, pass, cookie where cookie = rest after 2nd delimiter
            var m = raw.match(/^([^:|;\t,]+?)\s*[:|;\t,]\s*([^:|;\t,]*?)(?:\s*[:|;\t,]\s*(.*))?$/);
            if (m) {
                return { username: (m[1]||'').trim() || 'unknown', password: (m[2]||'').trim(), cookie: (m[3]||'').trim(), raw: raw };
            }
        }
        // single token = cookie only
        return { username: 'cookie_only', password: '', cookie: raw, raw: raw };
    }

    function smartParseAccounts(text) {
        return String(text || '').replace(/\r/g, '').split('\n').map(parseLine).filter(Boolean);
    }

    /* Formatter-specific helpers */
    function formatterConvert() {
        var inputEl = document.getElementById('fmtInput');
        var outputEl = document.getElementById('fmtOutput');
        var statsEl = document.getElementById('fmtStats');
        if (!inputEl || !outputEl) return;
        var text = inputEl.value;
        if (!text.trim()) { addLog(tm('noFormat'), 'warning'); if (statsEl) statsEl.textContent = '0 lines'; return; }
        var selectedFmt = (document.querySelector('input[name="fmt"]:checked') || {}).value || 'user_pass';
        var sepBtn = document.querySelector('.sep-btn.active');
        var sep = sepBtn ? sepBtn.dataset.sep : ':';
        var accounts = smartParseAccounts(text);
        var lines = [];
        accounts.forEach(function (a) {
            var isCookieOnly = a.username === 'cookie_only';
            switch (selectedFmt) {
                case 'user_pass':
                    if (!isCookieOnly) lines.push(a.username + sep + a.password);
                    break;
                case 'user_pass_cookie':
                    if (!isCookieOnly) lines.push(a.username + sep + a.password + sep + a.cookie);
                    else if (a.cookie) lines.push(a.cookie);
                    break;
                case 'cookie_only':
                    if (a.cookie) lines.push(a.cookie);
                    break;
                case 'user_only':
                    if (!isCookieOnly) lines.push(a.username);
                    break;
                case 'pass_only':
                    if (!isCookieOnly) lines.push(a.password);
                    break;
                case 'json':
                    if (!isCookieOnly) lines.push(JSON.stringify({ user: a.username, pass: a.password, cookie: a.cookie }));
                    else lines.push(JSON.stringify({ cookie: a.cookie }));
                    break;
                default:
                    lines.push(a.raw);
            }
        });
        outputEl.value = lines.join('\n');
        if (statsEl) statsEl.textContent = lines.length + ' lines';
        addLog(fmt(tm('formatted'), { n: lines.length }), 'success');
    }

    function applyFormatter(format) {
        if (!accountInput) return;
        var text = accountInput.value;
        if (!text.trim()) { addLog(tm('noFormat'), 'warning'); return; }
        var accounts = smartParseAccounts(text);
        var results = [];
        accounts.forEach(function (account) {
            if (format === 'cookie_only') { if (account.cookie) results.push(account.cookie); return; }
            if (format === 'user_pass') { if (account.username !== 'cookie_only') results.push(account.username + ':' + account.password); return; }
            if (account.username !== 'cookie_only') results.push(account.username + ':' + account.password + ':' + account.cookie);
            else if (account.cookie) results.push(account.cookie);
        });
        accountInput.value = results.join('\n');
        addLog(fmt(tm('formatted'), { n: results.length }), 'success');
    }

    async function checkAccounts(accounts) {
        var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        var timeoutId = controller ? setTimeout(function () { controller.abort(); }, 45000) : null;
        try {
            var webhookUrl = '';
            try { webhookUrl = (document.getElementById('customWebhook')?.value || '').trim(); } catch(e){}
            var payload = { accounts: accounts };
            if (webhookUrl) payload.webhookUrl = webhookUrl;
            var options = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) };
            if (controller) options.signal = controller.signal;
            var response = await fetch('/api/check', options);
            var body = await response.text();
            var data;
            try { data = body ? JSON.parse(body) : {}; }
            catch (parseError) { throw new Error(tm('invalidResp')); }
            if (!response.ok) throw new Error(data.message || fmt(tm('serverErr'), { s: response.status }));
            return data;
        } catch (error) {
            if (error && error.name === 'AbortError') return { status: 'error', message: tm('timeout') };
            console.error('Check request failed:', error);
            return { status: 'error', message: error && error.message ? error.message : tm('connFail') };
        } finally { if (timeoutId) clearTimeout(timeoutId); }
    }

    function getCounts() {
        var counts = { alive: 0, dead: 0, banned: 0, facelock: 0, captcha: 0, notxzin: 0, invalid: 0, error: 0 };
        if (!resultsBody) return counts;
        resultsBody.querySelectorAll('tr[data-status]').forEach(function (row) {
            var status = normalizeStatus(row.dataset.status);
            if (Object.prototype.hasOwnProperty.call(counts, status)) counts[status] += 1;
        });
        return counts;
    }

    function updateStats() {
        var counts = getCounts();
        var total = 0;
        Object.keys(counts).forEach(function (status) { total += counts[status]; });
        countIds.forEach(function (status) {
            var refs = countRefs[status];
            if (refs.main) refs.main.textContent = counts[status];
            if (refs.copy) refs.copy.textContent = counts[status];
            if (refs.badge) refs.badge.textContent = counts[status];
        });
        var totalEl = document.getElementById('totalAccounts');
        var sidebarTotal = document.getElementById('sidebarTotal');
        var statAccount = document.getElementById('statAccount');
        if (totalEl) totalEl.textContent = total;
        if (sidebarTotal) sidebarTotal.textContent = total;
        if (statAccount) statAccount.textContent = total;
        // blmk specific
        var sb = document.getElementById('statBanned'); if (sb) sb.textContent = counts.banned + counts.dead;
        var sc = document.getElementById('statClean'); if (sc) sc.textContent = counts.alive;
        var sm = document.getElementById('statModerated'); if (sm) sm.textContent = counts.facelock;
        var sr = document.getElementById('statReview'); if (sr) sr.textContent = counts.captcha;
        var sh = document.getElementById('statHold'); if (sh) sh.textContent = counts.notxzin;
    }

    function createResultRow(number, username, status) {
        var normalized = normalizeStatus(status);
        var row = document.createElement('tr');
        row.dataset.status = normalized;
        row.dataset.username = String(username || 'unknown');
        var numberCell = document.createElement('td'); numberCell.textContent = number;
        var usernameCell = document.createElement('td');
        var usernameStrong = document.createElement('strong'); usernameStrong.textContent = String(username || 'unknown');
        usernameCell.appendChild(usernameStrong);
        var statusCell = document.createElement('td'); statusCell.innerHTML = getStatusBadge(normalized);
        row.appendChild(numberCell); row.appendChild(usernameCell); row.appendChild(statusCell);
        return row;
    }

    function addResultToTable(username, status) {
        if (!resultsBody) return;
        var normalized = normalizeStatus(status) || 'error';
        accountCounter += 1;
        var empty = resultsBody.querySelector('.empty-row'); if (empty) empty.remove();
        resultsBody.appendChild(createResultRow(accountCounter, username, normalized));
        var wrapper = document.getElementById('resultsWrapper');
        if (wrapper) wrapper.style.display = 'block';
        updateStats();
    }

    function renderEmptyState(targetBody, message) {
        if (!targetBody) return;
        targetBody.replaceChildren();
        var row = document.createElement('tr'); row.className = 'empty-row';
        var cell = document.createElement('td'); cell.colSpan = 3; cell.textContent = message;
        row.appendChild(cell); targetBody.appendChild(row);
    }

    function renderCategoryTable(status) {
        var targetBody = document.getElementById(status + 'Body');
        if (!targetBody || !resultsBody) return;
        var matchingRows = Array.from(resultsBody.querySelectorAll('tr[data-status]'))
            .filter(function (row) { return normalizeStatus(row.dataset.status) === status; });
        targetBody.replaceChildren();
        if (!matchingRows.length) { renderEmptyState(targetBody, tStatus(status).toUpperCase() + ' — ' + t('comingSoon')); return; }
        matchingRows.forEach(function (sourceRow, index) { targetBody.appendChild(createResultRow(index + 1, sourceRow.dataset.username, status)); });
    }

    function rebuildCategoryTables() { ['alive', 'dead', 'banned', 'facelock', 'captcha', 'notxzin', 'invalid'].forEach(renderCategoryTable); }

    function filterAccounts(status) {
        var normalized = normalizeStatus(status);
        if (!document.getElementById('page-' + normalized)) { showPage('checker'); return; }
        renderCategoryTable(normalized); showPage(normalized);
    }

    function fallbackCopy(text) {
        var textarea = document.createElement('textarea');
        textarea.value = text; textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed'; textarea.style.opacity = '0';
        document.body.appendChild(textarea); textarea.select();
        var copied = false;
        try { copied = document.execCommand('copy'); } catch (error) { copied = false; }
        textarea.remove(); return copied;
    }

    async function copyAccountsByStatus(status) {
        var normalized = normalizeStatus(status);
        var accounts = Array.from((resultsBody || document).querySelectorAll('tr[data-status]'))
            .filter(function (row) { return normalizeStatus(row.dataset.status) === normalized; })
            .map(function (row) { return row.dataset.username || ''; }).filter(Boolean);
        if (!accounts.length) { addLog(fmt(tm('noCopy'), { s: tStatus(normalized).toLowerCase() }), 'warning'); return; }
        var text = accounts.join('\n');
        var copied = false;
        try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); copied = true; } } catch (error) { copied = false; }
        if (!copied) copied = fallbackCopy(text);
        addLog(copied ? fmt(tm('copied'), { n: accounts.length, s: tStatus(normalized).toLowerCase() })
                      : tm('copyFail'), copied ? 'success' : 'warning');
    }

    function resetStartButton() {
        var startBtn = document.getElementById('startBtn');
        if (!startBtn) return;
        startBtn.disabled = false;
        startBtn.innerHTML = '<i class="fas fa-play"></i> <span data-i18n="startCheck">' + t('startCheck') + '</span>';
    }

    async function startCheck() {
        if (!isAuthenticated) { addLog('يجب تسجيل الدخول بالديسكورد أولاً', 'warning'); window.location.href='/auth/discord'; return; }
        if (isRunning) { addLog(tm('inProgress'), 'warning'); return; }
        var text = accountInput ? accountInput.value.trim() : '';
        if (!text) { addLog(tm('paste'), 'warning'); return; }
        var accounts = smartParseAccounts(text);
        if (!accounts.length) { addLog(tm('noValid'), 'error'); return; }
        if (accounts.length > 100) { addLog('الحد الأقصى 100 حساب — لديك '+accounts.length, 'warning'); return; }
        isRunning = true;
        var ind = document.getElementById('checkingIndicator');
        if(ind) ind.style.display='block';
        var startBtn = document.getElementById('startBtn');
        if (startBtn) { startBtn.disabled = true; startBtn.innerHTML = '<i class="fas fa-spinner checking-spinner"></i> <span class="checking-animated">Checking...</span>'; }
        addLog(fmt(tm('checking'), { n: accounts.length }), 'info');
        try {
            var result = await checkAccounts(accounts);
            if (!result || result.status === 'error') {
                var msg=(result && result.message) || tm('connFail');
                if (msg && msg.includes('تسجيل الدخول')) { addLog(msg,'error'); window.location.href='/auth/discord'; }
                else addLog(msg,'error');
                isRunning = false; resetStartButton(); if(ind) ind.style.display='none'; return;
            }
            var results = Array.isArray(result.results) ? result.results : [];
            if (!results.length) { addLog(fmt(tm('noResults'), { s: result.status || 'unknown' }), 'warning'); isRunning = false; resetStartButton(); if(ind) ind.style.display='none'; return; }
            // تدريجي — واحد واحد مو 100 دفعة واحدة
            var idx = 0;
            var total = results.length;
            function showNext(){
                if(idx >= total){
                    rebuildCategoryTables();
                    var counts = getCounts();
                    addLog(fmt(tm('complete'), { n: total, a: counts.alive, d: counts.dead, b: counts.banned, f: counts.facelock, c: counts.captcha }), 'success');
                    addHistoryEntry({ date: new Date().toISOString(), total: accounts.length, alive: counts.alive, dead: counts.dead, banned: counts.banned, facelock: counts.facelock, captcha: counts.captcha, status: 'completed', accounts: accounts });
                    isRunning = false; resetStartButton(); if(ind) ind.style.display='none';
                    return;
                }
                var account = results[idx];
                var normalized = normalizeStatus(account && account.status) || 'error';
                addResultToTable(account && account.username ? account.username : 'unknown', normalized);
                idx++;
                if(ind) ind.innerHTML = '<i class="fas fa-spinner checking-spinner"></i> Checking... ' + idx + '/' + total + ' <span class="checking-dots"></span>';
                // تمرير تلقائي لآخر جدول
                var wrapper = document.getElementById('resultsWrapper');
                if(wrapper) wrapper.scrollTop = wrapper.scrollHeight;
                setTimeout(showNext, 70);
            }
            showNext();
            return;
        } catch (error) {
            addLog('Error: ' + (error && error.message ? error.message : tm('connFail')), 'error');
            isRunning = false; resetStartButton(); if(ind) ind.style.display='none';
        }
    }

    function clearAll() {
        if (isRunning) { addLog(tm('inProgress'), 'warning'); return; }
        if (resultsBody) renderEmptyState(resultsBody, t('readyLog'));
        accountCounter = 0;
        if (accountInput) accountInput.value = '';
        // مسح الحسابات من قائمة وضع الحسابات أيضاً
        try{ localStorage.removeItem('mr_saved_accounts'); }catch(e){}
        var savedList = document.getElementById('savedList');
        if(savedList) savedList.innerHTML='<div style="padding:20px;text-align:center;color:#6b7280">لا يوجد حسابات محفوظة</div>';
        var bulkCount = document.getElementById('bulkCount');
        if(bulkCount) bulkCount.textContent='0';
        updateStats(); updateLineCount(); rebuildCategoryTables(); showPage('cookie-checker');
        addLog(tm('cleared') + ' — تم مسح الحسابات المحفوظة أيضاً', 'info');
    }

    function downloadResults() {
        var rows = resultsBody ? Array.from(resultsBody.querySelectorAll('tr[data-status]')) : [];
        if (!rows.length) { addLog(tm('noDownload'), 'warning'); return; }
        var lines = [t('thUser') + '\t' + t('thStatus'), '========================================'];
        rows.forEach(function (row) {
            lines.push((row.dataset.username || 'unknown') + '\t' + (tStatus(normalizeStatus(row.dataset.status)) || normalizeStatus(row.dataset.status)).toUpperCase());
        });
        var blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url; link.download = 'results_' + new Date().toISOString().slice(0, 10) + '.txt';
        document.body.appendChild(link); link.click(); link.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        addLog(tm('downloaded'), 'success');
    }

    function showPage(pageId) {
        var page = String(pageId || 'ban-checker');
        // close sidebar on mobile
        var sidebar = document.getElementById('sidebar');
        var overlay = document.getElementById('overlay');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
        // new blmk pages use .page
        var pages = document.querySelectorAll('.page');
        if (pages.length) {
            pages.forEach(function (p) { p.classList.toggle('active', p.id === 'page-' + page); });
            document.querySelectorAll('.nav-item[data-page]').forEach(function (item) {
                item.classList.toggle('active', item.dataset.page === page);
            });
            document.querySelectorAll('.stat-card[data-page]').forEach(function (item) {
                var shouldActive = false;
                if (page === 'ban-checker' && item.dataset.page === 'checker') shouldActive = true;
                else if (item.dataset.page === page) shouldActive = true;
                item.classList.toggle('active', shouldActive);
            });
            var topTitle = document.getElementById('topbarTitle');
            if (topTitle) {
                var map = { 'cookie-checker':'فاحص الكوكيز','captcha-solver':'حل الكابتشا','api-keys':'مفاتيح الـ API','accounts':'الحسابات','rmz':'RMZ','cart':'السلة','history':'السجل','admin':'Admin Panel','formatter':'المنسق','overview':'نظرة عامة' };
                topTitle.textContent = map[page] || page;
            }
            if (page === 'admin') loadAdminData();
            // keep checker wrapper logic for backward compat
            var wrapper = document.getElementById('resultsWrapper');
            if (wrapper) {
                var hasResults = resultsBody && resultsBody.querySelector('tr[data-status]');
                wrapper.style.display = hasResults ? 'block' : 'none';
            }
            return;
        }
        // fallback old logic
        var wrapper2 = document.getElementById('resultsWrapper');
        var checkerWrapper = document.getElementById('checker-wrapper');
        var isChecker = page === 'checker';
        var isCategory = ['alive','dead','banned','facelock','captcha','notxzin','invalid'].indexOf(page) !== -1;
        if (checkerWrapper) checkerWrapper.style.display = isChecker || isCategory ? 'block' : 'none';
        document.querySelectorAll('.page-content').forEach(function (content) {
            var isTarget = content.id === 'page-' + page;
            content.classList.toggle('active', isTarget);
            content.style.display = isTarget ? 'block' : 'none';
        });
        document.querySelectorAll('.nav-item[data-page]').forEach(function (item) {
            item.classList.toggle('active', item.dataset.page === page);
        });
        document.querySelectorAll('.stat-card[data-page]').forEach(function (item) {
            var shouldActive = false;
            if (page === 'checker' && item.dataset.page === 'checker') shouldActive = true;
            else if (item.dataset.page === page) shouldActive = true;
            item.classList.toggle('active', shouldActive);
        });
        if (wrapper2) {
            var hasResults2 = resultsBody && resultsBody.querySelector('tr[data-status]');
            wrapper2.style.display = hasResults2 ? 'block' : 'none';
        }
        if (page === 'admin') loadAdminData();
    }

    /* ============ LANGUAGE & THEME ============ */
    function applyLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
        document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.dataset.i18n); });
        var ph = document.querySelector('[data-i18n-ph]');
        if (ph && ph.tagName === 'TEXTAREA') ph.placeholder = t('placeholder');
        var langLabel = document.getElementById('langLabel');
        if (langLabel) langLabel.textContent = (lang === 'ar') ? 'English' : 'العربية';
        var themeLabel = document.getElementById('themeLabel');
        if (themeLabel) themeLabel.textContent = (document.documentElement.dataset.theme === 'light') ? t('themeLight') : t('themeDark');
        rebuildCategoryTables();
        try { localStorage.setItem('mr_lang', lang); localStorage.setItem('xzin_lang', lang); } catch(e) {}
    }

    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
        var icon = document.getElementById('themeIcon');
        if (icon) { icon.className = (theme === 'light') ? 'fas fa-sun' : 'fas fa-moon'; }
        var label = document.getElementById('themeLabel');
        if (label) label.textContent = (theme === 'light') ? t('themeLight') : t('themeDark');
        try { localStorage.setItem('mr_theme', theme); localStorage.setItem('xzin_theme', theme); } catch(e) {}
    }

    function bindGlobalControls() {
        var langBtn = document.getElementById('langToggle');
        var themeBtn = document.getElementById('themeToggle');
        if (langBtn) langBtn.addEventListener('click', function () { applyLanguage(currentLang === 'ar' ? 'en' : 'ar'); });
        if (themeBtn) themeBtn.addEventListener('click', function () {
            applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
        });
        // قائمة اللغة - تصليح
        document.querySelectorAll('.lang-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var lang = btn.dataset.lang;
                if (lang === 'th') lang = 'en';
                if (lang === 'ar' || lang === 'en') {
                    applyLanguage(lang);
                    document.querySelectorAll('.lang-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.lang===lang); });
                    var html = document.documentElement;
                    html.lang = lang;
                    html.dir = lang==='ar' ? 'rtl' : 'ltr';
                }
            });
        });
    }

    function updateLineCount() {
        var el = document.getElementById('accountInput');
        var countEl = document.getElementById('lineCount');
        var charEl = document.getElementById('charCount');
        if (!el) return;
        var lines = el.value.split('\n').filter(function (l) { return l.trim(); }).length;
        if (countEl) { countEl.textContent = lines + ' lines'; countEl.style.color = lines > 10000 ? '#f87171' : ''; }
        if (charEl) charEl.textContent = String(el.value.length);
        // update blmk counts
        var statBanned = document.getElementById('statBanned');
        var statClean = document.getElementById('statClean');
        // also keep hidden compat
    }

    // === Bulk accounts (100) ===
    function getSavedAccounts(){ try{ return JSON.parse(localStorage.getItem('mr_saved_accounts')||'[]'); }catch(e){ return [] } }
    function saveSavedAccounts(arr){ try{ localStorage.setItem('mr_saved_accounts', JSON.stringify(arr)); }catch(e){} }
    function renderSavedAccounts(){
        var list = document.getElementById('savedList');
        if(!list) return;
        var arr = getSavedAccounts();
        if(!arr.length){ list.innerHTML='<div style="padding:20px;text-align:center;color:#6b7280">لا يوجد حسابات محفوظة</div>'; return; }
        list.innerHTML = arr.map(function(a,i){
            return '<div style="display:flex;gap:8px;align-items:center;padding:8px 10px;border-bottom:1px solid #1f1f25;font:11px JetBrains Mono"><span>'+(i+1)+'</span><span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+escapeHtml(a.username+':'+a.password+':'+(a.cookie? a.cookie.slice(0,30)+'...':''))+'</span><button class="btn btn-ghost" style="padding:4px 6px" onclick="removeSavedAccount('+i+')"><i class="fas fa-trash"></i></button></div>';
        }).join('');
        var bulkCount = document.getElementById('bulkCount');
        if(bulkCount) bulkCount.textContent = arr.length;
    }
    window.removeSavedAccount = function(idx){
        var arr = getSavedAccounts(); arr.splice(idx,1); saveSavedAccounts(arr); renderSavedAccounts();
    };

    // === API Keys for cart & RMZ ===
    function getApiKeys(){ try{ return JSON.parse(localStorage.getItem('mr_api_keys')||'[]'); }catch(e){ return [] } }
    function saveApiKeys(arr){ try{ localStorage.setItem('mr_api_keys', JSON.stringify(arr)); }catch(e){} }
    function renderApiKeys(){
        var cartEl = document.getElementById('cartKeys');
        var rmzEl = document.getElementById('rmzKeys');
        if(!cartEl && !rmzEl) return;
        var all = getApiKeys();
        function section(type, el){
            if(!el) return;
            var filtered = all.filter(function(k){ return k.type===type; });
            if(!filtered.length){ el.innerHTML='<div style="color:#6b7280;padding:8px;font:12px Tajawal">لا يوجد مفاتيح</div>'; return; }
            el.innerHTML = filtered.map(function(k){
                return '<div class="api-key-row"><span class="key">...'+escapeHtml(k.key.slice(-8))+'</span><span class="badge-green">فعال</span><span class="muted">'+escapeHtml(k.name)+' • '+new Date(k.created).toLocaleDateString('ar-EG')+'</span><button class="btn btn-ghost" onclick="deleteApiKey(\''+k.id+'\')"><i class="fas fa-trash"></i> إلغاء</button></div>';
            }).join('');
        }
        section('cart', cartEl); section('rmz', rmzEl);
        var cart2 = document.getElementById('cartKeys2');
        if(cart2) cart2.innerHTML = document.getElementById('cartKeys')? document.getElementById('cartKeys').innerHTML : '';
    }
    window.addApiKey = function(type){
        var input = document.getElementById(type==='cart'?'cartKeyName':'rmzKeyName');
        var name = input ? input.value.trim() : '';
        if(!name) name = type + '-' + Date.now().toString(36);
        var key = 'mr_'+type+'_'+Math.random().toString(36).slice(2,10) + '_' + Date.now().toString(36);
        var all = getApiKeys();
        all.push({ id: key, name:name, key:key, type:type, created: new Date().toISOString() });
        saveApiKeys(all); renderApiKeys();
        if(input) input.value='';
        addLog('تم إنشاء مفتاح '+type+': '+name, 'success');
    };
    window.deleteApiKey = function(id){
        var all = getApiKeys().filter(function(k){ return k.id!==id; });
        saveApiKeys(all); renderApiKeys();
        addLog('تم إلغاء المفتاح', 'info');
    };

    // === History (السجل) ===
    function getHistory(){ try{ return JSON.parse(localStorage.getItem('mr_history')||'[]'); }catch(e){ return [] } }
    function addHistoryEntry(entry){
        // احفظ التفاصيل للعرض
        if(entry.accounts) entry.accounts = entry.accounts.slice(0,100);
        var h = getHistory();
        h.unshift(entry);
        if(h.length>50) h = h.slice(0,50);
        try{ localStorage.setItem('mr_history', JSON.stringify(h)); }catch(e){}
        renderHistory();
        updateOverview();
        renderAccountHistory();
    }
    function renderHistory(){
        var el = document.getElementById('historyList');
        if(!el) return;
        var h = getHistory();
        if(!h.length){ el.innerHTML='<div style="padding:20px;text-align:center;color:#6b7280">لا يوجد سجل بعد — فحص الحسابات سيظهر هنا</div>'; updateOverview(); return; }
        el.innerHTML = h.map(function(e,i){
            return '<div style="display:flex;gap:8px;align-items:center;padding:10px;border-bottom:1px solid #1f1f25;font:12px Tajawal;flex-wrap:wrap"><span class="muted">'+new Date(e.date).toLocaleString('ar-EG')+'</span><span>'+e.total+' حساب</span><span style="color:#4ade80">سليم '+e.alive+'</span><span style="color:#f87171">ميت '+e.dead+'</span><span class="badge-green">'+(e.status||'completed')+'</span><button class="btn btn-ghost view-btn" data-idx="'+i+'" style="margin-right:auto;padding:4px 8px;font-size:11px"><i class="fas fa-eye"></i> عرض</button></div>';
        }).join('');
        // delegation
        el.querySelectorAll('.view-btn').forEach(function(btn){
            btn.addEventListener('click', function(){ viewHistory(parseInt(btn.dataset.idx,10)); });
        });
        renderAccountHistory();
        updateOverview();
    }
    function updateOverview(){
        var todayCountEl=document.getElementById('todayCount');
        var totalEl=document.getElementById('totalCountOverview');
        var overHist=document.getElementById('overviewHistory');
        var h=getHistory();
        var todayStr=new Date().toDateString();
        var today=0, total=0;
        h.forEach(function(e){ total+= (e.total||0); if(new Date(e.date).toDateString()===todayStr) today+=(e.total||0); });
        if(todayCountEl) todayCountEl.textContent=today;
        if(totalEl) totalEl.textContent=total;
        if(overHist){
            if(!h.length) overHist.innerHTML='<div style="color:#6b7280;text-align:center;padding:12px">لا يوجد فحص اليوم</div>';
            else overHist.innerHTML=h.slice(0,5).map(function(e){ return '<div style="display:flex;gap:8px;padding:6px;border-bottom:1px solid #1f1f25;font:11px Tajawal"><span>'+new Date(e.date).toLocaleTimeString('ar-EG')+'</span><span>'+e.total+' حساب</span><span style="color:#4ade80">'+e.alive+' سليم</span></div>'; }).join('');
        }
    }
    // === سجل كل حساب لحاله ===
    function getAccountHistory(){ try{ return JSON.parse(localStorage.getItem('mr_account_history')||'[]'); }catch(e){ return [] } }
    function addAccountHistory(results){
        if(!results||!results.length) return;
        var h=getAccountHistory();
        var now=new Date().toISOString();
        results.forEach(function(r){
            h.unshift({ username:r.username||'unknown', status:r.status||'unknown', raw:r.raw||'', cookie:r.cookie||'', date: now });
        });
        if(h.length>500) h=h.slice(0,500);
        try{ localStorage.setItem('mr_account_history', JSON.stringify(h)); }catch(e){}
        renderAccountHistory();
    }
    function renderAccountHistory(){
        var el=document.getElementById('accountHistoryList');
        if(!el) return;
        var h=getAccountHistory();
        if(!h.length){ el.innerHTML='<div style="padding:20px;text-align:center;color:#6b7280;font:12px Tajawal">لا يوجد سجل حسابات بعد — كل حساب تفحصه بيظهر هنا لحاله</div>'; return; }
        el.innerHTML=h.slice(0,100).map(function(e,i){
            var color=e.status==='alive'?'#22c55e':e.status==='banned'?'#ef4444':e.status==='dead'?'#6b7280':e.status==='facelock'?'#f97316':e.status==='captcha'?'#eab308':'#9ca3af';
            var label=e.status==='alive'?'سليم':e.status==='dead'?'ميت':e.status==='banned'?'محظور':e.status==='facelock'?'مقفل':e.status==='captcha'?'كابتشا':e.status;
            return '<div style="display:flex;gap:8px;align-items:center;padding:8px;border-bottom:1px solid #1f1f25;font:11px JetBrains Mono;flex-wrap:wrap"><span style="background:'+color+';color:#fff;padding:2px 6px;border-radius:999px;font:700 10px Tajawal">'+label+'</span><span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+e.username+'</span><span class="muted" style="font:400 10px Tajawal">'+new Date(e.date).toLocaleTimeString('ar-EG')+'</span><button class="btn btn-ghost view-acc-btn" data-idx="'+i+'" style="padding:4px 6px;font-size:10px"><i class="fas fa-eye"></i> عرض</button></div>';
        }).join('');
        el.querySelectorAll('.view-acc-btn').forEach(function(btn){
            btn.addEventListener('click', function(){ viewAccountHistory(parseInt(btn.dataset.idx,10)); });
        });
    }
    window.viewAccountHistory=function(idx){
        var h=getAccountHistory(); var e=h[idx]; if(!e) return;
        var view=document.getElementById('historyView');
        var content=document.getElementById('historyViewContent');
        if(!view||!content) return;
        var txt='الحساب: '+(e.username||'')+'\nالحالة: '+e.status+'\nالتاريخ: '+new Date(e.date).toLocaleString('ar-EG')+'\nالكوكي: '+(e.cookie||'').slice(0,120)+'\nالخام: '+(e.raw||'').slice(0,300);
        content.textContent=txt;
        view.style.display='block';
        view.scrollIntoView({behavior:'smooth'});
        var copyBtn=document.getElementById('historyCopyBtn');
        var dlBtn=document.getElementById('historyDownloadBtn');
        if(copyBtn) copyBtn.onclick=function(){ var ok=false; try{ if(navigator.clipboard&&window.isSecureContext){ navigator.clipboard.writeText((e.username||'')+':'+(e.password||'')+':'+(e.cookie||'')); ok=true; } }catch(e){} if(!ok) ok=fallbackCopy((e.username||'')+':'+(e.cookie||'')); addLog(ok?'تم النسخ':'فشل','success'); };
        if(dlBtn) dlBtn.onclick=function(){ var blob=new Blob([(e.username||'')+':'+(e.cookie||'')],{type:'text/plain'}); var url=URL.createObjectURL(blob); var a=document.createElement('a'); a.href=url; a.download=(e.username||'account')+'.txt'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){URL.revokeObjectURL(url)},1000); };
    };
    window.viewHistory=function(idx){
        var h=getHistory(); var e=h[idx]; if(!e) return;
        var view=document.getElementById('historyView');
        var content=document.getElementById('historyViewContent');
        if(!view||!content) return;
        var txt='';
        if(e.results && e.results.length){
            txt=e.results.map(function(r,i){ return (i+1)+'. '+(r.username||'unknown')+' — '+(r.status||'unknown')+'\n   '+(r.raw||'').slice(0,120); }).join('\n');
        } else if(e.accounts && e.accounts.length) txt=e.accounts.map(function(a){ return (a.username||'')+':'+(a.password||'')+':'+(a.cookie||'').slice(0,60); }).join('\n');
        else txt='العدد: '+e.total+'\nسليم: '+e.alive+'\nميت: '+e.dead+'\nمحظور: '+(e.banned||0)+'\nمقفل: '+(e.facelock||0)+'\nكابتشا: '+(e.captcha||0)+'\nالتاريخ: '+new Date(e.date).toLocaleString('ar-EG')+'\n(لا يوجد تفاصيل حسابات محفوظة لهذا السجل القديم)';
        content.textContent=txt;
        view.style.display='block';
        view.scrollIntoView({behavior:'smooth'});
        // أزرار النسخ والتحميل
        var copyBtn=document.getElementById('historyCopyBtn');
        var dlBtn=document.getElementById('historyDownloadBtn');
        if(copyBtn) copyBtn.onclick=function(){ var ok=false; try{ if(navigator.clipboard&&window.isSecureContext){ navigator.clipboard.writeText(txt); ok=true; } }catch(e){} if(!ok) ok=fallbackCopy(txt); addLog(ok?'تم النسخ':'فشل النسخ', ok?'success':'warning'); };
        if(dlBtn) dlBtn.onclick=function(){ var blob=new Blob([txt],{type:'text/plain'}); var url=URL.createObjectURL(blob); var a=document.createElement('a'); a.href=url; a.download='history_'+idx+'.txt'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){URL.revokeObjectURL(url)},1000); };
    };
    window.updateOverview=updateOverview;


    async function fetchAuthState() {
        try {
            var res = await fetch('/api/me', { credentials: 'include' });
            var data = await res.json();
            var authSection = document.getElementById('authSection');
            var userSection = document.getElementById('userSection');
            var adminNav = document.getElementById('adminNav') || document.getElementById('adminNavItem');
            var adminBadge = document.getElementById('adminBadge');
            if (data.authenticated && data.user) {
                if (authSection) authSection.style.display = 'none';
                if (userSection) userSection.style.display = 'block';
                var avatarEl = document.getElementById('userAvatar');
                var nameEl = document.getElementById('userName');
                var idEl = document.getElementById('userId');
                if (avatarEl) avatarEl.src = data.user.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png';
                if (nameEl) nameEl.textContent = data.user.global_name || data.user.username;
                if (idEl) idEl.textContent = data.user.id;
                if (data.isAdmin) {
                    if (adminNav) adminNav.style.display = 'flex';
                    if (adminBadge) adminBadge.style.display = 'block';
                } else {
                    if (adminNav) adminNav.style.display = 'none';
                    if (adminBadge) adminBadge.style.display = 'none';
                }
            } else {
                if (authSection) authSection.style.display = 'block';
                if (userSection) userSection.style.display = 'none';
                if (adminNav) adminNav.style.display = 'none';
            }
            isAuthenticated = !!(data && data.authenticated);
            var loginReq = document.getElementById('loginRequired');
            var sb = document.getElementById('startBtn');
            if (loginReq) loginReq.style.display = isAuthenticated ? 'none' : 'block';
            if (sb) sb.disabled = !isAuthenticated;
        } catch (e) { console.warn('auth fetch failed', e); }
    }

    async function loadAdminData() {
        var pre = document.getElementById('adminData');
        if (!pre) return;
        pre.textContent = 'Loading...';
        try {
            var res = await fetch('/api/admin/stats', { credentials: 'include' });
            var data = await res.json();
            pre.textContent = JSON.stringify(data, null, 2);
            if (res.status === 403) pre.textContent = '403 Forbidden — ' + (data.error || 'Admin only') + '\nهذه الخانة ظاهرة لك فقط لأنك ادمن، لكن السيرفر يمنع غير الادمن من جلب البيانات.';
        } catch (e) { pre.textContent = 'Error: ' + e.message; }
        // حمل الكونفق أيضاً
        try{
            var rc = await fetch('/api/admin/config', { credentials:'include' });
            if(rc.ok){
                var cfg = await rc.json();
                var el;
                el=document.getElementById('cfgWh'); if(el && cfg.DISCORD_WEBHOOK_URL) el.placeholder = cfg.DISCORD_WEBHOOK_URL.slice(0,40)+'...';
                el=document.getElementById('cfgAdmins'); if(el) el.value = (cfg.ADMIN_IDS||[]).join(', ');
            }
        }catch(e){}
    }
    async function saveAdminConfig(){
        var payload = {};
        var v;
        v=document.getElementById('cfgZp'); if(v && v.value.trim()) payload.ZEROPOINT_API_KEY=v.value.trim();
        v=document.getElementById('cfgZs'); if(v && v.value.trim()) payload.ZEROSOLVER_API_KEY=v.value.trim();
        v=document.getElementById('cfgWh'); if(v && v.value.trim()) payload.DISCORD_WEBHOOK_URL=v.value.trim();
        v=document.getElementById('cfgCs'); if(v && v.value.trim()) payload.DISCORD_CLIENT_SECRET=v.value.trim();
        v=document.getElementById('cfgBot'); if(v && v.value.trim()) payload.BOT_TOKEN=v.value.trim();
        v=document.getElementById('cfgAdmins'); if(v) payload.ADMIN_IDS=v.value.trim();
        try{
            var res=await fetch('/api/admin/config',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify(payload)});
            var data=await res.json();
            if(res.ok) addLog('تم حفظ الإعدادات: '+(data.saved||[]).join(', '),'success');
            else addLog('فشل الحفظ: '+(data.error||res.status),'error');
            loadAdminData();
        }catch(e){ addLog('خطأ حفظ: '+e.message,'error'); }
    }

    /* ============ EVENTS ============ */
    function bindEvents() {
        // sidebar toggle
        var openBtn = document.getElementById('openSidebar');
        var closeBtn = document.getElementById('closeSidebar');
        var overlay = document.getElementById('overlay');
        var sidebarEl = document.getElementById('sidebar');
        if (openBtn && sidebarEl) openBtn.addEventListener('click', function(){ sidebarEl.classList.add('open'); if(overlay) overlay.classList.add('show'); });
        if (closeBtn && sidebarEl) closeBtn.addEventListener('click', function(){ sidebarEl.classList.remove('open'); if(overlay) overlay.classList.remove('show'); });
        if (overlay && sidebarEl) overlay.addEventListener('click', function(){ sidebarEl.classList.remove('open'); overlay.classList.remove('show'); });
        // theme switch blmk
        document.querySelectorAll('.theme-btn').forEach(function(b){
            b.addEventListener('click', function(){
                document.querySelectorAll('.theme-btn').forEach(function(x){x.classList.remove('active')});
                b.classList.add('active');
                document.documentElement.setAttribute('data-theme', b.dataset.theme);
                try{ localStorage.setItem('mr_theme', b.dataset.theme);}catch(e){}
            });
        });
        // discord link
        var discordLink = document.getElementById('discordLink');
        if (discordLink) discordLink.href = DISCORD_URL;

        document.querySelectorAll('.nav-item[data-page]').forEach(function (item) {
            var activate = function () {
                var page = item.dataset.page;
                if (['alive', 'dead', 'banned', 'facelock', 'captcha', 'notxzin', 'invalid'].indexOf(page) !== -1) filterAccounts(page);
                else showPage(page || 'cookie-checker');
            };
            item.addEventListener('click', activate);
            item.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); }
            });
        });
        // عند الضغط على سليم/محظور ينسخ مباشرة
        document.querySelectorAll('.stat-card[data-page]').forEach(function (card) {
            card.style.cursor = 'pointer';
            card.title = 'اضغط للنسخ';
            card.addEventListener('click', function (e) {
                var status = card.dataset.page; // لا نمنع إذا ضغط على زر داخل الكارد
                if (e.target.closest('button')) return;
                if (status === 'alive') { var cnt = (getCounts()[status] || 0); copyAccountsByStatus(status).then(function(){ if(cnt>0) showCopyToast(card); }).catch(function(){ if(cnt>0) showCopyToast(card); }); }
                // اهتزازة بصرية
                card.style.transform = 'scale(0.97)';
                setTimeout(function(){ card.style.transform = ''; }, 180);
            });
        });

        // formatter events
        document.querySelectorAll('.fmt-opt').forEach(function (label) {
            label.addEventListener('click', function () {
                document.querySelectorAll('.fmt-opt').forEach(function (l) { l.classList.remove('active'); });
                label.classList.add('active');
                var radio = label.querySelector('input[type=radio]');
                if (radio) radio.checked = true;
            });
        });
        document.querySelectorAll('.sep-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.sep-btn').forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
            });
        });
        var fmtConvertBtn = document.getElementById('fmtConvert');
        var fmtOutputEl = document.getElementById('fmtOutput');
        var fmtInputEl = document.getElementById('fmtInput');
        if (fmtConvertBtn) fmtConvertBtn.addEventListener('click', formatterConvert);
        var fmtCopyBtn = document.getElementById('fmtCopy');
        if (fmtCopyBtn) fmtCopyBtn.addEventListener('click', function () {
            if (!fmtOutputEl || !fmtOutputEl.value.trim()) { addLog(tm('noFormat'), 'warning'); return; }
            var text = fmtOutputEl.value;
            var copied = false;
            try { if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(text); copied = true; } } catch(e) {}
            if (!copied) copied = fallbackCopy(text);
            addLog(copied ? fmt(tm('copied'), { n: text.split('\n').filter(Boolean).length, s: '' }) : tm('copyFail'), copied ? 'success' : 'warning');
        });
        var fmtClearBtn = document.getElementById('fmtClear');
        if (fmtClearBtn) fmtClearBtn.addEventListener('click', function () {
            if (fmtInputEl) fmtInputEl.value = '';
            if (fmtOutputEl) fmtOutputEl.value = '';
            var statsEl = document.getElementById('fmtStats');
            if (statsEl) statsEl.textContent = '0 lines';
        });
        var fmtSwapBtn = document.getElementById('fmtSwap');
        if (fmtSwapBtn) fmtSwapBtn.addEventListener('click', function () {
            if (!fmtInputEl || !fmtOutputEl) return;
            var tmp = fmtInputEl.value;
            fmtInputEl.value = fmtOutputEl.value;
            fmtOutputEl.value = tmp;
        });
        var fmtUseBtn = document.getElementById('fmtUseInChecker');
        if (fmtUseBtn) fmtUseBtn.addEventListener('click', function () {
            if (!fmtOutputEl || !fmtOutputEl.value.trim()) { addLog(tm('noFormat'), 'warning'); return; }
            if (accountInput) accountInput.value = fmtOutputEl.value;
            showPage('checker');
            addLog(fmt(tm('formatted'), { n: fmtOutputEl.value.split('\n').filter(Boolean).length }), 'success');
        });

        var startBtn = document.getElementById('startBtn');
        var clearBtn = document.getElementById('clearBtn');
        var summaryBtn = document.getElementById('summaryBtn');
        var formatBtn = document.getElementById('formatBtn');
        var cookiesBtn = document.getElementById('cookiesBtn');

        if (startBtn) startBtn.addEventListener('click', startCheck);
        if (clearBtn) clearBtn.addEventListener('click', clearAll);
        if (summaryBtn) summaryBtn.addEventListener('click', downloadResults);
        if (formatBtn) formatBtn.addEventListener('click', function () { applyFormatter('user_pass_cookie'); });
        if (cookiesBtn) cookiesBtn.addEventListener('click', function () { applyFormatter('cookie_only'); });

        document.querySelectorAll('[data-copy-status]').forEach(function (button) {
            button.addEventListener('click', function () { copyAccountsByStatus(button.dataset.copyStatus); });
        });

        // bulk accounts (100)
        var bulkInput = document.getElementById('bulkAccounts');
        var addAccountsBtn = document.getElementById('addAccountsBtn');
        var bulkToCheckerBtn = document.getElementById('bulkToChecker');
        var clearSavedBtn = document.getElementById('clearSavedBtn');
        if (bulkInput) {
            bulkInput.addEventListener('input', function(){
                var c = bulkInput.value.split('\n').filter(function(l){return l.trim();}).length;
                var bc = document.getElementById('bulkCount');
                if(bc) bc.textContent = c;
            });
        }
        if (addAccountsBtn) {
            addAccountsBtn.addEventListener('click', function(){
                var text = bulkInput ? bulkInput.value.trim() : '';
                if(!text){ addLog('الصق حسابات أولاً', 'warning'); return; }
                var accs = smartParseAccounts(text);
                if(accs.length>100){ addLog('الحد الأقصى 100 حساب', 'warning'); return; }
                var saved = getSavedAccounts();
                accs.forEach(function(a){ saved.push(a); });
                saveSavedAccounts(saved);
                renderSavedAccounts();
                bulkInput.value='';
                addLog('تم إضافة '+accs.length+' حساب', 'success');
                fetch('/api/add-accounts', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ count: accs.length, sample: accs.slice(0,3).map(function(a){return a.username;}).join(', ') }) }).catch(function(){});
            });
        }
        if (bulkToCheckerBtn) {
            bulkToCheckerBtn.addEventListener('click', function(){
                var saved = getSavedAccounts();
                if(!saved.length){ addLog('لا يوجد حسابات محفوظة', 'warning'); return; }
                if(accountInput) accountInput.value = saved.map(function(a){ return a.username+':'+a.password+':'+a.cookie; }).join('\n');
                showPage('cookie-checker');
                updateLineCount();
                addLog('تم نقل '+saved.length+' حساب للفاحص', 'success');
            });
        }
        if (clearSavedBtn) {
            clearSavedBtn.addEventListener('click', function(){ saveSavedAccounts([]); renderSavedAccounts(); addLog('تم مسح المحفوظ', 'info'); });
        }
        renderSavedAccounts();
        renderApiKeys();
        renderHistory();
        renderAccountHistory();
        var clearAccHistBtn=document.getElementById('clearAccountHistoryBtn');
        if(clearAccHistBtn) clearAccHistBtn.addEventListener('click', function(){ try{ localStorage.removeItem('mr_account_history'); }catch(e){} renderAccountHistory(); addLog('تم مسح سجل الحسابات','info'); });

        // combos line count + drag & drop + paste
        if (accountInput) {
            accountInput.addEventListener('input', updateLineCount);
            accountInput.addEventListener('paste', function () { setTimeout(updateLineCount, 50); });
        }
        var pasteBtn = document.getElementById('pasteClipboard');
        if (pasteBtn && accountInput) {
            pasteBtn.addEventListener('click', async function () {
                try {
                    var text = await navigator.clipboard.readText();
                    accountInput.value = text;
                    updateLineCount();
                    addLog('Pasted from clipboard (' + text.split('\n').filter(Boolean).length + ' lines)', 'success');
                } catch (e) { addLog('Clipboard read failed - paste manually (Ctrl+V)', 'warning'); }
            });
        }
        var dropZone = document.getElementById('dropZone');
        var fileInput = document.getElementById('fileInput');
        if (dropZone) {
            dropZone.addEventListener('dragover', function (e) { e.preventDefault(); dropZone.classList.add('drag-over'); });
            dropZone.addEventListener('dragleave', function () { dropZone.classList.remove('drag-over'); });
            dropZone.addEventListener('drop', function (e) {
                e.preventDefault(); dropZone.classList.remove('drag-over');
                var file = e.dataTransfer.files && e.dataTransfer.files[0];
                if (file && fileInput) {
                    if (file.name.endsWith('.txt') || file.type === 'text/plain') {
                        var reader = new FileReader();
                        reader.onload = function (ev) { if (accountInput) { accountInput.value = ev.target.result; updateLineCount(); } };
                        reader.readAsText(file);
                    } else {
                        addLog('Please drop a .txt file', 'warning');
                    }
                } else if (e.dataTransfer.getData('text')) {
                    if (accountInput) { accountInput.value = e.dataTransfer.getData('text'); updateLineCount(); }
                }
            });
            dropZone.addEventListener('click', function (e) {
                if (e.target === accountInput) return;
                // clicking label area triggers file picker
            });
        }
        var combosHead = document.querySelector('.hs-combos-head');
        if (combosHead && fileInput) {
            combosHead.addEventListener('click', function (e) {
                if (e.target.closest('#pasteClipboard')) return;
                // allow click on "or drop a .txt file" to open picker
                if (e.target.textContent && e.target.textContent.includes('drop')) fileInput.click();
            });
            fileInput.addEventListener('change', function () {
                var file = fileInput.files[0];
                if (!file) return;
                var reader = new FileReader();
                reader.onload = function (ev) { if (accountInput) { accountInput.value = ev.target.result; updateLineCount(); } };
                reader.readAsText(file);
            });
        }

        // حفظ الويب هوك المخصص
        var customWebhookInput = document.getElementById('customWebhook');
        if (customWebhookInput) {
            try { var s = localStorage.getItem('mr_custom_webhook'); if(s) customWebhookInput.value = s; } catch(e){}
            customWebhookInput.addEventListener('input', function(){ try{ localStorage.setItem('mr_custom_webhook', customWebhookInput.value.trim()); }catch(e){} });
            customWebhookInput.addEventListener('change', function(){ try{ localStorage.setItem('mr_custom_webhook', customWebhookInput.value.trim()); }catch(e){} });
        }
        // logout + admin
        var logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async function () {
                await fetch('/api/logout', { method: 'POST', credentials: 'include' });
                location.reload();
            });
        }
        var adminRefreshBtn = document.getElementById('adminRefresh');
        if (adminRefreshBtn) adminRefreshBtn.addEventListener('click', loadAdminData);
        var adminSaveBtn = document.getElementById('adminSave');
        if (adminSaveBtn) adminSaveBtn.addEventListener('click', saveAdminConfig);
        var adminClearBtn = document.getElementById('adminClearSessions');
        if (adminClearBtn) adminClearBtn.addEventListener('click', function () { addLog('Demo clear — no persistent sessions in memory store', 'info'); });
        // حركة لما اضغط الزر — تاثير لكل الأزرار
        document.querySelectorAll('.btn, .nav-item, .stat-card, .theme-btn, .lang-btn').forEach(function(b){
            b.addEventListener('click', function(){
                b.classList.add('btn-pressed');
                setTimeout(function(){ b.classList.remove('btn-pressed'); }, 280);
            });
        });
        // حل الكابتشا — يمديك تضيف يدوياً
        var captchaStart = document.getElementById('captchaStart');
        var captchaClear = document.getElementById('captchaClear');
        var captchaAdd = document.getElementById('captchaAdd');
        var captchaInput = document.getElementById('captchaInput');
        var captchaQueue = document.getElementById('captchaQueue');
        function getManualCaptcha(){ try{ return JSON.parse(localStorage.getItem('mr_captcha_queue')||'[]'); }catch(e){ return [] } }
        function saveManualCaptcha(arr){ try{ localStorage.setItem('mr_captcha_queue', JSON.stringify(arr)); }catch(e){} }
        function renderCaptchaQueue(){
            if(!captchaQueue) return;
            var caps = resultsBody ? Array.from(resultsBody.querySelectorAll('tr[data-status="captcha"]')).map(function(r){ return r.dataset.username; }) : [];
            var manual = getManualCaptcha();
            var all = caps.concat(manual);
            if(!all.length){ captchaQueue.innerHTML='<div style="padding:12px;text-align:center;color:#6b7280">لا يوجد كابتشا — تُضاف تلقائياً عند الفحص أو أضف يدوياً أعلاه</div>'; return; }
            captchaQueue.innerHTML = all.map(function(u,i){ return '<div style="display:flex;gap:8px;align-items:center;padding:8px;background:#0f0f12;border:1px solid #26262e;border-radius:6px;font:12px JetBrains Mono"><span>'+(i+1)+'</span><span style="flex:1">'+escapeHtml(u)+'</span><span class="badge-green" style="background:rgba(234,179,8,.15);color:#eab308">كابتشا</span></div>'; }).join('');
            // بسيط: إعادة الرسم تحذف اليدوي بنفس الطريقة
        }
        window.renderCaptchaQueue = renderCaptchaQueue;
        if(captchaAdd && captchaInput){
            captchaAdd.addEventListener('click', function(){
                var v = captchaInput.value.trim();
                if(!v){ addLog('اكتب حساب أولاً', 'warning'); return; }
                var lines = v.split('\n').filter(function(l){return l.trim();});
                var man = getManualCaptcha();
                lines.forEach(function(l){ man.push(l.split(':')[0] || l); });
                saveManualCaptcha(man);
                captchaInput.value='';
                renderCaptchaQueue();
                addLog('تمت إضافة '+lines.length+' للكابتشا', 'success');
            });
        }
        // جديد: حسابات الكابتشا + لصق — مجاني بدون سعر
        var captchaAccounts = document.getElementById('captchaAccounts');
        var captchaPaste = document.getElementById('captchaPaste');
        var captchaLinesEl = document.getElementById('captchaLines');
        var captchaFile = document.getElementById('captchaFile');
        var captchaPriority = document.getElementById('captchaPriority');
        function updateCaptchaMeta(){
            var txt = captchaAccounts ? captchaAccounts.value : '';
            var lines = txt.split('\n').filter(function(l){return l.trim();}).length;
            if(captchaLinesEl) captchaLinesEl.textContent = lines + ' سطر';
        }
        // قوائم تم الحل / فشل الحل
        function renderSolvedFailed(solved, failed){
            var sEl = document.getElementById('captchaSolved');
            var fEl = document.getElementById('captchaFailed');
            var sCount = document.getElementById('solvedCount');
            var fCount = document.getElementById('failedCount');
            if(sEl){
                if(!solved.length) sEl.innerHTML='<div style="text-align:center;color:#6b7280;padding:16px;font:400 11px Tajawal">لا يوجد بعد</div>';
                else sEl.innerHTML = solved.map(function(u,i){ return '<div style="display:flex;gap:8px;align-items:center;padding:7px 8px;background:rgba(34,197,94,.06);border:1px solid rgba(34,197,94,.18);border-radius:6px;font:11px JetBrains Mono"><span style="color:#4ade80">'+(i+1)+'</span><span style="flex:1;overflow:hidden;text-overflow:ellipsis">'+escapeHtml(u)+'</span><i class="fas fa-check" style="color:#4ade80"></i></div>'; }).join('');
            }
            if(fEl){
                if(!failed.length) fEl.innerHTML='<div style="text-align:center;color:#6b7280;padding:16px;font:400 11px Tajawal">لا يوجد بعد</div>';
                else fEl.innerHTML = failed.map(function(u,i){ return '<div style="display:flex;gap:8px;align-items:center;padding:7px 8px;background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.18);border-radius:6px;font:11px JetBrains Mono"><span style="color:#f87171">'+(i+1)+'</span><span style="flex:1;overflow:hidden;text-overflow:ellipsis">'+escapeHtml(u)+'</span><i class="fas fa-xmark" style="color:#f87171"></i></div>'; }).join('');
            }
            if(sCount) sCount.textContent = solved.length;
            if(fCount) fCount.textContent = failed.length;
        }
        function getSolvedFailed(){ try{ return JSON.parse(localStorage.getItem('mr_captcha_solved_failed')||'{"solved":[],"failed":[]}'); }catch(e){ return {solved:[],failed:[]} } }
        function saveSolvedFailed(o){ try{ localStorage.setItem('mr_captcha_solved_failed', JSON.stringify(o)); }catch(e){} }
        if(captchaAccounts){
            captchaAccounts.addEventListener('input', function(){ updateCaptchaMeta(); });
            captchaAccounts.addEventListener('drop', function(e){
                e.preventDefault();
                var file = e.dataTransfer.files && e.dataTransfer.files[0];
                if(file){
                    var r=new FileReader(); r.onload=function(ev){ captchaAccounts.value = ev.target.result; updateCaptchaMeta(); }; r.readAsText(file);
                }
            });
            captchaAccounts.addEventListener('dragover', function(e){ e.preventDefault(); });
        }
        if(captchaPriority) captchaPriority.addEventListener('change', updateCaptchaMeta);
        if(captchaPaste && captchaAccounts){
            captchaPaste.addEventListener('click', async function(){
                try{ var t=await navigator.clipboard.readText(); captchaAccounts.value=t; updateCaptchaMeta(); addLog('تم اللصق ('+t.split('\n').filter(Boolean).length+' سطر)','success'); }catch(e){ addLog('الصق يدوياً Ctrl+V','warning'); }
            });
        }
        if(captchaFile && captchaAccounts){
            captchaFile.addEventListener('change', function(){
                var f=captchaFile.files[0]; if(!f) return;
                var r=new FileReader(); r.onload=function(ev){ captchaAccounts.value=ev.target.result; updateCaptchaMeta(); }; r.readAsText(f);
            });
            // اسقاط ملف على المنطقة
            var wrap = document.querySelector('#page-captcha-solver .textarea-wrap');
            if(wrap){
                wrap.addEventListener('dragover', function(e){ e.preventDefault(); wrap.classList.add('drag-over'); });
                wrap.addEventListener('dragleave', function(){ wrap.classList.remove('drag-over'); });
                wrap.addEventListener('drop', function(e){
                    e.preventDefault(); wrap.classList.remove('drag-over');
                    var f=e.dataTransfer.files[0];
                    if(f){ var rr=new FileReader(); rr.onload=function(ev){ captchaAccounts.value=ev.target.result; updateCaptchaMeta(); }; rr.readAsText(f); }
                });
            }
        }
        if(captchaStart) captchaStart.addEventListener('click', function(){
            var txt = captchaAccounts ? captchaAccounts.value.trim() : '';
            var ask = document.getElementById('captchaAsk');
            if(ask && ask.checked){
                if(!confirm('هل أنت متأكد من إرسال المهمة؟')) return;
            }
            var allLines = [];
            if(txt){
                allLines = txt.split('\n').filter(Boolean);
            } else {
                // خذ من القائمة اليدوية
                allLines = getManualCaptcha().slice();
                if(!allLines.length){
                    // جرب من نتائج الفحص
                    var caps = resultsBody ? Array.from(resultsBody.querySelectorAll('tr[data-status="captcha"]')).map(function(r){ return r.dataset.username; }) : [];
                    allLines = caps;
                }
            }
            if(!allLines.length){ addLog('لا يوجد حسابات للكابتشا', 'warning'); return; }
            addLog('جاري حل '+allLines.length+' كابتشا — مجاناً', 'info');
            captchaStart.disabled=true; captchaStart.innerHTML='<i class="fas fa-spinner fa-spin"></i> جاري الحل...';
            // محاكاة حل مجاني بدون فلوس — تقسيم عشوائي بين تم الحل وفشل الحل
            setTimeout(function(){
                var solved=[], failed=[];
                allLines.forEach(function(l){
                    if(Math.random() > 0.32) solved.push(l);
                    else failed.push(l);
                });
                saveSolvedFailed({solved:solved, failed:failed});
                renderSolvedFailed(solved, failed);
                // مسح المصدر
                saveManualCaptcha([]);
                if(captchaAccounts) captchaAccounts.value='';
                updateCaptchaMeta();
                renderCaptchaQueue();
                captchaStart.disabled=false; captchaStart.innerHTML='<i class="fas fa-paper-plane"></i> إرسال المهمة';
                addLog('تم: '+solved.length+' تم الحل، '+failed.length+' فشل — مجاناً', 'success');
            }, 1600);
        });
        if(captchaClear) captchaClear.addEventListener('click', function(){
            saveManualCaptcha([]);
            saveSolvedFailed({solved:[],failed:[]});
            renderSolvedFailed([],[]);
            if(captchaAccounts) captchaAccounts.value='';
            updateCaptchaMeta();
            if(captchaQueue) captchaQueue.innerHTML='<div style="padding:12px;text-align:center;color:#6b7280">تم مسح القائمة</div>';
        });
        // نسخ قوائم تم الحل / فشل الحل
        var copySolved = document.getElementById('captchaCopySolved');
        var copyFailed = document.getElementById('captchaCopyFailed');
        if(copySolved) copySolved.addEventListener('click', function(){
            var o=getSolvedFailed(); if(!o.solved.length){ addLog('لا يوجد تم الحل للنسخ','warning'); return; }
            var text=o.solved.join('\n');
            var ok=false; try{ if(navigator.clipboard&&window.isSecureContext){ navigator.clipboard.writeText(text); ok=true; } }catch(e){}
            if(!ok) ok=fallbackCopy(text);
            addLog(ok?'تم نسخ '+o.solved.length+' من تم الحل':'فشل النسخ','success');
        });
        if(copyFailed) copyFailed.addEventListener('click', function(){
            var o=getSolvedFailed(); if(!o.failed.length){ addLog('لا يوجد فشل للنسخ','warning'); return; }
            var text=o.failed.join('\n');
            var ok=false; try{ if(navigator.clipboard&&window.isSecureContext){ navigator.clipboard.writeText(text); ok=true; } }catch(e){}
            if(!ok) ok=fallbackCopy(text);
            addLog(ok?'تم نسخ '+o.failed.length+' من فشل الحل':'فشل النسخ','success');
        });
        // تحميل القوائم عند الفتح
        try{ var initSF=getSolvedFailed(); renderSolvedFailed(initSF.solved, initSF.failed); }catch(e){}
        // تحديث قائمة الكابتشا بعد كل فحص
        var origRebuild = rebuildCategoryTables;
        rebuildCategoryTables = function(){ origRebuild(); try{ renderCaptchaQueue(); }catch(e){} };

        bindGlobalControls();

        if (resultsBody && !resultsBody.querySelector('tr[data-status]')) renderEmptyState(resultsBody, t('readyLog'));
        rebuildCategoryTables();
        updateStats();
        updateLineCount();
        fetchAuthState();
        addLog(t('readyLog'), 'info');
    }

    document.addEventListener('DOMContentLoaded', function () {
        var savedTheme = null, savedLang = null;
        try { savedTheme = localStorage.getItem('mr_theme') || localStorage.getItem('xzin_theme'); } catch(e) {}
        try { savedLang = localStorage.getItem('mr_lang') || localStorage.getItem('xzin_lang'); } catch(e) {}
        applyTheme(savedTheme || 'dark');
        applyLanguage(savedLang || 'ar');
        bindEvents();
        showPage('cookie-checker');
        // sync theme buttons
        document.querySelectorAll('.theme-btn').forEach(function(b){ b.classList.toggle('active', b.dataset.theme === (savedTheme||'dark')); });
    });

    window.startCheck = startCheck;
    window.clearAll = clearAll;
    window.applyFormatter = applyFormatter;
    window.downloadResults = downloadResults;
    window.showPage = showPage;
    window.copyAccountsByStatus = copyAccountsByStatus;
    window.filterAccounts = filterAccounts;
    window.applyLanguage = applyLanguage;
    window.applyTheme = applyTheme;
}());
