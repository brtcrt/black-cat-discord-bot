// Dependencies & variables

const Discord = require("discord.js");
const path = require("path");
const nodefetch = require("node-fetch");
//let { tenortoken } = require(path.join(__dirname, "../")+"/config.json")
const tenortoken = process.env.TENORTOKEN;

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/slash_ErrorMessage");

// Error Message Template

module.exports = {
    name: "gifsearch",
    description: "Search for gifs.",
    options: [
        {
            name: "term",
            type: "STRING",
            description: "gif search term.",
            required: true,
        },
        {
            name: "limit",
            type: "NUMBER",
            description: "Gives the nth result from a list of gifs.",
            required: false,
        },
    ],
    category: "Photo/GIF",
    usage: "gifsearch",
    cooldown: 1,
    aliases: ["search"],
    async execute(client, interaction) {
        await interaction.deferReply();
        const term = interaction.options.getString("term");
        let limit = interaction.options.getNumber("limit");
        if (!limit) {
            try {
                limit = 25;
                const response = await nodefetch(
                    `https://g.tenor.com/v1/search?q=${encodeURIComponent(
                        term
                    )}&key=${tenortoken}&limit=${limit.toString()}&contentfilter=high`
                );
                const body = await response.json();
                if (!body.results[0])
                    return SendErrorMessage(
                        interaction,
                        "Couldn't find any results :("
                    );

                let randnumb = Math.floor(Math.random() * body.results.length);
                interaction.editReply(body.results[randnumb].itemurl);
            } catch (e) {
                console.log(e);
            }
        } else {
            try {
                const response = await nodefetch(
                    `https://g.tenor.com/v1/search?q=${encodeURIComponent(
                        term
                    )}&key=${tenortoken}&limit=${limit.toString()}&contentfilter=high`
                );
                const body = await response.json();
                if (!body.results[0])
                    return SendErrorMessage(
                        interaction,
                        "Couldn't find any results :("
                    );
                interaction.editReply(
                    body.results[parseInt(limit) - 1].itemurl
                );
            } catch (e) {
                console.log(e);
            }
        }
    },
};
