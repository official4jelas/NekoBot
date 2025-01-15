class Command {
    constructor() {
        this.command = "tourl"
        this.alias = ["upload"]
        this.category = ["tools"]
        this.settings = {
            limit: true
        }
        this.description = "Ubah media menjadi link"
        this.loading = true
    }
    run = async (m, {
        sock,
        Uploader,
        Func,
        Scraper,
        config,
        store
    }) => {
        let q = m.quoted ? m.quoted : m;
        if (!q.msg.mimetype) throw "> Reply/kirim Media yang ingin diubah menjadi tourl"

        let buffer = await q.download();
        let url = await Uploader.catbox(buffer);
        let caption = "*– 乂 Media - Uploader*\n"
        caption += `> *-* Ukuran : ${Func.formatSize(buffer.length)}\n`
        caption += `> *-* Url : ${url}`
        m.reply(caption);
    }
}

module.exports = new Command();