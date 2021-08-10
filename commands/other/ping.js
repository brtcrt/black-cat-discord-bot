// Dependencies & variables

const Discord = require("discord.js");
const path = require("path");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "ping",
    description: "Pong.",
    category: "Other",
    usage: "ping",
    cooldown: 1,
    aliases: ["pingreal"],
    async execute(client, message, args) {
        var resMsg = await message.channel.send("_ _");
        resMsg.edit(
            "Pong! Took " +
                Math.round(
                    resMsg.createdTimestamp -
                        message.createdTimestamp -
                        message.client.ws.ping
                ).toString() +
                " ms"
        );
    },
};
