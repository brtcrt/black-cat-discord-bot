// Dependencies & variables

const Discord = require("discord.js");
const path = require("path");
const nodefetch = require("node-fetch");
let { tenortoken } = require(path.join(__dirname, "../")+"/config.json")

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
    name: "gifsearch",
    description: "Search for gifs.",
    cooldown: 1,
    aliases: ["search"],
    async execute(message, args){
        let limit;
        if(Number.isInteger(parseInt(args[args.length-1]))) {
            limit = args.pop();
        };
        let sent = await message.channel.send(`Searching for "${args.join(" ")}"...`);
        try {
            if(!limit) limit = 25;
            const response = await nodefetch('https://g.tenor.com/v1/search?q=' + encodeURIComponent(args.join(" "))  + "&key=" + tenortoken + "&limit="+limit.toString());
            const body = await response.json();
            if (!body.results[0]) return SendErrorMessage(message, "Couldn't find any results :(");
            let randnumb = Math.floor( Math.random() * body.results.length);
            sent.edit(body.results[randnumb].itemurl);
        } catch (e) {
            console.log(e);
        };
    }
};