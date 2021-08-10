// Dependencies & variables

const Discord = require("discord.js");
const path = require("path");
const nodefetch = require("node-fetch");
//let { tenortoken } = require(path.join(__dirname, "../")+"/config.json")
const tenortoken = process.env.TENORTOKEN;

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "gifsearch",
    description: "Search for gifs.",
    category: "Photo/GIF",
    usage: "gifsearch",
    cooldown: 1,
    aliases: ["search"],
    async execute(client, message, args) {
        let limit;
        if (Number.isInteger(parseInt(args[args.length - 1]))) {
            limit = args.pop();
        }
        let sent = await message.channel.send(
            `Searching for "${args.join(" ")}"...`
        );
        if (!limit) {
            try {
                limit = 25;
                const response = await nodefetch(
                    `https://g.tenor.com/v1/search?q=${encodeURIComponent(
                        args.join(" ")
                    )}&key=${tenortoken}&limit=${limit.toString()}&contentfilter=high`
                );
                const body = await response.json();
                if (!body.results[0])
                    return SendErrorMessage(
                        message,
                        "Couldn't find any results :("
                    );

                let randnumb = Math.floor(Math.random() * body.results.length);
                sent.edit(body.results[randnumb].itemurl);
            } catch (e) {
                console.log(e);
            }
        } else {
            try {
                const response = await nodefetch(
                    `https://g.tenor.com/v1/search?q=${encodeURIComponent(
                        args.join(" ")
                    )}&key=${tenortoken}&limit=${limit.toString()}&contentfilter=high`
                );
                const body = await response.json();
                if (!body.results[0])
                    return SendErrorMessage(
                        message,
                        "Couldn't find any results :("
                    );
                sent.edit(body.results[parseInt(limit) - 1].itemurl);
            } catch (e) {
                console.log(e);
            }
        }
    },
};
