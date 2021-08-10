// Dependencies & variables

const Discord = require("discord.js");
const path = require("path");
const nodefetch = require("node-fetch");
//let { giphytoken } = require(path.join(__dirname, "../")+"/config.json")
const giphytoken = process.env.GIPHYTOKEN;

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "gif",
    description: "Get a random gif.",
    category: "Photo/GIF",
    usage: "gif",
    cooldown: 1,
    aliases: ["randomgif"],
    async execute(client, interaction) {
        await interaction.deferReply();
        try {
            const response = await nodefetch(
                `https://api.giphy.com/v1/gifs/random?api_key=${giphytoken}&rating=g`
            );
            const body = await response.json();
            interaction.editReply(body.data.url);
        } catch (e) {
            console.log(e);
        }
    },
};
