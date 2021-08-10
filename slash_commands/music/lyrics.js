// Dependencies & variables

const Discord = require("discord.js");
const findLyrics = require("../../utils/findLyrics");
const embedPaginator = require("../../utils/slash_EmbedPaginator");

let lyricsURL;

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/slash_ErrorMessage");

// Error Message Template

module.exports = {
    name: "lyrics",
    description: "Find the lyrics of the song you are listening to.",
    usage: "lyrics",
    cooldown: 1,
    aliases: ["songtext"],
    async execute(client, interaction) {
        if (
            !interaction.guild.me.permissions.has(
                Discord.Permissions.FLAGS.MANAGE_MESSAGES
            )
        )
            return SendErrorMessage(
                interaction,
                "I need to have MANAGE_MESSAGES to run this command as it uses an embed with reactions and also deletes reactions!"
            );
        if (!interaction.member.voice.channel)
            return SendErrorMessage(
                interaction,
                "You need to be in a voice channel to run this command."
            );
        if (!client.playServers[interaction.guild.id].playing)
            return SendErrorMessage(interaction, "No track is being played.");
        if (!client.playServers[interaction.guild.id].loopinginfo)
            return SendErrorMessage(interaction, "No track is being played.");
        await interaction.deferReply();
        let lyrics = await findLyrics(
            interaction,
            client.playServers[interaction.guild.id].loopinginfo
        );
        if (!lyrics)
            return interaction.editReply({
                embeds: [{ description: "Couldn't find any lyrics!" }],
            });
        const lyricsIndex = Math.round(lyrics.length / 2048) + 1;
        const lyricsArray = [];
        for (let i = 1; i <= lyricsIndex; ++i) {
            let b = i - 1;
            lyricsArray.push(
                new Discord.MessageEmbed()
                    .setTitle(
                        `${
                            client.playServers[interaction.guild.id].loopinginfo
                                .title
                        }, Page #` + i
                    )
                    .setDescription(lyrics.slice(b * 2048, i * 2048))
                    .setFooter("Provided by genius.com")
            );
        }
        embedPaginator(interaction, lyricsArray, false);
    },
};
