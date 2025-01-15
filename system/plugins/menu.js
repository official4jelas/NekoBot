const moment = require("moment-timezone");
const pkg = require(process.cwd() + "/package.json");
const axios = require("axios");
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    command: "menu",
    alias: ["menu", "help"],
    category: ["main"],
    description: "Menampilkan menu bot",
    loading: true,
    async run(m, {
        sock,
        plugins,
        config,
        Func,
        text
    }) {
        let data = fs.readFileSync(process.cwd() + "/system/case.js", "utf8");
        let casePattern = /case\s+"([^"]+)"/g;
        let matches = data.match(casePattern);
        if (!matches) return m.reply("Tidak ada case yang ditemukan.");
        matches = matches.map((match) => match.replace(/case\s+"([^"]+)"/, "$1"));
        let menu = {};
        plugins.forEach((item) => {
            if (item.category && item.command && item.alias) {
                item.category.forEach((cat) => {
                    if (!menu[cat]) {
                        menu[cat] = {
                            command: [],
                        };
                    }
                    menu[cat].command.push({
                        name: item.command,
                        alias: item.alias,
                        description: item.description,
                        settings: item.settings,
                    });
                });
            }
        });
        let cmd = 0;
        let alias = 0;
        let pp = await sock
            .profilePictureUrl(m.sender, "image")
            .catch((e) => "https://files.catbox.moe/8getyg.jpg");
        Object.values(menu).forEach((category) => {
            cmd += category.command.length;
            category.command.forEach((command) => {
                alias += command.alias.length;
            });
        });
        let premium = db.list().user[m.sender].premium.status;
        let limit = db.list().user[m.sender].limit;
        if (text === "all") {
            let caption = `*🍟 Selamat datang di Dashboard bot*
Nama saya nekoBot - , Berikut list command bot ini

┏━━[ *乂 Info User* ]
┃ *- Nama :* ${m.pushName}
┃ *- Tag :* @${m.sender.split("@")[0]}
┃ *- Status :* ${m.isOwner ? "Developer bot" : premium ? "Premium" : "Gratisan"}
┃  *- Limit :* ${m.isOwner ? "Unlimited" : limit}
┗━━━━━━━━━━━━━━━━━━━━━━━

┏━━[ *乂 Info - Bot* ]
┃ *- Nama :* ${pkg.name}
┃ *- Versi :* v${pkg.version}
┃ *- Runtime :* ${Func.toDate(process.uptime() * 1000)}
┃ *- Prefix :* [ ${m.prefix} ]
┃ *- Total fitur :* ${cmd + alias + matches.length}
┗━━━━━━━━━━━━━━━━━━━━━━━
> *\`- Source code :\`* https://github.com/AxellNetwork/NekoBot

> *- Fitur Limit :* [L]
> *- Fitur Premium :* [P]

☎️ Jika menemukan bug pada bot ini bisa langsung hubungi owner bot

┏━━[ *乂 M e n u - O t h e r* ]
${matches.map((a, i) => `┃ *${i + 1}.* ${m.prefix + a}`).join("\n")} 
┗━━━━━━━━━━━━━━━━━━━━━━━\n`;
            Object.entries(menu).forEach(([tag, commands]) => {
                caption += `\n┏━━[ *乂 M e n u – ${tag.split("").join(" ").capitalize()}* ]\n`;
                commands.command.forEach((command, index) => {
                    caption += `┃ *${index + 1}.* ${m.prefix + command.name} ${command.settings?.premium ? "*[P]*" : command.settings?.limit ? "*[L]*" : ""}\n`;
                });
                caption += "┗━━━━━━━━━━━━━━━━━━━━━━━\n"
            });
            caption += "\n\n> © Developed by AxellNetwork\n> Powered by @⁨WhatsApp⁩";
            m.reply({
                text: caption,
                contextInfo: {
                    mentionedJid: sock.parseMention(caption),
                    externalAdReply: {
                        title: "© NekoBot | Playground",
                        body: "Better WhatsApp bot",
                        mediaType: 1,
                        sourceUrl: "https://whatsapp.com/channel/0029Vb0YWvYJ3jusF2nk9U1P",
                        thumbnailUrl: "https://files.catbox.moe/yupd7z.jpg",
                        renderLargerThumbnail: true,
                    },
                },
            });
        } else if (Object.keys(menu).find((a) => a === text.toLowerCase())) {
            let list = menu[Object.keys(menu).find((a) => a === text.toLowerCase())];
            let caption = `*🍟 Selamat datang di Dashboard bot*
Nama saya nekoBot - , Berikut list command bot ini

┏━━[ *乂 Info User* ]
┃ *- Nama :* ${m.pushName}
┃ *- Tag :* @${m.sender.split("@")[0]}
┃ *- Status :* ${m.isOwner ? "Developer bot" : premium ? "Premium" : "Gratisan"}
┃  *- Limit :* ${m.isOwner ? "Unlimited" : limit}
┗━━━━━━━━━━━━━━━━━━━━━━━

┏━━[ *乂 Info - Bot* ]
┃ *- Nama :* ${pkg.name}
┃ *- Versi :* v${pkg.version}
┃ *- Runtime :* ${Func.toDate(process.uptime() * 1000)}
┃ *- Prefix :* [ ${m.prefix} ]
┃ *- Total fitur :* ${cmd + alias + matches.length}
┗━━━━━━━━━━━━━━━━━━━━━━━
> *\`- Source code :\`* https://github.com/AxellNetwork/NekoBot

> *- Fitur Limit :* [L]
> *- Fitur Premium :* [P]

☎️ Jika menemukan bug pada bot ini bisa langsung hubungi owner bot

┏━━[ *乂 M e n u - ${text.capitalize().split("").join(" ")}* ]\n`;
            caption += list.command
                .map(
                    (a, i) =>
                    `┃ *${i + 1}.* ${m.prefix + a.name} ${a.settings?.premium ? "*[P]*" : a.settings?.limit ? "*[L]*" : ""}`,
                )
                .join("\n");
            caption += "\n┗━━━━━━━━━━━━━━━━━━━━━━━"
            caption += "\n\n> © Developed by AxellNetwork\n> Powered by @⁨WhatsApp⁩";
            m.reply({
                text: caption,
                contextInfo: {
                    mentionedJid: sock.parseMention(caption),
                    externalAdReply: {
                        title: "© NekoBot | Playground",
                        body: "Better WhatsApp bot",
                        mediaType: 1,
                        sourceUrl: "https://whatsapp.com/channel/0029Vb0YWvYJ3jusF2nk9U1P",
                        thumbnailUrl: "https://files.catbox.moe/yupd7z.jpg",
                        renderLargerThumbnail: true,
                    },
                },
            });
        } else {
            let list = Object.keys(menu);
            let caption = `*🍟 Selamat datang di Dashboard bot*
Nama saya nekoBot - , Berikut list command bot ini

┏━━[ *乂 Info User* ]
┃ *- Nama :* ${m.pushName}
┃ *- Tag :* @${m.sender.split("@")[0]}
┃ *- Status :* ${m.isOwner ? "Developer bot" : premium ? "Premium" : "Gratisan"}
┃  *- Limit :* ${m.isOwner ? "Unlimited" : limit}
┗━━━━━━━━━━━━━━━━━━━━━━━

┏━━[ *乂 Info - Bot* ]
┃ *- Nama :* ${pkg.name}
┃ *- Versi :* v${pkg.version}
┃ *- Runtime :* ${Func.toDate(process.uptime() * 1000)}
┃ *- Prefix :* [ ${m.prefix} ]
┃ *- Total fitur :* ${cmd + alias + matches.length}
┗━━━━━━━━━━━━━━━━━━━━━━━
> *\`- Source code :\`* https://github.com/AxellNetwork/NekoBot

> *- Fitur Limit :* [L]
> *- Fitur Premium :* [P]

☎️ Jika menemukan bug pada bot ini bisa langsung hubungi owner bot

┏━━[ *乂 L i s t - M e n u* ]
┃${m.prefix}menu all
${list.map((a) => `┃${m.prefix}menu ${a}`).join("\n")} 
┗━━━━━━━━━━━━━━━━━━━━━━━

> © Developed by AxellNetwork\n> Powered by @⁨WhatsApp⁩`;
            m.reply({
                image: {
                    url: "https://files.catbox.moe/yupd7z.jpg"
                },
                caption,
                footer: config.name,
                contextInfo: {
                    mentionedJid: [m.sender]
                },
                buttons: [{
                    buttonId: 'action',
                    buttonText: {
                        displayText: '📁 LIST - MENU'
                    },
                    type: 4,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: '☘️ Menu – NekoBot',
                            sections: [{
                                title: "- ℹ️ INFO - BOT",
                                rows: [{
                                    header: '👨‍💻 Server Bot',
                                    title: 'Menampilkan Informasi Server',
                                    description: config.name,
                                    id: 'ping',
                                }, {
                                    header: '🤖 Script bot',
                                    title: 'Script bot Gratis !',
                                    description: config.name,
                                    id: '.script',
                                }]
                            }, {
                                title: "- ☘️ Anime - Service",
                                rows: [{
                                    header: 'SOKUJA - SERVICE ',
                                    title: 'Cek Informasi Anime dari sokuja',
                                    description: config.name,
                                    id: '.sokuja',
                                }, {
                                    header: 'KURONIME - SERVICE ',
                                    title: 'Cek Informasi Anime dari kuronime',
                                    description: config.name,
                                    id: '.kuronime',
                                }]
                            }, {
                                title: "- 🍟 List - Category",
                                rows: [{
                                        header: '📁 Category ALL',
                                        title: 'Menampilkan Semua fitur',
                                        description: config.name,
                                        id: '.menu all',
                                    },
                                    ...list.map((a) => ({
                                        header: `📁 Category ${a.toUpperCase()}`,
                                        title: `Menampilkan fitur ${a}`,
                                        description: config.name,
                                        id: `.menu ${a}`,
                                    }))
                                ],
                            }],
                        }),
                    },
                }, ],
                headerType: 1,
                viewOnce: true
            });
        }
    },
};