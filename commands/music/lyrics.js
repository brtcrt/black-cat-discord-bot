// Dependencies & variables

const Discord = require("discord.js");
const findLyrics = require("../../utils/findLyrics");
const embedPaginator = require("../../utils/embedPaginator");

let lyricsURL;

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "lyrics",
    description: "Find the lyrics of the song you are listening to.",
    usage: "lyrics",
    cooldown: 1,
    aliases: ["songtext"],
    async execute(client, message, args) {
        if (
            !message.guild.me.permissions.has(
                Discord.Permissions.FLAGS.MANAGE_MESSAGES
            )
        )
            return SendErrorMessage(
                message,
                "I need to have MANAGE_MESSAGES to run this command as it uses an embed with reactions and also deletes reactions!"
            );
        if (!message.member.voice.channel)
            return SendErrorMessage(
                message,
                "You need to be in a voice channel to run this command."
            );
        if (!client.playServers[message.guild.id].playing)
            return SendErrorMessage(message, "No track is being played.");
        if (!client.playServers[message.guild.id].loopinginfo)
            return SendErrorMessage(message, "No track is being played.");
        const sentMessage = await message.channel.send(
            "Searching for lyrics..."
        );
        let lyrics = await findLyrics(
            message,
            client.playServers[message.guild.id].loopinginfo
        );
        if (!lyrics)
            return SendErrorMessage(message, "Couldn't find any lyrics");
        const lyricsIndex = Math.round(lyrics.length / 2048) + 1;
        const lyricsArray = [];
        for (let i = 1; i <= lyricsIndex; ++i) {
            let b = i - 1;
            lyricsArray.push(
                new Discord.MessageEmbed()
                    .setTitle(
                        `${
                            client.playServers[message.guild.id].loopinginfo
                                .title
                        }, Page #` + i
                    )
                    .setDescription(lyrics.slice(b * 2048, i * 2048))
                    .setFooter("Provided by genius.com")
            );
        }
        sentMessage
            .edit({
                content: ":white_check_mark: Lyrics Found!",
            })
            .then((msg) => {
                msg.delete({ timeout: 2000 });
            });
        embedPaginator(message, lyricsArray, false);
    },
};
