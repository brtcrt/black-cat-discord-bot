// Dependencies & variables

const Discord = require("discord.js");
const playNewTrack = require("../../utils/playNewTrack");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "skip",
    description: "Skips to the next track in queue.",
    usage: "skip",
    cooldown: 1,
    aliases: ["next"],
    async execute(client, message, args) {
        if (!message.member.voice.channel)
            return SendErrorMessage(
                message,
                "You need to be in a voice channel to run this command."
            );
        if (!client.playServers[message.guild.id])
            return SendErrorMessage(message, "Queue is currently empty!");
        if (!client.playServers[message.guild.id].playing)
            return SendErrorMessage(message, "Queue is currently empty!");
        if (client.playServers[message.guild.id].queue[0] == null)
            return SendErrorMessage(message, "Queue is currently empty!");
        return await playNewTrack(client, message);
    },
};
