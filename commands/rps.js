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

function rps(message){
    let userChoice = message.content.slice(1);
    userChoice = userChoice.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    let rpsList = ["Rock", "Paper", "Scissors"];
    var item = rpsList[Math.floor(Math.random() * rpsList.length)];
    let LostrpsMessage = new Discord.MessageEmbed()
    .setColor("BLUE")
    .setDescription("Cry about it!")
    .setTitle("You lost!")
    .addField("I chose:", item, true)
    .addField("You chose:", userChoice, true);
    let WonrpsMessage = new Discord.MessageEmbed()
    .setColor("PURPLE")
    .setTitle("You Won.")
    .addField("I chose:", item, true)
    .addField("You chose:", userChoice, true);
    let DrawrpsMessage = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTitle("Draw...")
    .addField("I chose:", item, true)
    .addField("You chose:", userChoice, true);
    if(userChoice == "Rock" && item == "Rock") return message.channel.send(DrawrpsMessage);
    if(userChoice == "Paper" && item == "Rock") return message.channel.send(WonrpsMessage);
    if(userChoice == "Scissors" && item == "Rock") return message.channel.send(LostrpsMessage);
    if(userChoice == "Paper" && item == "Paper") return message.channel.send(DrawrpsMessage);
    if(userChoice == "Scissors" && item == "Paper") return message.channel.send(WonrpsMessage);
    if(userChoice == "Rock" && item == "Paper") return message.channel.send(LostrpsMessage);
    if(userChoice == "Scissors" && item == "Scissors") return message.channel.send(DrawrpsMessage);
    if(userChoice == "Rock" && item == "Scissors") return message.channel.send(WonrpsMessage);
    if(userChoice == "Paper" && item == "Scissors") return message.channel.send(LostrpsMessage);
};

module.exports = {
    name: "rock",
    description: "",
    cooldown: 1,
    aliases: ["paper","scissors"],
    async execute(message, args){
        rps(message);
    }
};