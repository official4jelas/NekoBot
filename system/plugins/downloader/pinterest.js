let neko = async (m, {
    sock,
    Func,
    Scraper,
    text,
    Uploader
}) => {
    if (!text) throw "> Masukan query/link dari pinterest !"
    if (Func.isUrl(text)) {
        if (!/pinterest.com|pin.it/.test(text)) throw "> Masukan link dari pinterest !";
        let data = await Scraper.pinterest.download(text);
        let cap = "*– 乂 Pinterest - Downloader*\n"
        cap += `> *-* Title : ${data.title}\n`
        cap += `> *-* Keyword : ${data.keyword.join(", ")}\n`
        cap += `> *-* Author : ${data.author.name}\n`

        sock.sendFile(m.cht, data.download, null, cap, m);
    } else {
        let data = await Scraper.pinterest.search(text);
        let result = data.getRandom();
        let caption = "*– 乂 Pinterest - search*\n"
        caption += Object.entries(result).map(([a, b]) => `> *-* ${a.capitalize()} : ${b}`).join("\n");

        m.reply({
            image: {
                url: result.image
            },
            caption
        });
    }
}

neko.command = "pinterest"
neko.alias = ["pin", "pindl"]
neko.category = ["downloader", "tools"]
neko.settings = {
    limit: true
}
neko.description = "Mencari/download media dari pinterest !"
neko.loading = true

module.exports = neko