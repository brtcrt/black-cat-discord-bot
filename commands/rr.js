// Dependencies & variables

const Discord = require("discord.js");
const path = require("path");
let rrstreak  = require(path.join(__dirname, "../")+"/database/rrStreaks.json");
const fs = require("fs");

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
    name: "russianroulette",
    description: "",
    cooldown: 1,
    aliases: ["rr"],
    async execute(message, args){
        //if(!message.guild.me.hasPermission("ADMINISTRATOR")) return SendErrorMessage(message, "I need to have administrator to run this command!");
        if(!message.guild.me.hasPermission("MANAGE_MESSAGES")) return SendErrorMessage(message, "I need to have MANAGE_MESSAGES to run this command!");
        if(!message.guild.me.hasPermission("KICK_MEMBERS")) return SendErrorMessage(message, "I need to have KICK_MEMBERS to run this command!");
        let number = Math.floor( Math.random() * 5 + 1);
        let number2 = Math.floor(Math.random() * 5 + 1);
        if(!rrstreak[message.author.id]) {
            rrstreak[message.author.id] = {
                winstreak: 0,
                losestreak: 0,
                longestwin: 0,
                longestloss: 0
            };
        };
        if (number === number2){
            rrstreak[message.author.id].losestreak += 1;
            if(rrstreak[message.author.id].losestreak > rrstreak[message.author.id].longestloss){
                rrstreak[message.author.id].longestloss = rrstreak[message.author.id].losestreak;
            };
            rrstreak[message.author.id].winstreak = 0;
            let loseStreak = rrstreak[message.author.id].losestreak.toString();
            let longestLoseStreak = rrstreak[message.author.id].longestloss.toString();
            let longestWinStreak = rrstreak[message.author.id].longestwin.toString();
            let deathMessage = new Discord.MessageEmbed()
            .setTitle("Pow!")
            .setColor("RANDOM")
            .setFooter("Current lose streak: " + loseStreak + "\n Longest lose streak: " + longestLoseStreak + "\n Longest win streak: " + longestWinStreak)
            .setDescription("You died :(");
            message.channel.send(deathMessage);
            if(!message.guild.me.hasPermission("KICK_MEMBERS")) return SendErrorMessage(message, "I don't have the permission to kick members!")
            if(message.member.id != message.guild.ownerID){
                try {
                    message.member.kick();
                } catch (err) {
                    console.log(err);
                    message.channel.send(`An error occured while trying to kick **${message.author.username}**`);
                };
            } else return SendErrorMessage(message, `An error occured while trying to kick **${message.author.username}**`);
        } else{
            rrstreak[message.author.id].losestreak = 0;
            rrstreak[message.author.id].winstreak += 1;
            if(rrstreak[message.author.id].winstreak > rrstreak[message.author.id].longestwin){
                rrstreak[message.author.id].longestwin = rrstreak[message.author.id].winstreak;
            };
            let winStreak = rrstreak[message.author.id].winstreak.toString();
            let longestLoseStreak = rrstreak[message.author.id].longestloss.toString();
            let longestWinStreak = rrstreak[message.author.id].longestwin.toString();
            let liveMessage = new Discord.MessageEmbed()
            .setTitle("Click")
            .setColor("RANDOM")
            .setFooter("Current win streak: "+ winStreak + "\n Longest lose streak: " + longestLoseStreak + "\n Longest win streak: " + longestWinStreak)
            .setDescription("You are still alive. For now...");
            message.channel.send(liveMessage);
        };
        fs.writeFile(path.join(__dirname, "../")+"/database/rrStreaks.json", JSON.stringify(rrstreak, null, 4), (err)=>{
            if(err) console.log(err);
        });
    }
};