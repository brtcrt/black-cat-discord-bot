// Dependencies & variables

const Discord = require("discord.js");
const embedPagination = require("../../utils/embedPaginator");
const Levels = require("discord-xp");
// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "leaderboards",
    description: "Shows the leaderboards for the server.",
    category: "Simple",
    usage: "leaderboards (optional: message (if you don't want to visit the website...which would hurt my feelings :( ))",
    cooldown: 1,
    aliases: ["levels", "ranks", "lb", "leaderboard"],
    async execute(client, message, args) {
        if (args[0] === "message") {
            const rawLeaderboard = await Levels.fetchLeaderboard(
                message.guild.id,
                50
            );

            if (rawLeaderboard.length < 1)
                return reply("Nobody's in leaderboard yet.");

            const leaderboard = await Levels.computeLeaderboard(
                message.client,
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
                            `${message.guild.name}'s leaderboard, Page #${i}`
                        )
                        .setDescription(lboards.slice(b * 2048, i * 2048))
                );
            }
            embedPagination(message, lbarray, false);
        } else {
            message.channel.send({
                embeds: [
                    {
                        title: `${message.guild.name}'s leaderboard`,
                        color: "RANDOM",
                        description: `[Click this to view ${message.guild.name}'s leaderboard](https://www.blackcatbot.xyz/#/guild/${message.guild.id})`,
                    },
                ],
            });
        }
    },
};
