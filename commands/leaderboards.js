// Dependencies & variables

const Discord = require("discord.js");
const embedPagination = require("../utils/embedPaginator");
const path = require("path");
const Levels = require("discord-xp");
// Dependencies & variables end

// Error Message Template

function SendErrorMessage(message, reason) {
  if (!reason) {
    reason =
      "Looks like something went wrong. Please try again. If you need help use =bot?";
  }
  let generalerrormessage = new Discord.MessageEmbed()
    .setTitle("Uh oh! Something went wrong!")
    .setColor("#f01717")
    .setDescription(reason.toString());
  message.channel.send(generalerrormessage);
}

// Error Message Template

module.exports = {
  name: "leaderboards",
  description: "",
  cooldown: 1,
  aliases: ["levels", "ranks", "lb"],
  async execute(message, args) {
    const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 50);

    if (rawLeaderboard.length < 1) return reply("Nobody's in leaderboard yet.");

    const leaderboard = await Levels.computeLeaderboard(
      message.client,
      rawLeaderboard,
      true
    );

    const lb = leaderboard.map(
      (e) =>
        `${e.position}. ${e.username}#${e.discriminator}  ---  Level: ${
          e.level
        }  XP: ${e.xp.toLocaleString()}`
    );

    let lboards = lb.join("\n");
    const lbindex = Math.round(lboards.length / 2048) + 1;
    const lbarray = [];
    for (let i = 1; i <= lbindex; ++i) {
      let b = i - 1;
      lbarray.push(
        new Discord.MessageEmbed()
          .setTitle(`${message.guild.name}'s leaderboard, Page #` + i)
          .setDescription(lboards.slice(b * 2048, i * 2048))
      );
    }
    embedPagination(message, lbarray, false);
  },
};
