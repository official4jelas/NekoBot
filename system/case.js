//============================
// - buat Pengguna case bisa tambah fitur disini
// - Fitur akan otomatis terlihat di .menu jadi jangan bikin fitur menu lagi 👍
//============================

const util = require("util");
const config = require("../settings.js");
const {
    exec
} = require("child_process");
const fs = require("node:fs");
const axios = require("axios");
const Func = require("../lib/function");
const {
    writeExif
} = require("../lib/sticker");
const pkg = require("../lib/case");
const Case = new pkg("./system/case.js");

module.exports = async(m, {
            sock,
            config,
            text,
            plugins,
            Func,
            Scraper,
            Uploader,
            store,
            isAdmin,
            botAdmin,
            isPrems,
            isBanned,
          }) => {
    if (m.isBot) return;
    const quoted = m.isQuoted ? m.quoted : m;

    switch (m.command) {
        case "jadwalsholat": {
            const axios = require('axios');
            const cheerio = require('cheerio');
            if (!text) return m.reply("> Masukan nama kota")
            const kota = text?.toLowerCase() || 'jakarta'
            try {
                const {
                    data
                } = await axios.get(`https://jadwal-sholat.tirto.id/kota-${kota}`);
                const $ = cheerio.load(data);

                const jadwal = $('tr.currDate td').map((i, el) => $(el).text()).get();

                if (jadwal.length === 7) {
                    const [tanggal, subuh, duha, dzuhur, ashar, maghrib, isya] = jadwal;

                    const zan = `
╭──[ *Jadwal Sholat* ]──✧
᎒⊸ *Kota*: ${kota.charAt(0).toUpperCase() + kota.slice(1)}
᎒⊸ *Tanggal*: ${tanggal}

╭──[ *Waktu Sholat* ]──✧
᎒⊸ Subuh: ${subuh}
᎒⊸ Duha: ${duha}
᎒⊸ Dzuhur: ${dzuhur}
᎒⊸ Ashar: ${ashar}
᎒⊸ Maghrib: ${maghrib}
᎒⊸ Isya: ${isya}
╰────────────•`;

                    await m.reply(zan);
                } else {
                    await m.reply('Jadwal sholat tidak ditemukan. Pastikan nama kota sesuai.');
                }
            } catch (error) {
                await m.reply('error');
            }
        };
        break
        case "brat": {
            let input = m.isQuoted ? m.quoted.body : text;
            if (!input) return m.reply("> Reply/Masukan pessn");
            m.reply(config.messages.wait);
            let media = await axios.get(`https://aqul-brat.hf.space/api/brat?text=${text}`, {
                responseType: 'arraybuffer'
            }).then((a) => a.data);
            let sticker = await writeExif({
                mimetype: "image",
                data: media,
            }, {
                packName: config.sticker.packname,
                packPublish: config.sticker.author,
            }, );

            await m.reply({
                sticker
            });
        }
        break;
        case "daftar": {
            let user = db.list().user[m.sender]
            if (user.register) return m.reply("> Kamu sudah mendaftar !");
            if (!text) return m.reply("> Masukan nama anda !");
            let list = Object.values(db.list().user).find((a) => a.name.toLowerCase() === text.toLowerCase());
            if (list) return m.reply("> Nama tersebut sudah digunakan !");
            let bonus = 1000;
            user.register = true
            user.name = text
            user.rpg.money += bonus
            user.rpg.exp += bonus
            let cap = `*– 乂 Pendaftaran - Berhasil !*
> 🎉 Selamat ${user.name} kamu mendapatkan bonus tambahan karena sudah mendaftar pada bot kami

*– 乂 Hadiah - Pendaftaran*
> *- Money :* 1.000
> *- Exp :* 1.000`
            m.reply(cap);
        }
        break
        case "zzz": {
            let list = await Scraper.zzz.list();
            if (!text) return m.reply("> Masukan nama character dari game ZZZ");
            let chara = list.find((a) => a.name.toLowerCase() === text.toLowerCase());
            if (!chara) return m.reply(`> Character tidak ditemukan !

*– 乂 Berikut ${list.length} character dari game ZZZ*

${list.map((a) => Object.entries(a).map(([a, b]) => `> *- ${a.capitalize()} :* ${b}`).join('\n')).join("\n\n")}`);

            let data = await Scraper.zzz.chara(text);
            let cap = "*– 乂 Zenless Zone Zero - Character*\n"
            cap += Object.entries(data.info).map(([a, b]) => `> *- ${a.capitalize()} :* ${b}`).join("\n")
            cap += "\n\n*– Statistic Character :*\n"
            cap += data.stats.map((a) => `> *- ${a.name.capitalize()} :* ${a.value}`).join("\n");
            cap += "\n\n*– Party Character :*\n"
            cap += data.team.map((a) => `> *- Name :* ${a.name}\n> *- Role :* ${a.role}`).join("\n\n");

            cap += "\n\n*– Skills Character :*\n"
            cap += data.skills.map((a) => `> *- Name :* ${a.name}\n> ${a.description}`).join("\n\n");

            m.reply({
                text: cap,
                contextInfo: {
                    externalAdReply: {
                        title: "– Zenless Zone Zero Wiki : " + data.info.name,
                        body: "- Element : " + data.info.element,
                        mediaType: 1,
                        thumbnailUrl: data.info.image
                    }
                }
            });
        }
        break
        case "sticker":
        case "s": {
            if (/image|video|webp/.test(quoted.msg.mimetype)) {
                let media = await quoted.download();
                if (quoted.msg?.seconds > 10)
                    throw "> Video diatas durasi 10 detik gabisa";
                let exif;
                if (text) {
                    let [packname, author] = text.split(/[,|\-+&]/);
                    exif = {
                        packName: packname ? packname : "",
                        packPublish: author ? author : "",
                    };
                } else {
                    exif = {
                        packName: config.sticker.packname,
                        packPublish: config.sticker.author,
                    };
                }
                let sticker = await writeExif({
                        mimetype: quoted.msg.mimetype,
                        data: media
                    },
                    exif,
                );
                await m.reply({
                    sticker
                });
            } else if (m.mentions.length !== 0) {
                for (let id of m.mentions) {
                    await delay(1500);
                    let url = await sock.profilePictureUrl(id, "image");
                    let media = await axios
                        .get(url, {
                            responsType: "arraybuffer",
                        })
                        .then((a) => a.data);
                    let sticker = await writeExif(media, {
                        packName: config.sticker.packname,
                        packPublish: config.sticker.author,
                    });
                    await m.reply({
                        sticker
                    });
                }
            } else if (
                /(https?:\/\/.*\.(?:png|jpg|jpeg|webp|mov|mp4|webm|gif))/i.test(
                    text,
                )
            ) {
                for (let url of Func.isUrl(text)) {
                    await delay(1500);
                }
            } else
                m.reply("> Reply photo atau video yang ingin di jadikan sticker");
        }
        break;


        case "cases": {
            if (!m.isOwner) return m.reply(config.messages.owner);
            let cap = "*– 乂 Cara - Pengunaan*\n"
            cap += "> *`--add`* untuk menambah fitur case\n"
            cap += "> *`--get`* untuk mengambil fitur case\n"
            cap += "> *`--delete`* untuk menghapus fitur case\n"
            cap += "\n*– 乂 List Case yang tersedia*\n"
            cap += Case.list().map((a, i) => `> *- ${i + 1}.* ${a}`).join("\n")
            if (!text) return m.reply(cap);

            if (text.includes("--add")) {
                if (!m.quoted) return m.reply("> Reply fitur case yang ingin di simpan");
                let status = Case.add(m.quoted.body);
                m.reply(status ? "> Berhasil menambahkan case baru !" : "> Gagal menambahkan case baru");
            } else if (text.includes("--delete")) {
                let input = text.replace("--delete", "").trim();
                if (!input) return m.reply("> Masukan nama case yang ingin di hapus !")
                let status = Case.delete(input);
                m.reply(status ? `> Berhasil menghapus case ${input} !` : `> Case ${input} tidak ditemukan silahkan cek list case yang tersedia !`);
            } else if (text.includes("--get")) {
                let input = text.replace("--get", "").trim();
                if (!input) return m.reply("> Masukan nama case yang ingin di ambil !")
                if (!Case.list().includes(input)) return m.reply("> case tidak ditemukan !")
                let status = Case.get(input);
                m.reply(status ? status : `> Case ${input} tidak ditemukan silahkan cek list case yang tersedia !`);
            }
        }
        break
    }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log("- Terjadi perubahan pada files case.js");
    delete require.cache[file];
});