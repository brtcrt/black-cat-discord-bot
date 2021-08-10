// Dependencies & variables

const Discord = require("discord.js");
const path = require("path");
const Levels = require("discord-xp");
// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/slash_ErrorMessage");

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
    options: [
        {
            name: "user",
            type: "USER",
            description: "User to show the level of.",
            required: false,
        },
    ],
    category: "Simple",
    usage: "level (optional: @user)",
    cooldown: 1,
    aliases: ["rank", "xp", "experience", "exp"],
    async execute(client, interaction) {
        if (!interaction.options.getUser("user")) {
            const target = interaction.user;
            const user = await Levels.fetch(target.id, interaction.guild.id);
            if (!user)
                return SendErrorMessage(
                    message,
                    "Seems like you haven't earned any xp yet!"
                );
            const xpreq = await CalculateXPReq(user);
            let levelupMsg = new Discord.MessageEmbed()
                .setTitle(
                    `Current stats for **${interaction.user.username}**:            `
                )
                .setColor("#d89ada")
                .addField("Level: ", user.level.toString(), true)
                .addField("XP: ", user.xp.toString(), true)
                .setThumbnail(target.displayAvatarURL())
                .setFooter(`${xpreq} xp until level up.`);
            interaction.reply({ embeds: [levelupMsg] });
        } else {
            const target = interaction.options.getUser("user");
            const user = await Levels.fetch(target.id, interaction.guild.id);
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
            interaction.reply({ embeds: [levelupMsg] });
        }
    },
};
