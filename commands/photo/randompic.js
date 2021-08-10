// Dependencies & variables

const Discord = require("discord.js");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "randompic",
    description: "Get a random picture.",
    category: "Photo/GIF",
    usage: "randompic",
    cooldown: 2,
    aliases: ["randompicture"],
    async execute(client, message, args) {
        let sentMessage = await message.channel.send("Getting random pic...");
        let randomimgLink =
            "https://picsum.photos/" +
            Math.floor(Math.random() * 3000).toString();
        await sentMessage.edit(randomimgLink);
    },
};
