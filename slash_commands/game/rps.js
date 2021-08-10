// Dependencies & variables

const Discord = require("discord.js");

// Dependencies & variables end

// Error Message Template

// Error Message Template

function rps(choice, interaction) {
    let rpsList = ["Rock", "Paper", "Scissors"];
    var item = rpsList[Math.floor(Math.random() * rpsList.length)];
    let LostrpsMessage = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setDescription("Cry about it!")
        .setTitle("You lost!")
        .addField("I chose:", item, true)
        .addField("You chose:", choice, true);
    let WonrpsMessage = new Discord.MessageEmbed()
        .setColor("PURPLE")
        .setTitle("You Won.")
        .addField("I chose:", item, true)
        .addField("You chose:", choice, true);
    let DrawrpsMessage = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Draw...")
        .addField("I chose:", item, true)
        .addField("You chose:", choice, true);
    if (choice == "Rock" && item == "Rock")
        return interaction.reply({ embeds: [DrawrpsMessage] });
    if (choice == "Paper" && item == "Rock")
        return interaction.reply({ embeds: [WonrpsMessage] });
    if (choice == "Scissors" && item == "Rock")
        return interaction.reply({ embeds: [LostrpsMessage] });
    if (choice == "Paper" && item == "Paper")
        return interaction.reply({ embeds: [DrawrpsMessage] });
    if (choice == "Scissors" && item == "Paper")
        return interaction.reply({ embeds: [WonrpsMessage] });
    if (choice == "Rock" && item == "Paper")
        return interaction.reply({ embeds: [LostrpsMessage] });
    if (choice == "Scissors" && item == "Scissors")
        return interaction.reply({ embeds: [DrawrpsMessage] });
    if (choice == "Rock" && item == "Scissors")
        return interaction.reply({ embeds: [WonrpsMessage] });
    if (choice == "Paper" && item == "Scissors")
        return interaction.reply({ embeds: [LostrpsMessage] });
}

module.exports = {
    name: "rps",
    description: "Play a game of Rock Paper Scissors agains me.",
    options: [
        {
            name: "choice",
            type: "STRING",
            description: "Rock, paper, scissors",
            required: true,
            choices: [
                {
                    name: "rock",
                    value: "Rock",
                },
                {
                    name: "paper",
                    value: "Paper",
                },
                {
                    name: "scissors",
                    value: "Scissors",
                },
            ],
        },
    ],
    category: "Game",
    usage: "rps [obligatory: rock, paper, scissors]",
    cooldown: 1,
    aliases: ["rockpaperscissors"],
    async execute(client, interaction) {
        const choice = interaction.options.getString("choice");
        rps(choice, interaction);
    },
};
