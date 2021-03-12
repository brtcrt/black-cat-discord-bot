// Dependencies & variables

const Discord = require("discord.js");
const path = require("path");
let prefixes  = require(path.join(__dirname, "../")+"/database/prefixes.json");
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

function SendSuccessMessage(message, success){
    if(!success) success = "Successfuly executed the command!";
    let generalsuccessmessage = new Discord.MessageEmbed()
    .setTitle("Success!")
    .setColor("#09ff01")
    .setDescription(success.toString());
    message.channel.send(generalsuccessmessage);
    };

// Error Message Template

module.exports = {
    name: "prefix",
    description: "",
    cooldown: 1,
    aliases: ["changeprefix"],
    async execute(message, args){
        let curprefix = prefixes[message.guild.id].prefix;
        console.log(args);
        if(!args[0]) {
            let preembed = new Discord.MessageEmbed()
            .setThumbnail(message.guild.iconURL())
            .setDescription(`Current prefix for this guild is ${curprefix}`)
            return message.channel.send({embed: preembed})
        } else {
            prefixes[message.guild.id].prefix = args[0]
            fs.writeFile(path.join(__dirname, "../")+"/database/prefixes.json", JSON.stringify(prefixes, null, 4), (err)=>{
                if(err) console.log(err)
            });
            if(prefixes[message.guild.id].prefix == args[0]){
                SendSuccessMessage(message, 'Command prefix is now "' + args[0]+'"')//message.reply('Command prefix is now "' + newprefix[1]+'"')
            } else SendErrorMessage(message, "Something went wrong while changing the prefix. Please try again.")
        }
    }
};