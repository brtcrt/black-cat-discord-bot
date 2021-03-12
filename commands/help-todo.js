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
    name: "helptodo",
    description: "",
    cooldown: 1,
    aliases: ["todohelp"],
    async execute(message, args){
        let curprefix = prefixes[message.guild.id].prefix;
        var randomlink = links.link[Math.floor(Math.random() * links.link.length)];
        let helpmessage = new Discord.MessageEmbed()
        .setThumbnail(randomlink.name)
        .setTitle("Usage of " + curprefix+"todo")
        .setColor("RANDOM")
        .addField(curprefix+"todo", "Shows your current todo list", false)
        .addField(curprefix+"todo add ...", "Adds ... to your todo list (Adds to the last place) eg. =todo add Something important", false)
        .addField(curprefix+"todo remove (N)", "Removes the Nᵗʰ item from your list. eg =todo remove 3", false)
        .addField(curprefix+"todo change (N) ...", "Changes the Nᵗʰ item to ... eg. =todo change 5 Something even more important", false);
        message.channel.send(helpmessage);
    }
};