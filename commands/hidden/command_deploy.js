// Dependencies & variables

const Discord = require("discord.js");
const SendSuccessMessage = require("../../utils/SendSuccessMessage");
const SendErrorMessage = require("../../utils/SendErrorMessage");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const token = process.env.TOKEN;

// Dependencies & variables end

module.exports = {
    name: "deploy",
    description: "Deploys / commands",
    category: "gay",
    usage: "deploy",
    cooldown: 1,
    aliases: ["deploycommands"],
    async execute(client, message, args) {
        if (!client.application?.owner) await client.application?.fetch();
        if (message.author.id === client.application?.owner.id) {
            const data = client.slash_commands.map(({ execute, ...data }) => {
                delete data.cooldown;
                delete data.aliases;
                delete data.category;
                delete data.usage;
                return data;
            });
            console.log(data);

            const command = await client.guilds.cache
                .get(message.guild.id)
                ?.commands.set(data);
            console.log(command);
        }
    },
};
