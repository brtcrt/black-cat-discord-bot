// Dependencies & variables

const Discord = require("discord.js");
const axios = require("axios");
const base_url = "https://nhentai.net/api/gallery/";
const cover_url = "https://t.nhentai.net/galleries/";

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "egeabim",
    description: "nhentai doujin cover.",
    category: "Nhentai",
    usage: "egeabim (optional: number)",
    cooldown: 1,
    aliases: ["hentaiciege"],
    async execute(client, message, args) {
        if (!args[0]) {
            let id = String(Math.floor(Math.random() * 250000) + 100000);
            const url = `${base_url}${id}`;
            const res = await axios({
                url: url,
                methon: "get",
            });
            const data = res.data;
            const title = data.title.english;
            const d_id = id;
            var tags = [];
            const tags_list = data.tags;
            tags_list.forEach((tag) => {
                if (tag.type != "tag") {
                } else {
                    tags.push(tag.name);
                }
            });
            const type = data.images.cover.t;
            const media_id = data.media_id;
            const cover_page = `${cover_url}${media_id}/cover.${
                type === "p" ? "png" : "jpg"
            }`;
            const hentai_embed = {
                title: title,
                fields: [
                    {
                        name: "Tags: ",
                        value: tags.join(", "),
                        inline: false,
                    },
                    {
                        name: "Link: ",
                        value: `https://www.nhentai.net/g/${d_id}`,
                        inline: false,
                    },
                ],
                footer: {
                    text: "",
                    icon_url: cover_page,
                },
            };
            await message.channel.send({ embed: hentai_embed });
            return message.channel.send({
                files: [
                    {
                        attachment: cover_page,
                        name: `SPOILER_FILE.${type === "p" ? "png" : "jpg"}`,
                    },
                ],
            });
        } else {
            let id = args[0];
            const url = `${base_url}${id}`;
            const res = await axios({
                url: url,
                methon: "get",
            });
            const data = res.data;
            const title = data.title.english;
            const d_id = data.id;
            var tags = [];
            const tags_list = data.tags;
            tags_list.forEach((tag) => {
                if (tag.type != "tag") {
                } else {
                    tags.push(tag.name);
                }
            });
            const type = data.images.cover.t;
            const media_id = data.media_id;
            const cover_page = `${cover_url}${media_id}/cover.${
                type === "p" ? "png" : "jpg"
            }`;
            const hentai_embed = {
                title: title,
                fields: [
                    {
                        name: "Tags: ",
                        value: tags.join(", "),
                        inline: false,
                    },
                    {
                        name: "Link: ",
                        value: `https://www.nhentai.net/g/${d_id}`,
                        inline: false,
                    },
                ],
                footer: {
                    text: "",
                    icon_url: cover_page,
                },
            };
            await message.channel.send({ embeds: [hentai_embed] });
            return await message.channel.send({
                files: [
                    {
                        attachment: cover_page,
                        name: `SPOILER_FILE.${type === "p" ? "png" : "jpg"}`,
                    },
                ],
            });
        }
    },
};
