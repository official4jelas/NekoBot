module.exports = {
    command: "tqto",
    alias: ["credit"],
    category: ["info"],
    description: "List Contrubutor bot ini",
    async run(m) {
        let cap = `*>_ TERIMAKASIH KEPADA :*
        
> *-* Bang_syaii ( pembuat sc & pembuat scrape bot )
> *- Telegram :* https://t.me/this_syaii

> *-* AxellNetwork ( Pengembang sc & pembuat scrape bot )
> *- Github :* https://github.com/AxellNetwork

> *-* Pengguna Script ( Kalian semua )

^-^ Terimakasih sudah menggunakan script kami
semoga script kami bermanfaat untuk anda yang menggunakan/tidak menggunakan nya

– Support terus project kami lainnya di :
https://github.com/AxellNetwork

*– Forum Update :*
https://whatsapp.com/channel/0029VauJgduEwEjwwVwLnw37

https://chat.whatsapp.com/BsZHPiZoisT5GdVgiEufJK`;
        m.reply(cap);
    },
};