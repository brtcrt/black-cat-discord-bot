// Dependencies & variables

const Discord = require("discord.js");

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
};

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
    name: "gay",
    description: "gay",
    cooldown: 1,
    aliases: ["rainbow"],
    async execute(message, args){
        let currentlygay = {
    
        };
        if(!currentlygay[message.guild.id]) {
            currentlygay[message.guild.id] = {
                status: false
            };
        };
        if(currentlygay[message.guild.id].status) return SendErrorMessage(message, "You must wait for the current gay to end.");
        currentlygay[message.guild.id].status = true;
        let nim = 0
        let someEmbed = {
            title: "gay",
            description: "gay",
            color: []
        };
        someEmbed.color[0] = 255;
        someEmbed.color[1] = 255;
        someEmbed.color[2] = 255;
        let sentEmbed = await message.channel.send({ embed: someEmbed});
        async function changeColor(embed, sentmessage) {
            embed.color[0] = Math.floor(Math.random()*255);
            embed.color[1] = Math.floor(Math.random()*255);
            embed.color[2] = Math.floor(Math.random()*255);
            await sentmessage.edit({embed: embed});
        }
        while (nim < 100) {
            await changeColor(someEmbed, sentEmbed);
            await sleep(1000);
            await nim++;
        }
        currentlygay[message.guild.id].status = false;
    }
};