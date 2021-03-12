// Dependencies & variables

const Discord = require("discord.js");
const nodefetch = require("node-fetch");

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
    name: "bird",
    description: "Get random bird image.",
    cooldown: 2,
    aliases: ["birb", "chirp"],
    async execute(message, args){
        let sent = await message.channel.send("Getting bird pic...");
        try {
            const response = await nodefetch("https://some-random-api.ml/img/birb");
            const body = await response.json();
            sent.edit(body.link);
        } catch (e) {
            console.log(e);
        };
    }
};