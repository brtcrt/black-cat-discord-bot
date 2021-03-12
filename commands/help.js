// Dependencies & variables

const { MessageEmbed } = require("discord.js");
const Pagination = require("discord-paginationembed");
const path = require("path");
let links  = require(path.join(__dirname, "../")+"/storage/links.json");
let helpcommand = require(path.join(__dirname, "../")+ "/storage/help_commands.json");
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
    name: "bot?",
    description: "",
    cooldown: 1,
    aliases: ["help", "commands", "bot", "bot???"],
    async execute(message, args){
        let curprefix = prefixes[message.guild.id].prefix;
        if(!message.guild.me.hasPermission("MANAGE_MESSAGES")) return SendErrorMessage(message, "I don't have the permission to do that! (Permission req. --> MANAGE_MESSAGES.)")
        var randomlink = links.link[Math.floor(Math.random() * links.link.length)];
        const randomColor = () => {
            let color = '#';
            for (let i = 0; i < 6; i++){
               const random = Math.random();
               const bit = (random * 16) | 0;
               color += (bit).toString(16);
            };
            return color;
        };
        let help = new Pagination.Embeds()
        .setArray(helpcommand.embeds)
        .setThumbnail(randomlink.name)
        .setAuthorizedUsers([message.author.id])
        .setChannel(message.channel)
        .setFooter("Current command prefix for this server is " + curprefix)
        .setColor(randomColor());
        help.build().catch(error => console.log(error));
    }
};