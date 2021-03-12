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
    name: "randompic",
    description: "Get a random picture.",
    cooldown: 2,
    aliases: [],
    async execute(message, args){
        let sentMessage = await message.channel.send("Getting random pic...");
        let randomimgLink = "https://picsum.photos/"+ (Math.floor(Math.random() * 3000).toString());
        await sentMessage.edit(randomimgLink);
    }
};