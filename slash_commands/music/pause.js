// Dependencies & variables

const Discord = require("discord.js");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/slash_ErrorMessage");

const SendSuccessMessage = require("../../utils/slash_SuccessMessage");

// Error Message Template

module.exports = {
    name: "pause",
    description: "Pauses the track.",
    usage: "pause",
    cooldown: 1,
    aliases: ["wait"],
    async execute(client, interaction) {
        if (!interaction.member.voice.channel)
            return SendErrorMessage(
                interaction,
                "You need to be in a voice channel to run this command."
            );
        if (!client.playServers[interaction.guild.id].playing)
            return SendErrorMessage(interaction, "No track is being played.");
        if (!client.playServers[interaction.guild.id].dispatch)
            return SendErrorMessage(interaction);
        if (client.playServers[interaction.guild.id].paused === false) {
            try {
                client.playServers[interaction.guild.id].dispatch.pause();
                client.playServers[interaction.guild.id].paused = true;
            } catch (e) {
                console.log(e);
            }
            return SendSuccessMessage(interaction, "Paused!");
        }
        if (client.playServers[interaction.guild.id].paused === true) {
            try {
                client.playServers[interaction.guild.id].dispatch.unpause();
                client.playServers[interaction.guild.id].paused = false;
            } catch (e) {
                console.log(e);
            }
            return SendSuccessMessage(interaction, "Unpaused!");
        }
    },
};
