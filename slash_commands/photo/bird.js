// Dependencies & variables

const Discord = require("discord.js");
const nodefetch = require("node-fetch");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "bird",
    description: "Get random bird image.",
    category: "Photo/GIF",
    usage: "bird",
    cooldown: 2,
    aliases: ["birb", "chirp"],
    async execute(client, interaction) {
        await interaction.deferReply();
        try {
            const response = await nodefetch(
                "https://some-random-api.ml/img/birb"
            );
            const body = await response.json();
            interaction.editReply(body.link);
        } catch (e) {
            console.log(e);
        }
    },
};
