// Dependencies & variables

const Discord = require("discord.js");
const path = require("path");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/slash_ErrorMessage");

// Error Message Template

module.exports = {
    name: "ping",
    description: "Pong.",
    category: "Other",
    usage: "ping",
    cooldown: 1,
    aliases: ["pingreal"],
    async execute(client, interaction) {
        await interaction.reply("_ _");
        const resMsg = await interaction.fetchReply();
        await interaction.editReply(
            "Pong! Took " +
                Math.round(
                    resMsg.createdTimestamp -
                        interaction.createdTimestamp -
                        client.ws.ping
                ).toString() +
                " ms"
        );
    },
};
