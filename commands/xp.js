// Dependencies & variables

const Discord = require("discord.js");
const path = require("path");
let newxp  = require(path.join(__dirname, "../")+"/database/exp.json");

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

// Error Message Template

module.exports = {
    name: "level",
    description: "",
    cooldown: 1,
    aliases: ["rank", "xp", "experience", "exp"],
    async execute(message, args){
        someIndex = newxp[message.guild.id].indexOf(message.author.id);
        let curXP = newxp[message.guild.id][someIndex+1].exp;
        let curLVL = newxp[message.guild.id][someIndex+1].lvl;
        let XPreq = Math.pow(2, curLVL) * 4;
        if(!message.mentions.users.first()){
            let XPNeeded = XPreq - curXP;
            isCooldown = true;
            let levelupMsg = new Discord.MessageEmbed()
            .setTitle(`Current stats for **${message.author.username}**:            `)
            .setColor("#d89ada")
            .addField("Level: ", curLVL, true)
            .addField("XP: ", curXP, true)
            .setThumbnail(message.author.displayAvatarURL())
            .setFooter(`${XPNeeded} xp until level up.`);
            message.channel.send(levelupMsg);
        } else{
            let otherId = (message.mentions.users.first().id);
            let someIndexforOther = newxp[message.guild.id].indexOf(otherId);
            let XPNeededforOther = (4*(Math.pow(2,newxp[message.guild.id][someIndexforOther+1].lvl))) - (newxp[message.guild.id][someIndexforOther+1].exp);
            let curXPforOther = newxp[message.guild.id][someIndexforOther+1].exp;
            let curLVLforOther = newxp[message.guild.id][someIndexforOther+1].lvl;
            isCooldown = true;
            let levelofMsgforOther = new Discord.MessageEmbed()
            .setTitle(`Current stats for **${message.mentions.users.first().username}**:            `)
            .setColor("#d89ada")
            .addField("Level: ", curLVLforOther, true)
            .addField("XP: ", curXPforOther, true)
            .setThumbnail(message.mentions.users.first().displayAvatarURL())
            .setFooter(`${XPNeededforOther} xp until ${message.mentions.users.first().username} levels up.`);
            message.channel.send(levelofMsgforOther);
        };
    }
};