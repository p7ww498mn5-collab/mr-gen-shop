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
            },
            navLabel: 'Overview', navOverview: 'Overview', navAccounts: 'Accounts', navChecker: 'Cookie Checker', navCaptcha: 'Solve Captcha', navFormatter: 'Formatter', navHistory: 'History', navAdmin: 'Admin',
            footMarket: 'MR market', loginDiscord: 'Login with Discord', loginHint: 'Login so you can check accounts', logout: 'Logout',
            topbarTitle: 'Cookie Checker', topbarPill: 'Supports 100 accounts at once',
            checkerTitle: 'Cookie Checker',             checkerSub1: 'Paste up to', checkerSub2: 'accounts in', checkerSub3: 'format or', checkerSubCode: 'user:pass', checkerSubCode2: 'user:pass:cookie',             checkerSub: 'Paste up to 100 accounts in user:pass:cookie or user:pass format and press check. The animated word', checkerSubEnd: 'appears while checking.', checkerInputTitle: 'Accounts', dropHint: 'Drag a .txt file here', resultsTitle: 'Results', copyAll: 'Copy all',
            loginReqTitle: 'You must login with Discord first to check', loginReqBtn: 'Login',
            clearAcc: 'Clear accounts', uploadTxt: 'Upload .txt', pasteBtn: 'Paste',
            statTotal: 'Total', statAlive: 'Alive', statDead: 'Dead', statBanned: 'Banned', statFacelock: 'Locked', statCaptcha: 'Captcha',
            resultsUsername: 'USERNAME', resultsStatus: 'STATUS', logReady: 'Ready to check...',
            capTitle: 'Solve Captcha', capSub1: 'Paste accounts in', capSub2: 'format (cookie must contain', capSub3: ') and press solve — the system sends them to MR Solver.', capLoginReq: 'You must login with Discord first to solve captcha', capClear: 'Clear', capUpload: 'Upload .txt', capType: 'Solve type:', capTypeIngame: 'In-game (default)', capTypeUnlock: 'Unlock (captcha-lock)', capSolve: 'Solve Captcha', capResults: 'Results', capSolved: 'Solved', capAlready: 'Already solved', capFailed: 'Failed', capDownload: 'Download solved.txt', capReady: 'Ready to solve captcha...', capPricing: 'Min 30 accounts • 30 accounts = 2.5 SAR • 2.5 SAR balance required',
            accTitle: 'Accounts', accSub: 'Add up to 100 accounts at once in', accAdd: 'Add accounts', accToChecker: 'Check in cookie checker', accReady: 'accounts ready', accList: 'Saved accounts list', accClearSaved: 'Clear',
            clearAcctHist: 'Clear',
            fmtInput: 'Input', fmtOutput: 'Output', fmtConvert: 'Convert', fmtCopy: 'Copy', fmtClear: 'Clear', fmtUse: 'Use', fmtStats: '0 lines', fmtDownload: 'Download', fmtTitle: 'Formatter', fmtDesc: 'Reformat accounts between formats instantly with live stats.', fmtUpload: 'Upload file', fmtSwap: 'Swap', fmtTarget: 'Target format', fmtUserPass: 'user:pass', fmtUserPassCookie: 'user:pass:cookie', fmtCookieOnly: 'cookie', fmtUserOnly: 'user', fmtPassOnly: 'pass', fmtJson: 'JSON', fmtSeparator: 'Separator', fmtStatTotal: 'Total', fmtStatCookie: 'With cookie', fmtStatCookieOnly: 'Cookie only', fmtStatValid: 'Valid', fmtDetectHint: 'Paste accounts to see live stats...', fmtDetected: 'Detected: {f}', adminPanel: 'Admin Panel', adminOnly: 'Admin only', adminConfig: 'System Settings', adminTokens: 'Tokens', adminBot: 'Bot & Permissions', adminPayment: 'Payment Settings', adminCurrent: 'Current Server Config', adminPendingTitle: 'Pending Recharge Requests', adminUsersTitle: 'Registered Users', adminAuthorize: 'Authorize', adminBotInvite: "Bot's invite to server", adminBotInviteText: 'The bot needs an invite:', adminRestart: 'After saving, restart the bot:', adminNeededLogin: 'required for login', adminRajhi: 'Al Rajhi', adminBrag: 'BRAG', filterAll: 'All',
            walletTitle: 'Wallet', walletSub: 'Balance is deducted when solving captcha (cost:', walletBalanceLabel: 'Your current balance', walletChargeBtn: 'Recharge balance', rechargeFormTitle: 'Recharge request', rechargeAmount: 'Amount', rechargeMethod: 'Payment method', rechargeBrag: 'BRAG — phone number:', rechargeIban: 'Al Rajhi — IBAN:', rechargeName: 'Name:', rechargeReceipt: 'Receipt image', rechargeSubmit: 'Send request', rechargeHistoryTitle: 'Recharge history', noRecharges: 'None',
            adminTitle: 'Admin Panel', adminSub: 'Linked to the site — login with Discord then edit tokens and run the bot. This menu only appears for you.', authorize: 'Authorize:', authorizeLink: 'click here to login with Discord', botInvite: "Bot's invite to server", cfgZpL: 'ZEROPOINT_API_KEY', cfgZsL: 'ZAPZONEX_API_KEY', cfgWhL: 'DISCORD_WEBHOOK_URL', cfgCsL: 'DISCORD_CLIENT_SECRET (required for login)', cfgBotL: 'BOT_TOKEN (to run bot)', cfgAdminsL: 'ADMIN_IDS (comma separated)', cfgIbanL: 'RECEIVE_IBAN (Al Rajhi receive account)', cfgBragL: 'RECEIVE_BRAG_NUMBER (BRAG phone for receiving)', cfgNameL: 'RECEIVE_NAME (account holder name)', cfgCostL: 'CAPTCHA_COST (captcha cost per account)', adminSave: 'Save & run', adminRefresh: 'Refresh', adminNote: 'After saving, restart the bot:', pendingTitle: 'Pending recharge requests', usersTitle: 'Registered users',
            statusPending: 'Pending', statusProcessing: 'Processing', statusCompleted: 'Completed', statusFailed: 'Failed', statusCancelled: 'Cancelled',
            userBalanceLabel: 'Balance: '
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
            },
            navLabel: 'نظرة عامة', navOverview: 'نظرة عامة', navAccounts: 'الحسابات', navChecker: 'فاحص الكوكيز', navCaptcha: 'حل كابتشا', navFormatter: 'المنسق', navHistory: 'السجل', navAdmin: 'الادمن',
            footMarket: 'MR market', loginDiscord: 'تسجيل دخول بالديسكورد', loginHint: 'سجل دخولك عشان تقدر تفحص', logout: 'تسجيل الخروج',
            topbarTitle: 'فاحص الكوكيز', topbarPill: 'يدعم 100 حساب دفعة واحدة',
            checkerTitle: 'فاحص الكوكيز',             checkerSub1: 'الصق حتى', checkerSub2: 'حساب بصيغة', checkerSub3: 'أو', checkerSubCode: 'user:pass', checkerSubCode2: 'user:pass:cookie',             checkerSub: 'الصق حتى 100 حساب بصيغة user:pass:cookie أو user:pass واضغط فحص. الكلمة المتحركة', checkerSubEnd: 'تظهر أثناء الفحص.', checkerInputTitle: 'الحسابات', dropHint: 'اسحب ملف .txt هنا', resultsTitle: 'النتائج', copyAll: 'نسخ الكل',
            loginReqTitle: 'يجب تسجيل الدخول بالديسكورد أولاً للفحص', loginReqBtn: 'تسجيل دخول',
            clearAcc: 'مسح الحسابات', uploadTxt: 'رفع ملف .txt', pasteBtn: 'لصق',
            statTotal: 'الإجمالي', statAlive: 'سليم', statDead: 'ميت', statBanned: 'محظور', statFacelock: 'مقفل', statCaptcha: 'كابتشا',
            resultsUsername: 'اسم المستخدم', resultsStatus: 'الحالة', logReady: 'جاهز للفحص...',
            capTitle: 'حل كابتشا', capSub1: 'الصق الحسابات بصيغة', capSub2: 'الكوكي لازم يحتوي', capSub3: ') واضغط حل — النظام يرسلها لـ MR Solver ويحل الكابتشا.', capLoginReq: 'يجب تسجيل الدخول بالديسكورد أولاً لحل الكابتشا', capClear: 'مسح', capUpload: 'رفع ملف .txt', capType: 'نوع الحل:', capTypeIngame: 'في اللعبة (افتراضي)', capTypeUnlock: 'فك القفل (captcha-lock)', capSolve: 'حل الكابتشا', capResults: 'النتائج', capSolved: 'تم الحل', capAlready: 'أصلاً محلول', capFailed: 'فشل', capDownload: 'تحميل solved.txt', capReady: 'جاهز لحل الكابتشا...', capPricing: 'الحد الأدنى 30 حساب • سعر 30 حساب = 2.5 ريال • مطلوب رصيد 2.5 ريال',
            accTitle: 'الحسابات', accSub: 'أضف حتى 100 حساب مرة واحدة بصيغة', accAdd: 'إضافة الحسابات', accToChecker: 'فحص في فاحص الكوكيز', accReady: 'حساب جاهز', accList: 'قائمة الحسابات المحفوظة', accClearSaved: 'مسح',
            clearAcctHist: 'مسح',
            fmtInput: 'المدخل', fmtOutput: 'المخرج', fmtConvert: 'تحويل', fmtCopy: 'نسخ', fmtClear: 'مسح', fmtUse: 'استخدم', fmtStats: '0 سطر', fmtDownload: 'تحميل', fmtTitle: 'المنسق', fmtDesc: 'نسّق الحسابات بين الصيغ المختلفة فورياً مع عرض الإحصائيات.', fmtUpload: 'رفع ملف', fmtSwap: 'تبديل', fmtTarget: 'الصيغة المطلوبة', fmtUserPass: 'user:pass', fmtUserPassCookie: 'user:pass:cookie', fmtCookieOnly: 'cookie', fmtUserOnly: 'user', fmtPassOnly: 'pass', fmtJson: 'JSON', fmtSeparator: 'الفاصل', fmtStatTotal: 'الإجمالي', fmtStatCookie: 'فيها كوكي', fmtStatCookieOnly: 'كوكي فقط', fmtStatValid: 'صالح', fmtDetectHint: 'الصق الحسابات لعرض الإحصائيات...', fmtDetected: 'تم اكتشاف: {f}', adminPanel: 'لوحة التحكم', adminOnly: 'لك فقط', adminConfig: 'إعدادات النظام', adminTokens: 'التوكنات', adminBot: 'البوت والصلاحيات', adminPayment: 'إعدادات الدفع', adminCurrent: 'إعدادات السيرفر الحالية', adminPendingTitle: 'طلبات الشحن المعلقة', adminUsersTitle: 'المستخدمون المسجلون', adminAuthorize: 'تفويض', adminBotInvite: 'دعوة البوت للسيرفر', adminBotInviteText: 'البوت يحتاج دعوة:', adminRestart: 'بعد الحفظ، أعد تشغيل البوت:', adminNeededLogin: 'لازم لتسجيل الدخول', adminRajhi: 'الراجحي', adminBrag: 'برق', filterAll: 'الكل',
            walletTitle: 'المحفظة', walletSub: 'رصيدك يُخصم عند حل الكابتشا (التكلفة:', walletBalanceLabel: 'رصيدك الحالي', walletChargeBtn: 'اشحن الرصيد', rechargeFormTitle: 'طلب شحن', rechargeAmount: 'المبلغ', rechargeMethod: 'طريقة الدفع', rechargeBrag: 'برق — رقم الجوال:', rechargeIban: 'الراجحي — IBAN:', rechargeName: 'الاسم:', rechargeReceipt: 'صورة الإيصال', rechargeSubmit: 'إرسال الطلب', rechargeHistoryTitle: 'سجل الشحن', noRecharges: 'لا يوجد',
            adminTitle: 'لوحة الادمن', adminSub: 'مربوط على الموقع — سجل دخولك بالديسكورد ثم عدل التوكنات وشغل البوت. لن تظهر هذه القائمة إلا لك.', authorize: 'تفويض:', authorizeLink: 'اضغط هنا لتسجيل دخولك بالديسكورد', botInvite: 'دعوة البوت للسيرفر', cfgZpL: 'ZEROPOINT_API_KEY', cfgZsL: 'ZAPZONEX_API_KEY', cfgWhL: 'DISCORD_WEBHOOK_URL', cfgCsL: 'DISCORD_CLIENT_SECRET (لازم لتسجيل الدخول)', cfgBotL: 'BOT_TOKEN (لتشغيل البوت)', cfgAdminsL: 'ADMIN_IDS (افصل بفاصلة)', cfgIbanL: 'RECEIVE_IBAN (حساب الراجحي للاستقبال)', cfgBragL: 'RECEIVE_BRAG_NUMBER (رقم جوال برق للاستقبال)', cfgNameL: 'RECEIVE_NAME (اسم صاحب الحساب)', cfgCostL: 'CAPTCHA_COST (تكلفة حل الكابتشا لكل حساب)', adminSave: 'حفظ وشغّل', adminRefresh: 'تحديث', adminNote: 'بعد الحفظ، أعد تشغيل البوت:', pendingTitle: 'طلبات الشحن المعلقة', usersTitle: 'المستخدمون المسجلون',
            statusPending: 'بانتظار', statusProcessing: 'قيد المعالجة', statusCompleted: 'اكتمل', statusFailed: 'فشل', statusCancelled: 'ملغى',
            userBalanceLabel: 'رصيد: '
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
        var iconMap = { alive: 'fa-circle-check', dead: 'fa-circle-xmark', banned: 'fa-ban', facelock: 'fa-lock', captcha: 'fa-robot', error: 'fa-triangle-exclamation', notxzin: 'fa-minus-circle', invalid: 'fa-circle-question' };
        var icon = iconMap[normalized] || 'fa-circle';
        return '<span class="status-badge ' + cssClass + '"><i class="fas ' + icon + '"></i> ' + escapeHtml(label) + '</span>';
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
        var inCountEl = document.getElementById('fmtInCount');
        var outCountEl = document.getElementById('fmtOutCount');
        var detectEl = document.getElementById('fmtDetected');
        if (!inputEl || !outputEl) return;
        var text = inputEl.value;
        var totalIn = text.replace(/\r/g, '').split('\n').filter(function (l) { return l.trim(); }).length;
        if (inCountEl) inCountEl.textContent = String(totalIn);
        if (!text.trim()) {
            outputEl.value = '';
            if (statsEl) statsEl.textContent = currentLang === 'ar' ? '0 سطر' : '0 lines';
            if (outCountEl) outCountEl.textContent = '0';
            if (detectEl) detectEl.textContent = t('fmtDetectHint');
            addLog(tm('noFormat'), 'warning');
            return;
        }
        var selectedFmt = (document.querySelector('input[name="fmt"]:checked') || {}).value || 'user_pass';
        var activeSep = document.querySelector('.sep-btn.active');
        var sep = activeSep ? activeSep.dataset.sep : ((document.getElementById('fmtSepCustom') && document.getElementById('fmtSepCustom').value) || ':');
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
        if (outCountEl) outCountEl.textContent = String(lines.length);
        if (statsEl) statsEl.textContent = lines.length + (currentLang === 'ar' ? ' سطر' : ' lines');
        var withCookie = accounts.filter(function (a) { return a.cookie; }).length;
        var cookieOnly = accounts.filter(function (a) { return a.username === 'cookie_only'; }).length;
        if (detectEl) {
            detectEl.textContent = (currentLang === 'ar'
                ? 'الإجمالي: ' + accounts.length + ' • فيها كوكي: ' + withCookie + ' • كوكي فقط: ' + cookieOnly
                : 'Total: ' + accounts.length + ' • With cookie: ' + withCookie + ' • Cookie only: ' + cookieOnly);
        }
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

    var currentResultFilter = 'all';
    var currentResultSearch = '';
    function applyResultFilter() {
        if (!resultsBody) return;
        resultsBody.querySelectorAll('tr[data-status]').forEach(function (row) {
            var okStatus = currentResultFilter === 'all' || normalizeStatus(row.dataset.status) === currentResultFilter;
            var okSearch = !currentResultSearch || (row.dataset.username || '').toLowerCase().indexOf(currentResultSearch.toLowerCase()) !== -1;
            row.style.display = (okStatus && okSearch) ? '' : 'none';
        });
    }

    function setResultFilter(status) {
        currentResultFilter = (status === 'checker') ? 'all' : status;
        document.querySelectorAll('.filter-pill').forEach(function (x) { x.classList.toggle('active', x.dataset.filter === currentResultFilter); });
        applyResultFilter();
    }

    function updateStats() {
        var counts = getCounts();
        var total = 0;
        Object.keys(counts).forEach(function (status) { total += counts[status]; });
        var rcEl = document.getElementById('resultsCount'); if (rcEl) rcEl.textContent = total;
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
        // تحديث عدادات الفلاتر
        var setF = function (id, v) { var e = document.getElementById(id); if (e) e.textContent = v; };
        setF('fAll', total); setF('fAlive', counts.alive); setF('fDead', counts.dead);
        setF('fBanned', counts.banned); setF('fFacelock', counts.facelock); setF('fCaptcha', counts.captcha);
        applyResultFilter();
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
        var copyCell = document.createElement('td');
        var copyBtn = document.createElement('button'); copyBtn.className = 'btn btn-ghost btn-sm copy-row'; copyBtn.dataset.username = String(username || ''); copyBtn.title = 'نسخ'; copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyCell.appendChild(copyBtn);
        row.appendChild(numberCell); row.appendChild(usernameCell); row.appendChild(statusCell); row.appendChild(copyCell);
        return row;
    }

    function addResultToTable(username, status) {
        if (!resultsBody) return;
        var normalized = normalizeStatus(status) || 'error';
        accountCounter += 1;
        var empty = resultsBody.querySelector('.empty-row'); if (empty) empty.remove();
        resultsBody.appendChild(createResultRow(accountCounter, username, normalized));
        var card = document.getElementById('resultsCard'); if (card) card.style.display = 'block';
        var wrapper = document.getElementById('resultsWrapper'); if (wrapper) wrapper.style.display = 'block';
        var tb = document.getElementById('resultsToolbar'); if (tb) tb.style.display = 'flex';
        var rf = document.getElementById('resultFilter'); if (rf) rf.style.display = 'flex';
        updateStats();
        applyResultFilter();
    }

    function renderEmptyState(targetBody, message) {
        if (!targetBody) return;
        targetBody.replaceChildren();
        var row = document.createElement('tr'); row.className = 'empty-row';
        var cell = document.createElement('td'); cell.colSpan = 4; cell.textContent = message;
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
        var pg = document.getElementById('checkProgress'); if (pg) { pg.style.display = 'flex'; var pbar0 = document.getElementById('checkProgressBar'); if (pbar0) pbar0.style.width = '0%'; var pct0 = document.getElementById('checkProgressPct'); if (pct0) pct0.textContent = '0%'; }
        var startBtn = document.getElementById('startBtn');
        if (startBtn) { startBtn.disabled = true; startBtn.innerHTML = '<i class="fas fa-spinner checking-spinner"></i> <span class="checking-animated">Checking...</span>'; }
        addLog(fmt(tm('checking'), { n: accounts.length }), 'info');
        try {
            var result = await checkAccounts(accounts);
            if (!result || result.status === 'error') {
                var msg=(result && result.message) || tm('connFail');
                if (msg && msg.includes('تسجيل الدخول')) { addLog(msg,'error'); window.location.href='/auth/discord'; }
                else addLog(msg,'error');
                isRunning = false; resetStartButton(); if(ind) ind.style.display='none'; var pg=document.getElementById('checkProgress'); if(pg) pg.style.display='none'; return;
            }
            var results = Array.isArray(result.results) ? result.results : [];
            if (!results.length) { addLog(fmt(tm('noResults'), { s: result.status || 'unknown' }), 'warning'); isRunning = false; resetStartButton(); if(ind) ind.style.display='none'; var pg=document.getElementById('checkProgress'); if(pg) pg.style.display='none'; return; }
            // تدريجي — واحد واحد مو 100 دفعة واحدة
            var idx = 0;
            var total = results.length;
            function showNext(){
                if(idx >= total){
                    rebuildCategoryTables();
                    var counts = getCounts();
                    addLog(fmt(tm('complete'), { n: total, a: counts.alive, d: counts.dead, b: counts.banned, f: counts.facelock, c: counts.captcha }), 'success');
                    addHistoryEntry({ date: new Date().toISOString(), total: accounts.length, alive: counts.alive, dead: counts.dead, banned: counts.banned, facelock: counts.facelock, captcha: counts.captcha, status: 'completed', accounts: accounts });
                    isRunning = false; resetStartButton(); if(ind) ind.style.display='none'; var pg=document.getElementById('checkProgress'); if(pg) pg.style.display='none';
                    return;
                }
                var account = results[idx];
                var normalized = normalizeStatus(account && account.status) || 'error';
                addResultToTable(account && account.username ? account.username : 'unknown', normalized);
                idx++;
                if(ind) ind.innerHTML = '<i class="fas fa-spinner checking-spinner"></i> Checking... ' + idx + '/' + total + ' <span class="checking-dots"></span>';
                var pbar = document.getElementById('checkProgressBar'); if (pbar) pbar.style.width = Math.round((idx/total)*100) + '%';
                var pctEl = document.getElementById('checkProgressPct'); if (pctEl) pctEl.textContent = Math.round((idx/total)*100) + '%';
                // تمرير تلقائي لآخر جدول
                var wrapper = document.getElementById('resultsWrapper');
                if(wrapper) wrapper.scrollTop = wrapper.scrollHeight;
                setTimeout(showNext, 70);
            }
            showNext();
            return;
        } catch (error) {
            addLog('Error: ' + (error && error.message ? error.message : tm('connFail')), 'error');
            isRunning = false; resetStartButton(); if(ind) ind.style.display='none'; var pg=document.getElementById('checkProgress'); if(pg) pg.style.display='none';
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
        var card = document.getElementById('resultsCard'); if (card) card.style.display = 'none';
        var tb = document.getElementById('resultsToolbar'); if (tb) tb.style.display = 'none';
        var rf = document.getElementById('resultFilter'); if (rf) rf.style.display = 'none';
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
                var map = { 'cookie-checker':'فاحص الكوكيز','captcha-solver':'حل الكابتشا','wallet':'المحفظة','api-keys':'مفاتيح الـ API','accounts':'الحسابات','rmz':'RMZ','cart':'السلة','history':'السجل','admin':'Admin Panel','formatter':'المنسق','overview':'نظرة عامة' };
                topTitle.textContent = map[page] || page;
            }
            if (page === 'admin') loadAdminData();
        if (page === 'wallet' && window.__loadWallet) window.__loadWallet();
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
        if (page === 'wallet' && window.__loadWallet) window.__loadWallet();
    }

    /* ============ LANGUAGE & THEME ============ */
    function applyLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        document.documentElement.dir = 'ltr';
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var textNodes = [];
            el.childNodes.forEach(function (n) { if (n.nodeType === 3) textNodes.push(n); });
            if (textNodes.length) { textNodes[textNodes.length - 1].nodeValue = t(el.dataset.i18n); }
            else { el.textContent = t(el.dataset.i18n); }
        });
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
                    html.dir = 'ltr';
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
            if(!filtered.length){ el.innerHTML='<div style="color:#6b7280;padding:8px;font:12px Cairo">لا يوجد مفاتيح</div>'; return; }
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
            return '<div style="display:flex;gap:8px;align-items:center;padding:10px;border-bottom:1px solid #1f1f25;font:12px Cairo;flex-wrap:wrap"><span class="muted">'+new Date(e.date).toLocaleString('ar-EG')+'</span><span>'+e.total+' حساب</span><span style="color:#4ade80">سليم '+e.alive+'</span><span style="color:#f87171">ميت '+e.dead+'</span><span class="badge-green">'+(e.status||'completed')+'</span><button class="btn btn-ghost view-btn" data-idx="'+i+'" style="margin-right:auto;padding:4px 8px;font-size:11px"><i class="fas fa-eye"></i> عرض</button></div>';
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
            else overHist.innerHTML=h.slice(0,5).map(function(e){ return '<div style="display:flex;gap:8px;padding:6px;border-bottom:1px solid #1f1f25;font:11px Cairo"><span>'+new Date(e.date).toLocaleTimeString('ar-EG')+'</span><span>'+e.total+' حساب</span><span style="color:#4ade80">'+e.alive+' سليم</span></div>'; }).join('');
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
        if(!h.length){ el.innerHTML='<div style="padding:20px;text-align:center;color:#6b7280;font:12px Cairo">لا يوجد سجل حسابات بعد — كل حساب تفحصه بيظهر هنا لحاله</div>'; return; }
        el.innerHTML=h.slice(0,100).map(function(e,i){
            var color=e.status==='alive'?'#22c55e':e.status==='banned'?'#ef4444':e.status==='dead'?'#6b7280':e.status==='facelock'?'#f97316':e.status==='captcha'?'#eab308':'#9ca3af';
            var label=e.status==='alive'?'سليم':e.status==='dead'?'ميت':e.status==='banned'?'محظور':e.status==='facelock'?'مقفل':e.status==='captcha'?'كابتشا':e.status;
            return '<div style="display:flex;gap:8px;align-items:center;padding:8px;border-bottom:1px solid #1f1f25;font:11px JetBrains Mono;flex-wrap:wrap"><span style="background:'+color+';color:#fff;padding:2px 6px;border-radius:999px;font:700 10px Cairo">'+label+'</span><span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+e.username+'</span><span class="muted" style="font:400 10px Cairo">'+new Date(e.date).toLocaleTimeString('ar-EG')+'</span><button class="btn btn-ghost view-acc-btn" data-idx="'+i+'" style="padding:4px 6px;font-size:10px"><i class="fas fa-eye"></i> عرض</button></div>';
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
            var capLogin = document.getElementById('captchaLoginRequired');
            if (capLogin) capLogin.style.display = isAuthenticated ? 'none' : 'block';
            if (isAuthenticated && window.__loadWallet) window.__loadWallet();
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
                el=document.getElementById('cfgIban'); if(el && cfg.RECEIVE_IBAN) el.value = cfg.RECEIVE_IBAN;
                el=document.getElementById('cfgName'); if(el && cfg.RECEIVE_NAME) el.value = cfg.RECEIVE_NAME;
                el=document.getElementById('cfgCost'); if(el && cfg.CAPTCHA_COST != null) el.value = cfg.CAPTCHA_COST;
                el=document.getElementById('cfgBrag'); if(el && cfg.RECEIVE_BRAG_NUMBER) el.value = cfg.RECEIVE_BRAG_NUMBER;
            }
        }catch(e){}
        loadPendingRecharges(); loadAdminUsers(); loadBotAccountsAdmin();
    }
    async function loadBotAccountsAdmin(){
        try {
            var r = await fetch('/api/admin/bot-accounts', { credentials:'include' });
            var d = await r.json();
            var ta = document.getElementById('botAccountsText'); if (ta && d.text != null) ta.value = d.text;
            var cnt = document.getElementById('botAccountsCount'); if (cnt) cnt.textContent = (d.count||0) + ' حساب محفوظ';
        } catch(e){}
    }
    async function sendBroadcast(){
        var title = document.getElementById('broadcastTitle');
        var desc = document.getElementById('broadcastDesc');
        var img = document.getElementById('broadcastImage');
        var res = document.getElementById('broadcastResult');
        var t = title ? title.value.trim() : '';
        var d = desc ? desc.value.trim() : '';
        var i = img ? img.value.trim() : '';
        if (!d && !t) { if (res) res.textContent = '❌ اكتب عنواناً أو نصاً'; return; }
        if (res) res.textContent = '⏳ جاري الإرسال...';
        try {
            var r = await fetch('/api/admin/discord/send-embed', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ title: t, description: d, image: i }) });
            var data = await r.json();
            if (res) res.textContent = r.ok ? ('✅ ' + (data.message || 'تم الإرسال')) : ('❌ ' + (data.error || r.status));
        } catch (e) { if (res) res.textContent = '❌ خطأ: ' + e.message; }
    }

    async function saveAdminConfig(){
        var payload = {};
        var v;
        v=document.getElementById('cfgZp'); if(v && v.value.trim()) payload.ZEROPOINT_API_KEY=v.value.trim();
        v=document.getElementById('cfgZs'); if(v && v.value.trim()) payload.ZAPZONEX_API_KEY=v.value.trim();
        v=document.getElementById('cfgPlace'); if(v && v.value.trim()) payload.ZAPZONEX_PLACE_ID=v.value.trim();
        v=document.getElementById('cfgWh'); if(v && v.value.trim()) payload.DISCORD_WEBHOOK_URL=v.value.trim();
        v=document.getElementById('cfgCs'); if(v && v.value.trim()) payload.DISCORD_CLIENT_SECRET=v.value.trim();
        v=document.getElementById('cfgBot'); if(v && v.value.trim()) payload.BOT_TOKEN=v.value.trim();
        v=document.getElementById('cfgAdmins'); if(v) payload.ADMIN_IDS=v.value.trim();
        v=document.getElementById('cfgIban'); if(v && v.value.trim()) payload.RECEIVE_IBAN=v.value.trim();
        v=document.getElementById('cfgName'); if(v && v.value.trim()) payload.RECEIVE_NAME=v.value.trim();
        v=document.getElementById('cfgCost'); if(v && v.value.trim()!=='') payload.CAPTCHA_COST=v.value.trim();
        v=document.getElementById('cfgBrag'); if(v && v.value.trim()) payload.RECEIVE_BRAG_NUMBER=v.value.trim();
        try{
            var res=await fetch('/api/admin/config',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify(payload)});
            var data=await res.json();
            if(res.ok) addLog('تم حفظ الإعدادات: '+(data.saved||[]).join(', '),'success');
            else addLog('فشل الحفظ: '+(data.error||res.status),'error');
            loadAdminData();
        }catch(e){ addLog('خطأ حفظ: '+e.message,'error'); }
    }

    async function loadPendingRecharges(){
        var box = document.getElementById('pendingRecharges');
        if (!box) return;
        try{
            var res = await fetch('/api/admin/recharges', { credentials:'include' });
            var list = await res.json();
            if (!Array.isArray(list) || !list.length) { box.innerHTML = '<span class="muted">لا يوجد طلبات</span>'; return; }
            box.innerHTML = list.map(function(r){
                var stClass = r.status==='approved'?'ok':r.status==='rejected'?'no':'wait';
                var stText = r.status==='approved'?'مقبول':r.status==='rejected'?'مرفوض':'بانتظار';
                var receiptBtn = r.hasReceipt ? '<a href="/api/recharge/'+r.id+'/receipt" target="_blank" class="btn btn-ghost btn-sm">الإيصال</a>' : '';
                var actions = r.status==='pending' ? '<button class="btn btn-purple btn-sm rch-approve" data-id="'+r.id+'">موافقة</button> <button class="btn btn-ghost btn-sm rch-reject" data-id="'+r.id+'">رفض</button>' : '';
                return '<div class="rc-card">'+
                    '<div class="rc-info"><div class="rc-user">'+r.username+'</div><div class="rc-meta">'+r.amount+' • '+(r.method||'')+' • <span class="pill-status '+stClass+'">'+stText+'</span></div></div>'+
                    '<div class="rc-actions">'+receiptBtn+actions+'</div>'+
                '</div>';
            }).join('');
        }catch(e){ box.innerHTML = '<span class="muted">خطأ في التحميل</span>'; }
    }
    async function loadAdminUsers(){
        var box = document.getElementById('adminUsers');
        if (!box) return;
        try{
            var res = await fetch('/api/admin/users', { credentials:'include' });
            var list = await res.json();
            if (!Array.isArray(list) || !list.length) { box.innerHTML = '<span class="muted">لا يوجد مستخدمين</span>'; return; }
            box.innerHTML = list.map(function(u){
                var av = u.avatar ? '<img src="'+u.avatar+'" class="usr-avatar">' : '<i class="fas fa-user usr-avatar"></i>';
                var bannedClass = u.banned ? 'no' : 'ok';
                var bannedText = u.banned ? 'محظور' : 'نشط';
                var banBtn = u.banned ? '<button class="btn btn-ghost btn-sm usr-unban" data-id="'+u.id+'">فك الحظر</button>' : '<button class="btn btn-ghost btn-sm usr-ban" data-id="'+u.id+'">حظر</button>';
                return '<div class="usr-card">'+
                    '<div class="usr-id">'+av+'<div class="usr-meta"><b>'+(u.global_name||u.username)+'</b><span class="muted usr-sub">@'+(u.username||'')+' • '+u.id+'</span></div></div>'+
                    '<div class="usr-actions"><span class="usr-balance">رصيد: '+(u.balance||0)+'</span> <span class="pill-status '+bannedClass+'">'+bannedText+'</span> '+banBtn+' <button class="btn btn-purple btn-sm usr-add" data-id="'+u.id+'">إضافة رصيد</button></div>'+
                '</div>';
            }).join('');
        }catch(e){ box.innerHTML = '<span class="muted">خطأ في التحميل</span>'; }
    }
    document.addEventListener('click', function(e){
        var t = e.target && e.target.closest ? e.target.closest('button') : null;
        if (!t) return;
        if (t.classList.contains('rch-approve') || t.classList.contains('rch-reject')) {
            var id = t.dataset.id; var approve = t.classList.contains('rch-approve');
            t.disabled = true;
            fetch('/api/admin/recharge/'+id+'/'+(approve?'approve':'reject'), { method:'POST', credentials:'include' }).then(function(r){ return r.json(); }).then(function(){ loadPendingRecharges(); if (window.__loadWallet) window.__loadWallet(); }).catch(function(){});
        } else if (t.classList.contains('usr-ban')) {
            var uid = t.dataset.id; t.disabled = true;
            fetch('/api/admin/users/'+uid+'/ban', { method:'POST', credentials:'include' }).then(function(){ loadAdminUsers(); }).catch(function(){});
        } else if (t.classList.contains('usr-unban')) {
            var uid2 = t.dataset.id; t.disabled = true;
            fetch('/api/admin/users/'+uid2+'/unban', { method:'POST', credentials:'include' }).then(function(){ loadAdminUsers(); }).catch(function(){});
        } else if (t.classList.contains('usr-add')) {
            var uid3 = t.dataset.id; var amt = prompt('كم رصيد تبي تضيف؟');
            if (amt) { fetch('/api/admin/users/'+uid3+'/add-balance', { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include', body: JSON.stringify({ amount: parseFloat(amt) }) }).then(function(){ loadAdminUsers(); if (window.__loadWallet) window.__loadWallet(); }).catch(function(){}); }
        }
    });

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
                setResultFilter(status);
            });
        });

        // فلاتر النتائج + البحث
        document.querySelectorAll('.filter-pill').forEach(function (pill) {
            pill.addEventListener('click', function () {
                document.querySelectorAll('.filter-pill').forEach(function (x) { x.classList.remove('active'); });
                pill.classList.add('active');
                currentResultFilter = pill.dataset.filter;
                applyResultFilter();
            });
        });
        var resultSearchEl = document.getElementById('resultSearch');
        if (resultSearchEl) resultSearchEl.addEventListener('input', function () { currentResultSearch = resultSearchEl.value.trim(); applyResultFilter(); });
        // نسخ صف مفردة
        document.addEventListener('click', function (e) {
            var c = e.target.closest ? e.target.closest('.copy-row') : null;
            if (c && c.dataset.username) {
                var txt = c.dataset.username;
                var done = false;
                try { if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(txt); done = true; } } catch (_) {}
                if (!done) done = fallbackCopy(txt);
                addLog(done ? fmt(tm('copied'), { n: 1, s: txt }) : tm('copyFail'), done ? 'success' : 'warning');
            }
        });

        // formatter events
        document.querySelectorAll('.fmt-opt').forEach(function (label) {
            label.addEventListener('click', function () {
                document.querySelectorAll('.fmt-opt').forEach(function (l) { l.classList.remove('active'); });
                label.classList.add('active');
                var radio = label.querySelector('input[type=radio]');
                if (radio) radio.checked = true;
                formatterConvert();
            });
        });
        document.querySelectorAll('.sep-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.sep-btn').forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                var custom = document.getElementById('fmtSepCustom');
                if (custom) custom.value = '';
                formatterConvert();
            });
        });
        var fmtConvertBtn = document.getElementById('fmtConvert');
        var fmtOutputEl = document.getElementById('fmtOutput');
        var fmtInputEl = document.getElementById('fmtInput');
        if (fmtConvertBtn) fmtConvertBtn.addEventListener('click', formatterConvert);
        if (fmtInputEl) {
            var fmtDebounce;
            fmtInputEl.addEventListener('input', function () { clearTimeout(fmtDebounce); fmtDebounce = setTimeout(formatterConvert, 250); });
            var fmtDrop = fmtInputEl.closest('.fmt-drop');
            if (fmtDrop) {
                ['dragenter', 'dragover'].forEach(function (ev) { fmtDrop.addEventListener(ev, function (e) { e.preventDefault(); fmtDrop.classList.add('dragover'); }); });
                ['dragleave', 'drop'].forEach(function (ev) { fmtDrop.addEventListener(ev, function (e) { e.preventDefault(); fmtDrop.classList.remove('dragover'); }); });
                fmtDrop.addEventListener('drop', function (e) {
                    var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
                    if (f) { var rd = new FileReader(); rd.onload = function () { fmtInputEl.value = rd.result; formatterConvert(); }; rd.readAsText(f); }
                });
            }
        }
        var fmtCustomSep = document.getElementById('fmtSepCustom');
        if (fmtCustomSep) fmtCustomSep.addEventListener('input', function () {
            document.querySelectorAll('.sep-btn').forEach(function (b) { b.classList.remove('active'); });
            formatterConvert();
        });
        var fmtFileInput = document.getElementById('fmtFile');
        var fmtFileBtn = document.getElementById('fmtFileBtn');
        if (fmtFileBtn && fmtFileInput) fmtFileBtn.addEventListener('click', function () { fmtFileInput.click(); });
        if (fmtFileInput) fmtFileInput.addEventListener('change', function (e) {
            var f = e.target.files && e.target.files[0]; if (!f) return;
            var rd = new FileReader(); rd.onload = function () { if (fmtInputEl) fmtInputEl.value = rd.result; formatterConvert(); }; rd.readAsText(f);
        });
        var fmtPasteBtn = document.getElementById('fmtPaste');
        if (fmtPasteBtn && fmtInputEl) fmtPasteBtn.addEventListener('click', function () {
            if (navigator.clipboard && navigator.clipboard.readText) {
                navigator.clipboard.readText().then(function (txt) { fmtInputEl.value = txt; formatterConvert(); }).catch(function () {});
            }
        });
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
            if (statsEl) statsEl.textContent = currentLang === 'ar' ? '0 سطر' : '0 lines';
            var inC = document.getElementById('fmtInCount'); if (inC) inC.textContent = '0';
            var outC = document.getElementById('fmtOutCount'); if (outC) outC.textContent = '0';
            var det = document.getElementById('fmtDetected'); if (det) det.textContent = t('fmtDetectHint');
        });
        var fmtSwapBtn = document.getElementById('fmtSwap');
        if (fmtSwapBtn) fmtSwapBtn.addEventListener('click', function () {
            if (!fmtInputEl || !fmtOutputEl) return;
            var tmp = fmtInputEl.value;
            fmtInputEl.value = fmtOutputEl.value;
            fmtOutputEl.value = tmp;
            formatterConvert();
        });
        var fmtUseBtn = document.getElementById('fmtUseInChecker');
        if (fmtUseBtn) fmtUseBtn.addEventListener('click', function () {
            if (!fmtOutputEl || !fmtOutputEl.value.trim()) { addLog(tm('noFormat'), 'warning'); return; }
            if (accountInput) accountInput.value = fmtOutputEl.value;
            showPage('checker');
            addLog(fmt(tm('formatted'), { n: fmtOutputEl.value.split('\n').filter(Boolean).length }), 'success');
        });
        var fmtDownloadBtn = document.getElementById('fmtDownloadBtn');
        if (fmtDownloadBtn) fmtDownloadBtn.addEventListener('click', function () {
            if (!fmtOutputEl || !fmtOutputEl.value.trim()) { addLog(tm('noFormat'), 'warning'); return; }
            var blob = new Blob([fmtOutputEl.value], { type: 'text/plain' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a'); a.href = url; a.download = 'accounts.txt';
            document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
            addLog(tm('downloaded'), 'success');
        });

        var startBtn = document.getElementById('startBtn');
        var clearBtn = document.getElementById('clearBtn');
        var summaryBtn = document.getElementById('summaryBtn');
        var formatBtn = document.getElementById('formatBtn');
        var cookiesBtn = document.getElementById('cookiesBtn');

        if (startBtn) startBtn.addEventListener('click', startCheck);
        if (clearBtn) clearBtn.addEventListener('click', clearAll);
        var copyAllResultsBtn = document.getElementById('copyAllResults');
        if (copyAllResultsBtn) copyAllResultsBtn.addEventListener('click', function () {
            if (!resultsBody) return;
            var rows = Array.from(resultsBody.querySelectorAll('tr[data-status]')).map(function (r) { return r.dataset.username || ''; }).filter(Boolean);
            if (!rows.length) { addLog(tm('noResults'), 'warning'); return; }
            var text = rows.join('\n'); var copied = false;
            try { if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(text); copied = true; } } catch (e) {}
            if (!copied) copied = fallbackCopy(text);
            addLog(copied ? fmt(tm('copied'), { n: rows.length, s: '' }) : tm('copyFail'), copied ? 'success' : 'warning');
        });
        var downloadResultsBtn = document.getElementById('downloadResults');
        if (downloadResultsBtn) downloadResultsBtn.addEventListener('click', downloadResults);
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
        var broadcastSendBtn = document.getElementById('broadcastSend');
        if (broadcastSendBtn) broadcastSendBtn.addEventListener('click', sendBroadcast);
        var botAccountsSave = document.getElementById('botAccountsSave');
        if (botAccountsSave) botAccountsSave.addEventListener('click', function () {
          var ta = document.getElementById('botAccountsText'); var cnt = document.getElementById('botAccountsCount');
          if (!ta) return;
          botAccountsSave.disabled = true;
          fetch('/api/admin/bot-accounts', { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ text: ta.value }) })
            .then(function(r){ return r.json().then(function(j){ return { ok:r.ok, data:j }; }); })
            .then(function(res){ var info = res.ok ? ('تم الحفظ: ' + (res.data.count!=null?res.data.count:'')) : ('خطأ: ' + (res.data.error||'')); if (cnt) cnt.textContent = info; if (res.ok) loadBotAccountsAdmin(); })
            .catch(function(e){ if (cnt) cnt.textContent = 'خطأ: ' + e.message; })
            .finally(function(){ botAccountsSave.disabled = false; });
        });
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
                if(!solved.length) sEl.innerHTML='<div style="text-align:center;color:#6b7280;padding:16px;font:400 11px Cairo">لا يوجد بعد</div>';
                else sEl.innerHTML = solved.map(function(u,i){ return '<div style="display:flex;gap:8px;align-items:center;padding:7px 8px;background:rgba(34,197,94,.06);border:1px solid rgba(34,197,94,.18);border-radius:6px;font:11px JetBrains Mono"><span style="color:#4ade80">'+(i+1)+'</span><span style="flex:1;overflow:hidden;text-overflow:ellipsis">'+escapeHtml(u)+'</span><i class="fas fa-check" style="color:#4ade80"></i></div>'; }).join('');
            }
            if(fEl){
                if(!failed.length) fEl.innerHTML='<div style="text-align:center;color:#6b7280;padding:16px;font:400 11px Cairo">لا يوجد بعد</div>';
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

    // ===== Captcha Solver (MR Solver) =====
    (function initCaptchaSolver() {
        var input = document.getElementById('captchaInput');
        var fileInput = document.getElementById('captchaFile');
        var clearBtn = document.getElementById('captchaClear');
        var countEl = document.getElementById('captchaCharCount');
        var lineEl = document.getElementById('captchaLineCount');
        var typeSel = document.getElementById('captchaType');
        var solveBtn = document.getElementById('captchaSolveBtn');
        var spinner = document.getElementById('captchaSpinner');
        var logEl = document.getElementById('captchaLog');
        var resultsCard = document.getElementById('captchaResults');
        var solvedOut = document.getElementById('capSolvedOut');
        var dlBtn = document.getElementById('captchaDownload');
        var capSolved = document.getElementById('capSolved');
        var capFailed = document.getElementById('capFailed');
        var capFace = document.getElementById('capFace');
        var capDead = document.getElementById('capDead');
        var capProgressBar = document.getElementById('capProgressBar');
        function setProgress(pct){ if (capProgressBar) capProgressBar.style.width = Math.max(0, Math.min(100, pct)) + '%'; }
        var costPreviewEl = document.getElementById('captchaCostPreview');
        var availEl = document.getElementById('csAvailable');
        function updateAvailableBadge() {
            if (!availEl) return;
            fetch('/api/solver-available').then(function (r) { return r.json(); }).then(function (d) {
                if (!d || typeof d.available !== 'number') return;
                availEl.textContent = 'متوفر الان ' + d.available + ' حل لغز';
            }).catch(function () {});
        }
        updateAvailableBadge();
        setInterval(updateAvailableBadge, 30000);
        var CAPTCHA_MIN = 30, CAPTCHA_BATCH_PRICE = 2.5;

        function logMsg(msg) { if (logEl) logEl.innerHTML = '<i class="fas fa-terminal"></i> ' + msg; }
        function solverErr(msg) {
            msg = msg || '';
            if (/temporarily unavailable|503|server_busy/i.test(msg)) return 'خدمة MR Solver غير متاحة حالياً، حاول بعد قليل';
            if (/insufficient_balance/i.test(msg)) return 'رصيد MR Solver غير كافٍ لحل الكابتشا';
            if (/invalid_solver_key|invalid api|missing api/i.test(msg)) return 'مفتاح MR Solver غير صحيح';
            if (/invalid_cookies|missing_params/i.test(msg)) return 'الكوكي غير صالح أو ناقص — تأكد من صيغة user:pass:cookie';
            if (/login|دخول/i.test(msg)) return 'سجّل دخولك بالديسكورد أولاً';
            return msg || 'خطأ غير معروف';
        }
        function updateCounts() {
            if (!input) return;
            var lines = input.value.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
            if (countEl) countEl.textContent = input.value.length;
            if (lineEl) lineEl.textContent = lines.length + ' accounts';
            if (costPreviewEl) {
                var n = lines.length;
                if (!n) { costPreviewEl.textContent = ''; costPreviewEl.className = 'cap-cost-preview'; }
                else {
                    var price = (n / CAPTCHA_MIN) * CAPTCHA_BATCH_PRICE;
                    var enough = n >= CAPTCHA_MIN;
                    costPreviewEl.className = 'cap-cost-preview' + (enough ? ' ok' : ' warn');
                    costPreviewEl.innerHTML = 'العدد: <b>' + n + '</b> حساب — التكلفة التقديرية: <b>' + price.toFixed(2) + ' ريال</b>' + (enough ? '' : ' • <span>الحد الأدنى ' + CAPTCHA_MIN + ' حساب</span>');
                }
            }
        }
        if (input) {
            input.addEventListener('input', updateCounts);
            input.addEventListener('paste', function () { setTimeout(updateCounts, 50); });
        }
        if (fileInput && input) {
            fileInput.addEventListener('change', function (e) {
                var f = e.target.files && e.target.files[0]; if (!f) return;
                var rd = new FileReader();
                rd.onload = function () { input.value = rd.result; updateCounts(); };
                rd.readAsText(f);
            });
        }
        var dropZone = document.getElementById('captchaDropZone');
        if (dropZone && input) {
            ['dragenter','dragover'].forEach(function (ev) { dropZone.addEventListener(ev, function (e) { e.preventDefault(); dropZone.classList.add('drag'); }); });
            ['dragleave','drop'].forEach(function (ev) { dropZone.addEventListener(ev, function (e) { e.preventDefault(); dropZone.classList.remove('drag'); }); });
            dropZone.addEventListener('drop', function (e) {
                var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (!f) return;
                var rd = new FileReader();
                rd.onload = function () { input.value = rd.result; updateCounts(); };
                rd.readAsText(f);
            });
        }
        if (clearBtn && input) {
            clearBtn.addEventListener('click', function () {
                input.value = ''; updateCounts();
                if (resultsCard) resultsCard.style.display = 'none';
                logMsg('تم المسح');
            });
        }
        var capPollTimer = null;
        var STATUS_LABELS = { pending:'بانتظار', processing:'قيد المعالجة', completed:'اكتمل', failed:'فشل', cancelled:'ملغى' };
        var STATUS_COLORS = { pending:'#eab308', processing:'#3b82f6', completed:'#22c55e', failed:'#ef4444', cancelled:'#6b7280' };
        function setCaptchaStatus(state){
            var box = document.getElementById('captchaStatus');
            if (!box) return;
            var label = STATUS_LABELS[state] || state || '—';
            var color = STATUS_COLORS[state] || '#9ca3af';
            box.style.display = 'flex';
            box.style.background = 'rgba(0,0,0,0.3)';
            box.style.border = '1px solid ' + color;
            box.innerHTML = '<span style="width:10px;height:10px;border-radius:50%;background:' + color + ';display:inline-block"></span> <span style="color:' + color + '">' + label + '</span>';
        }
        function hideCaptchaStatus(){
            var box = document.getElementById('captchaStatus');
            if (box) box.style.display = 'none';
            if (capPollTimer) { clearInterval(capPollTimer); capPollTimer = null; }
        }
        function pollCaptchaStatus(jobId){
            if (capPollTimer) clearInterval(capPollTimer);
            capPollTimer = setInterval(function () {
                fetch('/api/solver-status/' + jobId, { credentials:'include' }).then(function (r) { return r.json(); }).then(function (job) {
                    if (job.status) setCaptchaStatus(job.status);
                    if (job.status === 'pending') setProgress(0);
                    else if (job.status === 'processing' && job.total) setProgress(Math.round((job.progress||0)/job.total*100));
                    if (job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled') {
                        hideCaptchaStatus();
                        if (spinner) spinner.style.display = 'none';
                        solveBtn.disabled = false;
                        if (job.status === 'completed') {
                            updateAvailableBadge();
                            if (capSolved) capSolved.textContent = job.successful || 0;
                            if (capFailed) capFailed.textContent = job.failed || 0;
                            if (capFace) capFace.textContent = job.alreadySolved || 0;
                            if (capDead) capDead.textContent = 0;
                            if (solvedOut) solvedOut.value = (job.results && job.results.solved) ? job.results.solved.join('\n') : '';
                            if (resultsCard) resultsCard.style.display = 'block';
                            setProgress(100);
                            logMsg('Done: ' + (job.successful || 0) + ' solved, ' + (job.alreadySolved || 0) + ' already, ' + (job.failed || 0) + ' failed');
                        } else if (job.status === 'failed') {
                            logMsg('فشل الحل: ' + solverErr(job.error || 'خطأ'));
                        } else {
                            logMsg('تم إلغاء العملية');
                        }
                    }
                }).catch(function () {});
            }, 2000);
        }
        if (solveBtn) {
            solveBtn.addEventListener('click', function () {
                if (!input) return;
                if (!isAuthenticated) {
                    var lr = document.getElementById('captchaLoginRequired');
                    if (lr) lr.style.display = 'block';
                    logMsg('سجّل دخولك بالديسكورد أولاً');
                    return;
                }
                var lines = input.value.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
                if (lines.length < CAPTCHA_MIN) { logMsg('الحد الأدنى لحل الكابتشا ' + CAPTCHA_MIN + ' حساب (أدخلت ' + lines.length + ')'); return; }
                solveBtn.disabled = true;
                if (spinner) spinner.style.display = 'block';
                setCaptchaStatus('pending');
                logMsg('Sending ' + lines.length + ' account(s) to MR Solver...');
                fetch('/api/solve-captcha', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ accounts: lines.map(function (l) { return { raw: l }; }), captchaType: typeSel ? typeSel.value : undefined })
                }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, data: j }; }); })
                    .then(function (res) {
                        var d = res.data || {};
                        if (!res.ok || d.status === 'error') {
                            if (spinner) spinner.style.display = 'none';
                            solveBtn.disabled = false;
                            hideCaptchaStatus();
                            logMsg('خطأ: ' + solverErr(d.message || d.error || 'غير معروف'));
                            return;
                        }
                        pollCaptchaStatus(d.jobId);
                    }).catch(function (e) {
                        if (spinner) spinner.style.display = 'none';
                        solveBtn.disabled = false;
                        hideCaptchaStatus();
                        logMsg('خطأ في الاتصال: ' + e.message);
                    });
            });
        }
        if (dlBtn && solvedOut) {
            dlBtn.addEventListener('click', function () {
                var txt = solvedOut.value;
                if (!txt) { logMsg('لا توجد نتائج للتحميل'); return; }
                var blob = new Blob([txt], { type: 'text/plain' });
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url; a.download = 'solved.txt';
                document.body.appendChild(a); a.click(); document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
        }
        if (input) updateCounts();
    })();

    // ===== Wallet & Recharge =====
    (function initWallet() {
        var balanceEl = document.getElementById('walletBalance');
        var costEl = document.getElementById('walletCost');
        var openBtn = document.getElementById('openRecharge');
        var form = document.getElementById('rechargeForm');
        var amountEl = document.getElementById('rechargeAmount');
        var methodEl = document.getElementById('rechargeMethod');
        var nameEl = document.getElementById('receiveName');
        var ibanEl = document.getElementById('receiveIban');
        var bragEl = document.getElementById('receiveBrag');
        var bragRowEl = document.getElementById('receiveBragRow');
        var ibanRowEl = document.getElementById('receiveIbanRow');
        var userCard = document.getElementById('userCard');
        var userBalanceEl = document.getElementById('userBalance');
        var receiptEl = document.getElementById('rechargeReceipt');
        var submitBtn = document.getElementById('rechargeSubmit');
        var msgEl = document.getElementById('rechargeMsg');
        var historyEl = document.getElementById('rechargeHistory');

        if (openBtn && form) openBtn.addEventListener('click', function () { form.style.display = form.style.display === 'none' ? 'block' : 'none'; });
        function updateReceive(){
            var m = methodEl ? methodEl.value : 'برق';
            if (bragRowEl) bragRowEl.style.display = (m === 'برق') ? 'block' : 'none';
            if (ibanRowEl) ibanRowEl.style.display = (m === 'البنك العربي الوطني') ? 'block' : 'none';
        }
        if (methodEl) methodEl.addEventListener('change', updateReceive);
        var walletIconBtn = document.getElementById('walletIconBtn');
        if (walletIconBtn) walletIconBtn.addEventListener('click', function () { if (typeof showPage === 'function') showPage('wallet'); });
        if (userCard) userCard.addEventListener('click', function (e) {
            if (e.target.closest && e.target.closest('button')) return;
            userCard.classList.remove('wallet-pulse');
            void userCard.offsetWidth;
            userCard.classList.add('wallet-pulse');
            setTimeout(function () { userCard.classList.remove('wallet-pulse'); }, 420);
            if (typeof showPage === 'function') showPage('wallet');
        });

        function loadWallet() {
            fetch('/api/wallet', { credentials: 'include' }).then(function (r) { return r.json(); }).then(function (d) {
                if (balanceEl) balanceEl.textContent = (d.balance != null ? d.balance : 0);
                if (userBalanceEl) userBalanceEl.textContent = 'رصيد: ' + (d.balance != null ? d.balance : 0);
                if (costEl) costEl.textContent = (d.captchaCost != null ? (Number(d.captchaCost) * 30).toFixed(2) + ' ريال لكل 30 حساب' : '—');
                if (nameEl) nameEl.textContent = d.receiveName || '—';
                if (ibanEl) ibanEl.textContent = d.receiveIban || '—';
                if (bragEl) bragEl.textContent = d.receiveBrag || '—';
                updateReceive();
                if (historyEl) {
                    if (d.recharges && d.recharges.length) {
                        historyEl.innerHTML = d.recharges.map(function (r) {
                            var st = r.status === 'approved' ? '<span style="color:#22c55e">مقبول</span>' : r.status === 'rejected' ? '<span style="color:#ef4444">مرفوض</span>' : '<span style="color:#eab308">بانتظار الموافقة</span>';
                            return '<div style="display:flex;justify-content:space-between;border-bottom:1px solid #26262e;padding:6px 0;font:12px Cairo"><span>' + r.amount + ' — ' + (r.method || '') + '</span><span>' + st + '</span></div>';
                        }).join('');
                    } else { historyEl.textContent = 'لا يوجد'; }
                }
            }).catch(function () {});
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', function () {
                var amount = parseFloat(amountEl && amountEl.value);
                if (!amount || amount <= 0) { if (msgEl) msgEl.textContent = 'أدخل مبلغ صالح'; return; }
                var file = receiptEl && receiptEl.files && receiptEl.files[0];
                if (!file) { if (msgEl) msgEl.textContent = 'أرفق صورة الإيصال'; return; }
                var reader = new FileReader();
                reader.onload = function () {
                    var body = JSON.stringify({ amount: amount, method: methodEl ? methodEl.value : '—', receipt: reader.result });
                    submitBtn.disabled = true;
                    if (msgEl) msgEl.textContent = 'جاري الإرسال...';
                    fetch('/api/recharge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: body })
                        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, data: j }; }); })
                        .then(function (res) {
                            submitBtn.disabled = false;
                            if (res.ok && res.data.status === 'pending') { if (msgEl) msgEl.textContent = '✅ تم إرسال الطلب، بانتظار الموافقة'; if (form) form.style.display = 'none'; loadWallet(); }
                            else { if (msgEl) msgEl.textContent = 'خطأ: ' + (res.data.message || 'غير معروف'); }
                        }).catch(function (e) { submitBtn.disabled = false; if (msgEl) msgEl.textContent = 'خطأ: ' + e.message; });
                };
                reader.readAsDataURL(file);
            });
        }

        window.__loadWallet = loadWallet;
    })();
}());
