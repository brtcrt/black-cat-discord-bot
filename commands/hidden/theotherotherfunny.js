// Dependencies & variables

const Discord = require("discord.js");
const axios = require("axios");
const base_url = "https://nhentai.net/api/galleries/search";
const cover_url = "https://t.nhentai.net/galleries/";

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "egeabigfsearch",
    description: "nhentai doujin finder.",
    category: "Nhentai",
    usage: "egeabigfsearch (search_term)",
    cooldown: 1,
    aliases: ["dorukabigfsearch"],
    async execute(client, message, args) {
        if (!args[0]) {
            return SendErrorMessage(
                message,
                "I need at least one search term."
            );
        }
        var limit = 0;
        if (Number.isInteger(parseInt(args[args.length - 1]))) {
            limit = args.pop();
        }
        const terms = args.join("%20");
        console.log(terms);
        const url = `${base_url}?query=${terms}&sort=popular`;
        const res = await axios({
            url: url,
            methon: "get",
        });
        if (res.data.error) {
            return SendErrorMessage(message, "Couldn't find");
        }
        const data =
            res.data.result[!parseInt(limit) <= 0 ? parseInt(limit) - 1 : 0];
        const title = data.title.english;
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
        const id = data.id;
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
                    value: `https://www.nhentai.net/g/${id}`,
                    inline: false,
                },
            ],
            footer: {
                text: "",
                icon_url: cover_page,
            },
        };
        await message.channel.send({
            embeds: [hentai_embed],
        });
        return message.channel.send({
            files: [
                {
                    attachment: cover_page,
                    name: `SPOILER_FILE.${type === "p" ? "png" : "jpg"}`,
                },
            ],
        });
    },
};
