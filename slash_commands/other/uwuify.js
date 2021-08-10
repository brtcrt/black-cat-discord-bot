// Dependencies & variables

const Discord = require("discord.js");
const uwuify = require("../../utils/uwuify");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "uwuify",
    description: "UwU OwO",
    options: [
        {
            name: "text",
            type: "STRING",
            description: "Uwuifys a given text OwO.",
            required: true,
        },
    ],
    usage: "uwuify (text)",
    category: "Other",
    cooldown: 1,
    aliases: [],
    async execute(client, interaction) {
        const text = interaction.options.getString("text");
        interaction.reply(uwuify(text));
    },
};
