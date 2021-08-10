// Dependencies & variables

const Discord = require("discord.js");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

const SendSuccessMessage = require("../../utils/SendSuccessMessage");

// Error Message Template

module.exports = {
    name: "loop",
    description: "Loops the current track.",
    usage: "loop",
    cooldown: 1,
    aliases: ["forever"],
    async execute(client, message, args) {
        if (client.playServers[message.guild.id].looping) {
            if (!client.playServers[message.guild.id].playing)
                return SendErrorMessage(message, "No track is being played.");
            client.playServers[message.guild.id].looping = false;
            return SendSuccessMessage(message, "Unlooped track.");
        } else {
            if (!client.playServers[message.guild.id].playing)
                return SendErrorMessage(message, "No track is being played.");
            client.playServers[message.guild.id].looping = true;
            return SendSuccessMessage(message, "Now looping track.");
        }
    },
};
