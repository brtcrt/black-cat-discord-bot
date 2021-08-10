// Dependencies & variables

const Discord = require("discord.js");
const axios = require("axios");
const hentaiPaginator = require("../../utils/hentaiPaginator");
const base_url = "https://nhentai.net/api/gallery/";
const page_url = "https://i.nhentai.net/galleries/";
const cover_url = "https://t.nhentai.net/galleries/";

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "okumayazmabilinceben",
    description: "nhentai doujin full",
    category: "Nhentai",
    usage: "okumayazmabilinceben (optional: number)",
    cooldown: 1,
    aliases: ["dorukabimatprojesi", "egesicarkenbunuyapiyor"],
    async execute(client, message, args) {
        if (!args[0]) {
            let id = String(Math.floor(Math.random() * 250000) + 100000);
            const url = `${base_url}${id}`;
            const res = await axios({
                url: url,
                methon: "get",
            });
            const data = res.data;
            console.log(data);
            let page_ext = [];
            data.images.pages.forEach((page) => {
                page_ext.push(page.t);
            });
            console.log(page_ext);
            const title = data.title.english;
            const media_id = data.media_id;
            let pages = [];
            for (i = 0; i < page_ext.length; i++) {
                pages.push(
                    `${page_url}${media_id}/${i + 1}.${
                        page_ext[i] === "j" ? "jpg" : "png"
                    }`
                );
            }
            console.log(pages);
            hentaiPaginator(message, title, pages);
        } else {
            let id = args[0];
            const url = `${base_url}${id}`;
            const res = await axios({
                url: url,
                methon: "get",
            });
            const data = res.data;
            console.log(data);
            let page_ext = [];
            data.images.pages.forEach((page) => {
                page_ext.push(page.t);
            });
            console.log(page_ext);
            const title = data.title.english;
            const media_id = data.media_id;
            let pages = [];
            for (i = 0; i < page_ext.length; i++) {
                pages.push(
                    `${page_url}${media_id}/${i + 1}.${
                        page_ext[i] === "j" ? "jpg" : "png"
                    }`
                );
            }
            console.log(pages);
            hentaiPaginator(message, title, pages);
        }
    },
};
