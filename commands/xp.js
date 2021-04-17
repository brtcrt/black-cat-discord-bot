// Dependencies & variables

const Discord = require("discord.js");
const path = require("path");
const Levels = require("discord-xp");
// Dependencies & variables end

// Error Message Template

function SendErrorMessage(message, reason){
    if(!reason){
        reason = "Looks like something went wrong. Please try again. If you need help use =bot?"
    };
    let generalerrormessage = new Discord.MessageEmbed()
    .setTitle("Uh oh! Something went wrong!")
    .setColor("#f01717")
    .setDescription(reason.toString());
    message.channel.send(generalerrormessage);
};

async function CalculateXPReq(user){
    let totalxpreq = 0;
    for(i=1;i<=user.level;i++) {
        totalxpreq = totalxpreq + Levels.xpFor(i);
    };
    console.log(totalxpreq+100);
    return (totalxpreq+200) - user.xp;
}

// Error Message Template

module.exports = {
    name: "level",
    description: "",
    cooldown: 1,
    aliases: ["rank", "xp", "experience", "exp"],
    async execute(message, args){
        if(!message.mentions.users.first()){
            const target = message.author;
            const user = await Levels.fetch(target.id, message.guild.id);
            if(!user) return SendErrorMessage(message, "Seems like you haven't earned any xp yet!");
            const xpreq = await CalculateXPReq(user);
            let levelupMsg = new Discord.MessageEmbed()
            .setTitle(`Current stats for **${message.author.username}**:            `)
            .setColor("#d89ada")
            .addField("Level: ", user.level, true)
            .addField("XP: ", user.xp, true)
            .setThumbnail(message.author.displayAvatarURL())
            .setFooter(`${xpreq} xp until level up.`);
            message.channel.send(levelupMsg);
        } else{
            const target = message.mentions.users.first();
            const user = await Levels.fetch(target.id, message.guild.id);
            if(!user) return SendErrorMessage(message, "Seems like you haven't earned any xp yet!");
            const xpreq = await CalculateXPReq(user);
            let levelupMsg = new Discord.MessageEmbed()
            .setTitle(`Current stats for **${target.username}**:            `)
            .setColor("#d89ada")
            .addField("Level: ", user.level, true)
            .addField("XP: ", user.xp, true)
            .setThumbnail(target.displayAvatarURL())
            .setFooter(`${xpreq} xp until level up.`);
            message.channel.send(levelupMsg);
        };
    }
};