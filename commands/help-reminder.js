// Dependencies & variables

const Discord = require("discord.js");
const path = require("path");
let links  = require(path.join(__dirname, "../")+"/storage/links.json");
let prefixes = require(path.join(__dirname, "../")+"/database/prefixes.json");

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
    name: "helpsetreminder",
    description: "",
    cooldown: 1,
    aliases: ["helpremindme"],
    async execute(message, args){
        let curprefix = prefixes[message.guild.id].prefix;
        var randomlink = links.link[Math.floor(Math.random() * links.link.length)];
        let helpmessage = new Discord.MessageEmbed()
        .setThumbnail(randomlink.name)
        .setTitle("Usage of " + curprefix+"setreminder")
        .setColor("RANDOM")
        .addField(curprefix+"setreminder (Day) (Month) (Year) (Hour):(Minute)", "usage", false)
        .addField(curprefix+"Day", "The day for the reminder. eg. 1,5,15,31 *Note: 01,02,03 etc. won't work*", false)
        .addField(curprefix+"Month", "The month for the reminder eg. 1,3,6,9,11,12 *Note: 01,02,03 etc. won't work*", false)
        .addField(curprefix+"Year", "The year for the reminder eg. 2023,2031,2069,2420", false)
        .addField(curprefix+"Hour", "The hour for the reminder eg. 0,1,7,14,23 *Note: 24,01,02,03 etc. won't work*", false)
        .addField(curprefix+"Minute", "The minute for the reminder eg. 0,1,31,50,59 *Note: 60,01,02,03 etc. won't work*", false);
        message.channel.send(helpmessage);
    }
};