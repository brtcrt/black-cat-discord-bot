const axios = require("axios");
const { htmlToText } = require("html-to-text");
const embedPagination = require("../../utils/slash_embedPaginator");
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

const SendErrorMessage = require("../../utils/slash_ErrorMessage");

// Error Message Template

module.exports = {
    name: "scp",
    description: "Wiki page of a given scp.",
    options: [
        {
            name: "number",
            type: "NUMBER",
            description: "SCP number.",
            required: true,
        },
    ],
    category: "Other",
    usage: "scp (optional: scp number)",
    cooldown: 1,
    aliases: ["scpwiki"],
    async execute(client, interaction) {
        const number = interaction.options.getNumber("number");
        await interaction.deferReply();
        if (!number) {
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
            embedPagination(interaction, embed_array, false).catch((err) =>
                SendErrorMessage(interaction, err)
            );
        } else {
            let clean_text = await main(number);
            let split_index = Math.round(clean_text.length / 2048) + 1;
            let embed_array = [];
            for (let i = 1; i <= split_index; ++i) {
                let b = i - 1;
                embed_array.push(
                    new Discord.MessageEmbed()
                        .setTitle(`Scp-${number}, Page #` + i)
                        .setDescription(clean_text.slice(b * 2048, i * 2048))
                );
            }
            embedPagination(interaction, embed_array, false).catch((err) =>
                SendErrorMessage(interaction, err)
            );
        }
    },
};
