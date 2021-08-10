// Dependencies & variables

const Discord = require("discord.js");
const SendSuccessMessage = require("../../utils/SendSuccessMessage");
const SendErrorMessage = require("../../utils/SendErrorMessage");

// Dependencies & variables end

module.exports = {
    name: "cemalroulette",
    description: "Cumal",
    category: "Catgirl",
    usage: "cemalroulette",
    cooldown: 1,
    aliases: ["cumalroulette"],
    async execute(client, message, args) {
        if (message.guild.id !== "326713794279505921") return;
        message.reply(
            `${Math.floor(Math.random() * 24)} hours, ${
                Math.floor(Math.random() * 59) + 1
            } minutes, ${Math.floor(Math.random() * 59) + 1} seconds.`
        );
        return;
    },
};
