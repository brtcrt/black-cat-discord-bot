// Dependencies & variables

const Discord = require("discord.js");
const axios = require("axios");
const base_url = "https://nekos.moe/api/v1/";

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "mewhenpathofexile",
    description: "Catgirl",
    category: "Catgirl",
    usage: "mewhenpathofexile",
    cooldown: 1,
    aliases: [
        "mewhendestiny2",
        "mewhenegeaglar",
        "dorukabigf",
        "bennezamantuvalettepersona5oynamayagiderken",
    ],
    async execute(client, message, args) {
        const res = await axios({
            url:
                base_url +
                `random/image?${
                    args[0] == "false" ? "nsfw=false" : "nsfw=true"
                }`,
            methon: "post",
        });
        const res_image_id = res.data.images[0].id;
        console.log(res.data.images[0]);
        const is_NSFW = res.data.images[0].nsfw;
        if (is_NSFW && message.channel.isNSFW) {
            return message.channel.send({
                files: [
                    {
                        attachment: `https://nekos.moe/image/${res_image_id}`,
                        name: "img.jpg",
                    },
                ],
            });
        } else if (is_NSFW && !message.channel.isNSFW) {
            return message.channel.send({
                files: [
                    {
                        attachment: `https://nekos.moe/image/${res_image_id}`,
                        name: "SPOILER_FILE.jpg",
                    },
                ],
            });
        } else {
            return message.channel.send({
                files: [
                    {
                        attachment: `https://nekos.moe/image/${res_image_id}`,
                        name: "img.jpg",
                    },
                ],
            });
        }
    },
};
