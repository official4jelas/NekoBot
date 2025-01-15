const fs = require("node:fs");

const config = {
  owner: ["6285766450735"],
  name: "- NekoBot - Simple WhatsApp bot",
  sessions: "sessions",
  prefix: [".", "?", "!"], //Tambahin sendiri prefix nya kalo kurang
  sticker: {
    packname: "Made by ",
    author: "nekoBot",
  },
  id: {
    newsletter: "120363388655497053@newsletter", //Ganti pakai id Channel mu
    group: "120363370515588374@g.us" //Ganti dengan id group mu
  },
  messages: {
    wait: "> Data sedang memprosess...",
    owner: "> Khusus Owner bot ini mah",
    premium: "> Upgrade ke premium kalo mau akses, murah aja",
    group: "> Fitur khusus group chat",
    botAdmin: "> Lu siapa bukan Admin group",
    grootbotbup: "> Jadiin NekoBot admin dulu baru bisa akses",
  },
  database: "neko-db",
  tz: "Asia/Jakarta",
};

module.exports = config;

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  delete require.cache[file];
});
