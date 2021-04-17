// Dependencies & variables

const Discord = require("discord.js");
const path = require("path");

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
    name: "ping",
    description: "",
    cooldown: 1,
    aliases: ["pingreal"],
    async execute(message, args){
        var resMsg = await message.channel.send('_ _');
        resMsg.edit('Pong! Took ' + Math.round((resMsg.createdTimestamp - message.createdTimestamp) - message.client.ws.ping).toString() + " ms"); 
    }
};