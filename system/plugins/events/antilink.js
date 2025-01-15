const {
    getUrlInfo
} = require("baileys");

async function events(m, {
    sock,
    Func
}) {
    if (!m.isGroup) return;
    let group = db.list().group[m.cht];
    if (Func.isUrl(m.body) && /chat.whatsapp.com/.test(m.body)) {
        if (m.isBotAdmin || !m.isAdmin) {
            let msg = `*– 乂 Link Group Terdeteksi !*\n`;
            msg += `${m.isAdmin ? `> Kamu aman karena kamu admin dari group ${m.metadata.subject}` : `> Maaf Kami tidak memperbolehkan anda mengirim link group lain`}`;
            m.reply(msg).then(() => {
                m.reply({
                    delete: m.key
                });
            });
        }
    }
}

module.exports = {
    events
};