// Dependencies & variables

const Discord = require("discord.js");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/slash_ErrorMessage");

// Error Message Template

module.exports = {
    name: "rr",
    description: "Russian roulette. Be careful! If you die, you get kicked.",
    category: "Game",
    usage: "rr",
    cooldown: 3,
    aliases: ["russianroulette"],
    async execute(client, interaction) {
        if (
            !interaction.guild.me.permissions.has(
                Discord.Permissions.FLAGS.KICK_MEMBERS
            )
        )
            return SendErrorMessage(
                interaction,
                "I need to have KICK_MEMBERS to run this command as it kicks you when you lose."
            );
        await interaction.deferReply();
        let number = Math.floor(Math.random() * 5 + 1);
        let number2 = Math.floor(Math.random() * 5 + 1);
        if (number === number2) {
            client.curr_user.rr_streaks.losestreak += 1;
            client.curr_user.rr_streaks.winstreak = 0;
            if (
                client.curr_user.rr_streaks.losestreak >
                client.curr_user.rr_streaks.longestloss
            ) {
                client.curr_user.rr_streaks.longestloss =
                    client.curr_user.rr_streaks.losestreak;
            }
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
            interaction.editReply({ embeds: [deathMessage] });
            if (
                !interaction.guild.me.permissions.has(
                    Discord.Permissions.FLAGS.KICK_MEMBERS
                )
            )
                return SendErrorMessage(
                    interaction,
                    "I don't have the permission to kick members!"
                );
            if (interaction.user.id != interaction.guild.ownerId) {
                try {
                    interaction.user.kick();
                } catch (err) {
                    console.log(err);
                    interaction.channel.send(
                        `An error occured while trying to kick **${interaction.user.username}**`
                    );
                }
            } else
                interaction.channel.send(
                    `An error occured while trying to kick **${interaction.user.username}**`
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
            interaction.editReply({ embeds: [liveMessage] });
        }
    },
};
