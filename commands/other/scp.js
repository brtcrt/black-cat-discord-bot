const axios = require("axios");
const { htmlToText } = require("html-to-text");
const embedPagination = require("../../utils/embedPaginator");
async function main(scp) {
    const res = await axios({
        url: `http://scp-wiki.wikidot.com/scp-${scp}`,
        method: "get",
    });

    let second_ver = res.data.split(
        '<div style="text-align: right;"><div class="page-rate-widget-box"><span class="rate-points">rating:&nbsp;'
    );
    let clean_first = second_ver[1]
        .split("<!-- wikidot_bottom_300x250 -->")[0]
        .split("<p><strong>")
        .join("")
        .trim()
        .split("\n");
    clean_first.splice(0, 1);
    let clean_second = clean_first.join("\n");
    let text = htmlToText(clean_second, {
        wordwrap: 130,
    });
    return text;
}

// Dependencies & variables

const Discord = require("discord.js");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "scp",
    description: "Wiki page of a given scp.",
    category: "Other",
    usage: "scp (optional: scp number)",
    cooldown: 1,
    aliases: ["scpwiki"],
    async execute(client, message, args) {
        if (!args[0] || args[0] === "") {
            let random_scp = Math.floor(Math.random() * 3999) + 1000;
            let clean_text = await main(random_scp);
            let split_index = Math.round(clean_text.length / 2048) + 1;
            let embed_array = [];
            for (let i = 1; i <= split_index; ++i) {
                let b = i - 1;
                embed_array.push(
                    new Discord.MessageEmbed()
                        .setTitle(`Scp-${random_scp}, Page #` + i)
                        .setDescription(clean_text.slice(b * 2048, i * 2048))
                );
            }
            embedPagination(message, embed_array, false).catch((err) =>
                SendErrorMessage(message, err)
            );
        } else {
            let clean_text = await main(args[0]);
            let split_index = Math.round(clean_text.length / 2048) + 1;
            let embed_array = [];
            for (let i = 1; i <= split_index; ++i) {
                let b = i - 1;
                embed_array.push(
                    new Discord.MessageEmbed()
                        .setTitle(`Scp-${args}, Page #` + i)
                        .setDescription(clean_text.slice(b * 2048, i * 2048))
                );
            }
            embedPagination(message, embed_array, false).catch((err) =>
                SendErrorMessage(message, err)
            );
        }
    },
};
