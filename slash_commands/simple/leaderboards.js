// Dependencies & variables

const Discord = require("discord.js");
const embedPagination = require("../../utils/slash_embedPaginator");
const Levels = require("discord-xp");
// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/slash_ErrorMessage");

// Error Message Template

module.exports = {
    name: "leaderboards",
    description: "Shows the leaderboards for the server.",
    options: [
        {
            name: "form",
            type: "STRING",
            description:
                "Sends the lb in embed form or the usual website link.",
            choices: [
                {
                    name: "message",
                    value: "message",
                },
                {
                    name: "site",
                    value: "site",
                },
            ],
            required: false,
        },
    ],
    category: "Simple",
    usage: "leaderboards (optional: message (if you don't want to visit the website...which would hurt my feelings :( ))",
    cooldown: 1,
    aliases: ["levels", "ranks", "lb", "leaderboard"],
    async execute(client, interaction) {
        const form = interaction.options.getString("form");
        if (form === "message") {
            await interaction.deferReply();
            const rawLeaderboard = await Levels.fetchLeaderboard(
                interaction.guild.id,
                50
            );

            if (rawLeaderboard.length < 1)
                return interaction.reply("Nobody's in leaderboard yet.");

            const leaderboard = await Levels.computeLeaderboard(
                client,
                rawLeaderboard,
                true
            );

            const lb = leaderboard.map(
                (e) =>
                    `${e.position}. ${e.username}#${
                        e.discriminator
                    }  ---  Level: ${e.level}  XP: ${e.xp.toLocaleString()}`
            );

            let lboards = lb.join("\n");
            const lbindex = Math.round(lboards.length / 2048) + 1;
            const lbarray = [];
            for (let i = 1; i <= lbindex; ++i) {
                let b = i - 1;
                lbarray.push(
                    new Discord.MessageEmbed()
                        .setTitle(
                            `${interaction.guild.name}'s leaderboard, Page #${i}`
                        )
                        .setDescription(lboards.slice(b * 2048, i * 2048))
                );
            }
            embedPagination(interaction, lbarray, false);
        } else {
            interaction.reply({
                embeds: [
                    {
                        title: `${interaction.guild.name}'s leaderboard`,
                        color: "RANDOM",
                        description: `[Click this to view ${interaction.guild.name}'s leaderboard](https://www.blackcatbot.xyz/#/guild/${interaction.guild.id})`,
                    },
                ],
            });
        }
    },
};
