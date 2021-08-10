// Dependencies & variables

const Discord = require("discord.js");
const uwuify = require("../../utils/uwuify");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "uwuify",
    description: "UwU OwO",
    usage: "uwuify (text)",
    category: "Other",
    cooldown: 1,
    aliases: [],
    async execute(client, message, args) {
        message.reply(uwuify(args.join(" ")));
    },
};
