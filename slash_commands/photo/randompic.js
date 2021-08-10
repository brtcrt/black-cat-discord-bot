// Dependencies & variables

const Discord = require("discord.js");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "randompic",
    description: "Get a random picture.",
    category: "Photo/GIF",
    usage: "randompic",
    cooldown: 2,
    aliases: ["randompicture"],
    async execute(client, interaction) {
        await interaction.deferReply();
        let randomimgLink =
            "https://picsum.photos/" +
            Math.floor(Math.random() * 3000).toString();
        interaction.editReply(randomimgLink);
    },
};
