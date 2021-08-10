// Dependencies & variables

const Discord = require("discord.js");
const path = require("path");
const Levels = require("discord-xp");
// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

async function CalculateXPReq(user) {
    let totalxpreq = 0;
    for (i = 1; i <= user.level; i++) {
        totalxpreq = totalxpreq + Levels.xpFor(i);
    }
    console.log(totalxpreq + 100);
    return totalxpreq + 200 - user.xp;
}

// Error Message Template

module.exports = {
    name: "level",
    description: "Level and xp info.",
    category: "Simple",
    usage: "level (optional: @user)",
    cooldown: 1,
    aliases: ["rank", "xp", "experience", "exp"],
    async execute(client, message, args) {
        if (!message.mentions.users.first()) {
            const target = message.author;
            const user = await Levels.fetch(target.id, message.guild.id);
            if (!user)
                return SendErrorMessage(
                    message,
                    "Seems like you haven't earned any xp yet!"
                );
            const xpreq = await CalculateXPReq(user);
            let levelupMsg = new Discord.MessageEmbed()
                .setTitle(
                    `Current stats for **${message.author.username}**:            `
                )
                .setColor("#d89ada")
                .addField("Level: ", user.level.toString(), true)
                .addField("XP: ", user.xp.toString(), true)
                .setThumbnail(message.author.displayAvatarURL())
                .setFooter(`${xpreq} xp until level up.`);
            message.channel.send({ embeds: [levelupMsg] });
        } else {
            const target = message.mentions.users.first();
            const user = await Levels.fetch(target.id, message.guild.id);
            if (!user)
                return SendErrorMessage(
                    message,
                    "Seems like you haven't earned any xp yet!"
                );
            const xpreq = await CalculateXPReq(user);
            let levelupMsg = new Discord.MessageEmbed()
                .setTitle(
                    `Current stats for **${target.username}**:            `
                )
                .setColor("#d89ada")
                .addField("Level: ", user.level.toString(), true)
                .addField("XP: ", user.xp.toString(), true)
                .setThumbnail(target.displayAvatarURL())
                .setFooter(`${xpreq} xp until level up.`);
            message.channel.send({ embeds: [levelupMsg] });
        }
    },
};
