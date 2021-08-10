// Dependencies & variables

const Discord = require("discord.js");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

const SendSuccessMessage = require("../../utils/SendSuccessMessage");

// Error Message Template

module.exports = {
    name: "pause",
    description: "Pauses the track.",
    usage: "pause",
    cooldown: 1,
    aliases: ["wait"],
    async execute(client, message, args) {
        if (!message.member.voice.channel)
            return SendErrorMessage(
                message,
                "You need to be in a voice channel to run this command."
            );
        if (!client.playServers[message.guild.id].playing)
            return SendErrorMessage(message, "No track is being played.");
        if (!client.playServers[message.guild.id].dispatch)
            return SendErrorMessage(message);
        if (client.playServers[message.guild.id].paused === false) {
            try {
                client.playServers[message.guild.id].dispatch.pause();
                client.playServers[message.guild.id].paused = true;
            } catch (e) {
                console.log(e);
            }
            return SendSuccessMessage(message, "Paused!");
        }
        if (client.playServers[message.guild.id].paused === true) {
            try {
                client.playServers[message.guild.id].dispatch.unpause();
                client.playServers[message.guild.id].paused = false;
            } catch (e) {
                console.log(e);
            }
            return SendSuccessMessage(message, "Unpaused!");
        }
    },
};
