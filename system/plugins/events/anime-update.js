const {
    delay
} = require("baileys");

let messageSent = false;

async function events(m, {
    sock,
    store,
    config
}) {
    let settings = db.list().settings
    settings.animeUpdate = settings.animeUpdate || {};

    intervalId = setInterval(async () => {
        try {
            let groups = Object.keys(store.groupMetadata);
            let latestAnime = await scraper.list().kuronime.latest();
            let oldAnime = settings.animeUpdate;

            if (!oldAnime || oldAnime.title !== latestAnime[0].title) {
                console.log(`[+] Pembaruan anime terdeteksi: ${latestAnime[0].title}`);

                let metadata = store.groupMetadata[config.id.group]
                let caption = `*🍟 Anime Episode Update*\n`;
                caption += Object.entries(latestAnime[0]).map(([key, value]) => `> *- ${key.capitalize()}:* ${value}`).join("\n");

                caption += `\n\n*- Share the Channel :*\n> https://whatsapp.com/channel/0029VaxNm957dmeaROxJiU36\n*- Join Group Komunitas kami :*\n> https://chat.whatsapp.com/GkigkWVWbyyGe5PyAbXreR`;

                if (!messageSent) {
                    await sock.sendMessage(config?.id?.group, {
                        image: {
                            url: latestAnime[0].thumbnail
                        },
                        mentions: metadata.participants.map((a) => a.id),
                        caption
                    }).then((msg) => {
                        for (let id of Object.keys(store.groupMetadata)) {
                            sock.copyNForward(id, msg);
                            delay(3000);
                        }
                    });
                    settings.animeUpdate = latestAnime[0]
                    messageSent = true
                }
            }

            console.log(`[+] Mengecek anime baru...`);
            return
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    }, 600000);
}

module.exports = {
    events
};