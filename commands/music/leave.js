// Dependencies & variables

const Discord = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "die",
    description: "Leave the voice channel and clear queue.",
    usage: "die",
    cooldown: 1,
    aliases: ["leave", "sg", "fuckoff", "öl"],
    async execute(client, message, args) {
        client.playServers[message.guild.id].queue = [];
        client.playServers[message.guild.id].playing = false;
        client.playServers[message.guild.id].looping = false;
        client.playServers[message.guild.id].paused = false;
        const connection = getVoiceConnection(message.guild.id);
        if (connection) {
            connection.destroy();
            return;
        } else {
            return;
        }
    },
};
