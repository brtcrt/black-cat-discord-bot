// Dependencies & variables

const Discord = require("discord.js");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/slash_ErrorMessage");

const SendSuccessMessage = require("../../utils/slash_SuccessMessage");

// Error Message Template

module.exports = {
    name: "loop",
    description: "Loops the current track.",
    usage: "loop",
    cooldown: 1,
    aliases: ["forever"],
    async execute(client, interaction) {
        if (client.playServers[interaction.guild.id].looping) {
            if (!client.playServers[interaction.guild.id].playing)
                return SendErrorMessage(
                    interaction,
                    "No track is being played."
                );
            client.playServers[interaction.guild.id].looping = false;
            return SendSuccessMessage(interaction, "Unlooped track.");
        } else {
            if (!client.playServers[interaction.guild.id].playing)
                return SendErrorMessage(
                    interaction,
                    "No track is being played."
                );
            client.playServers[interaction.guild.id].looping = true;
            return SendSuccessMessage(interaction, "Now looping track.");
        }
    },
};
