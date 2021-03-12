// Dependencies & variables

const Discord = require("discord.js");

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
    name: "changename",
    description: "Change nicknames.",
    cooldown: 1,
    aliases: ["namechange", "changenick"],
    async execute(message, args){
        args = args.slice(1);
        let theGuy = message.mentions.members.first();
        if(!theGuy)return SendErrorMessage(message, "You didn't @ a person!");
        if (!args) return SendErrorMessage(message, "You didn't give a new nickname for the person!");
        if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) return SendErrorMessage(message, 'I don\'t have permission to change your nickname!');
        if(args.join(" ").length > 32) return SendErrorMessage(message, "Nickname can't be longer than 32 characters.");
        theGuy.setNickname(args.join(" "));
    }
};