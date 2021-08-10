// Dependencies & variables

const Discord = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/slash_ErrorMessage");

// Error Message Template

module.exports = {
    name: "die",
    description: "Leave the voice channel and clear queue.",
    usage: "die",
    cooldown: 1,
    aliases: ["leave", "sg", "fuckoff", "öl"],
    async execute(client, interaction) {
        client.playServers[interaction.guild.id].queue = [];
        client.playServers[interaction.guild.id].playing = false;
        client.playServers[interaction.guild.id].looping = false;
        client.playServers[interaction.guild.id].paused = false;
        const connection = getVoiceConnection(interaction.guild.id);
        if (connection) {
            connection.destroy();
            return interaction.reply({ embeds: [{ description: "Bye" }] });
        } else {
            return interaction.reply({ embeds: [{ description: "Bye" }] });
        }
    },
};
