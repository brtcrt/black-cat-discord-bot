// Dependencies & variables

const Discord = require("discord.js");
const path = require("path");
let reminder  = require(path.join(__dirname, "../")+"/database/reminders.json");
let prefixes = require(path.join(__dirname, "../")+"/database/prefixes.json");
const fs = require("fs")

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
    name: "setreminder",
    description: "",
    cooldown: 1,
    aliases: ["remindme"],
    async execute(message, args){
        let allreminders = "allreminders";
        let curprefix = prefixes[message.guild.id].prefix;
        if (!args[0] || !args[1] || !args[2]|| !args[3]) return SendErrorMessage(message, `Use ${curprefix}helpsetreminder if you need any help.`);
        if (!reminder[allreminders] && !message.author.bot){
            let data = {
                Date: args[0]+" "+ (parseInt(args[1])-1).toString() + " " + args[2],
                Time: args[3]
            };
            reminder[allreminders]=[

            ];
            reminder[allreminders].push(message.author.id + " " + message.channel.id);
            reminder[allreminders].push(data);
            message.reply("Reminder set for " + args[3] + " on " + args[0]+" "+ args[1] + " " + args[2]);
            return;
        }
        let userIndex = reminder[allreminders].indexOf(message.author.id + " " + message.channel.id);
        if (reminder[allreminders][userIndex] != message.author.id + " " + message.channel.id && !message.author.bot){
            let data = {
                Date: args[0]+" "+ (parseInt(args[1])-1).toString() + " " + args[2],
                Time: args[3]
            };
            reminder[allreminders].push(message.author.id + " " + message.channel.id);
            reminder[allreminders].push(data);
            message.reply("Reminder set for " + args[3] + " on " + args[0]+" "+ args[1] + " " + args[2]);
        } else{
            reminder[allreminders][userIndex+1].Date = args[0]+" "+ (parseInt(args[1])-1).toString() + " " + args[2];
            reminder[allreminders][userIndex+1].Time = args[3];
            message.reply("Reminder changed. Current reminder is set for " + args[3] + " on " + args[0]+" "+ args[1] + " " + args[2]);
        };
        fs.writeFile(path.join(__dirname, "../")+"/database/reminders.json", JSON.stringify(reminder, null, 4), (err)=>{
            if(err) console.log(err);
        });
    }
};