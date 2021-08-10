// Dependencies & variables

const Discord = require("discord.js");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "russianroulette",
    description: "Russian roulette. Be careful! If you die, you get kicked.",
    category: "Game",
    usage: "russianroulette",
    cooldown: 3,
    aliases: ["rr"],
    async execute(client, message, args) {
        if (
            !message.guild.me.permissions.has(
                Discord.Permissions.FLAGS.KICK_MEMBERS
            )
        )
            return SendErrorMessage(
                message,
                "I need to have KICK_MEMBERS to run this command as it kicks you when you lose."
            );

        let number = Math.floor(Math.random() * 5 + 1);
        let number2 = Math.floor(Math.random() * 5 + 1);
        if (number === number2) {
            client.curr_user.rr_streaks.losestreak += 1;
            if (
                client.curr_user.rr_streaks.losestreak >
                client.curr_user.rr_streaks.longestloss
            ) {
                client.curr_user.rr_streaks.longestloss =
                    client.curr_user.rr_streaks.losestreak;
            }
            client.curr_user.rr_streaks.winstreak = 0;
            client.curr_user.save();
            let loseStreak = client.curr_user.rr_streaks.losestreak.toString();
            let longestLoseStreak =
                client.curr_user.rr_streaks.longestloss.toString();
            let longestWinStreak =
                client.curr_user.rr_streaks.longestwin.toString();
            let deathMessage = new Discord.MessageEmbed()
                .setTitle("Pow!")
                .setColor("RANDOM")
                .setFooter(
                    `Lose Streak: ${loseStreak}\nLongest Lose Streak: ${longestLoseStreak}\nLongest Win Streak: ${longestWinStreak}`
                )
                .setDescription("You died :(");
            message.channel.send({ embeds: [deathMessage] });
            if (
                !message.guild.me.permissions.has(
                    Discord.Permissions.FLAGS.KICK_MEMBERS
                )
            )
                return SendErrorMessage(
                    message,
                    "I don't have the permission to kick members!"
                );
            if (message.member.id != message.guild.ownerId) {
                try {
                    message.member.kick();
                } catch (err) {
                    console.log(err);
                    message.channel.send(
                        `An error occured while trying to kick **${message.author.username}**`
                    );
                }
            } else
                return SendErrorMessage(
                    message,
                    `An error occured while trying to kick **${message.author.username}**`
                );
        } else {
            client.curr_user.rr_streaks.losestreak = 0;
            client.curr_user.rr_streaks.winstreak += 1;
            if (
                client.curr_user.rr_streaks.winstreak >
                client.curr_user.rr_streaks.longestwin
            ) {
                client.curr_user.rr_streaks.longestwin =
                    client.curr_user.rr_streaks.winstreak;
            }
            client.curr_user.save();
            let winStreak = client.curr_user.rr_streaks.winstreak.toString();
            let longestLoseStreak =
                client.curr_user.rr_streaks.longestloss.toString();
            let longestWinStreak =
                client.curr_user.rr_streaks.longestwin.toString();
            let liveMessage = new Discord.MessageEmbed()
                .setTitle("Click")
                .setColor("RANDOM")
                .setFooter(
                    `Win Streak: ${winStreak}\nLongest Lose Streak: ${longestLoseStreak}\nLongest Win Streak: ${longestWinStreak}`
                )
                .setDescription("You are still alive. For now...");
            message.channel.send({ embeds: [liveMessage] });
        }
    },
};
