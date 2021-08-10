// Dependencies & variables

const Discord = require("discord.js");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

function rps(choice, message) {
    userChoice = choice.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
        letter.toUpperCase()
    );
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
    if (userChoice == "Rock" && item == "Rock")
        return message.channel.send({ embeds: [DrawrpsMessage] });
    if (userChoice == "Paper" && item == "Rock")
        return message.channel.send({ embeds: [WonrpsMessage] });
    if (userChoice == "Scissors" && item == "Rock")
        return message.channel.send({ embeds: [LostrpsMessage] });
    if (userChoice == "Paper" && item == "Paper")
        return message.channel.send({ embeds: [DrawrpsMessage] });
    if (userChoice == "Scissors" && item == "Paper")
        return message.channel.send({ embeds: [WonrpsMessage] });
    if (userChoice == "Rock" && item == "Paper")
        return message.channel.send({ embeds: [LostrpsMessage] });
    if (userChoice == "Scissors" && item == "Scissors")
        return message.channel.send({ embeds: [DrawrpsMessage] });
    if (userChoice == "Rock" && item == "Scissors")
        return message.channel.send({ embeds: [WonrpsMessage] });
    if (userChoice == "Paper" && item == "Scissors")
        return message.channel.send({ embeds: [LostrpsMessage] });
}

module.exports = {
    name: "rps",
    description: "Play a game of Rock Paper Scissors agains me.",
    options: [
        {
            name: "Choice",
            type: "STRING",
            description: "Rock, paper, scissors",
            required: false,
            choices: [
                {
                    name: "Rock",
                    value: "Rock",
                },
                {
                    name: "Paper",
                    value: "Paper",
                },
                {
                    name: "Scissors",
                    value: "Scissors",
                },
            ],
        },
    ],
    category: "Game",
    usage: "rps [obligatory: rock, paper, scissors]",
    cooldown: 1,
    aliases: ["rockpaperscissors"],
    async execute(client, message, args) {
        if (!args[0] || args[0] == "")
            return SendErrorMessage(message, "You didn't choose!");
        rps(args[0], message);
    },
};
