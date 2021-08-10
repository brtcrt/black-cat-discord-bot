// Dependencies & variables

const Discord = require("discord.js");
const uwuify = require("../../utils/uwuify");
const generatemarkov = require("../../utils/generatemarkov");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "markovgenerate",
    category: "Other",
    description: "Generates a message based on previous messages in a channel.",
    usage: "markovgenerate (must have at least 100 message in the channel)",
    cooldown: 2,
    aliases: ["markovchain", "markov"],
    async execute(client, message, args) {
        message.channel.send(uwuify(await generatemarkov(message)));
    },
};
