// Dependencies & variables

const Discord = require("discord.js");
const playNewTrack = require("../../utils/slash_playNewTrack");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/slash_ErrorMessage");

// Error Message Template

module.exports = {
    name: "skip",
    description: "Skips to the next track in queue.",
    usage: "skip",
    cooldown: 1,
    aliases: ["next"],
    async execute(client, interaction) {
        if (!interaction.member.voice.channel)
            return SendErrorMessage(
                interaction,
                "You need to be in a voice channel to run this command."
            );
        if (!client.playServers[interaction.guild.id])
            return SendErrorMessage(interaction, "Queue is currently empty!");
        if (!client.playServers[interaction.guild.id].playing)
            return SendErrorMessage(interaction, "Queue is currently empty!");
        if (client.playServers[interaction.guild.id].queue[0] == null)
            return SendErrorMessage(interaction, "Queue is currently empty!");

        await playNewTrack(client, interaction);
    },
};
