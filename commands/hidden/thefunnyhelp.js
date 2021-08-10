// Dependencies & variables

const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const embedPagination = require("../../utils/embedPaginator");
const links = require(path.join(__dirname, "../../") + "/storage/links.json");
const { embeds } = require(path.join(__dirname, "../../") +
    "/storage/funny_help_commands.json");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "egeaglar",
    description: "This message you idiot.",
    category: "31",
    usage: "egeaglar",
    cooldown: 1,
    aliases: [
        "endüstrileydevrimvesonuçları",
        "endustriyeldevrimvesonuclari",
        "bennezamancumblast",
    ],
    async execute(client, message, args) {
        const guild_model = client.models.get("Guild");
        const curr_guild = await guild_model.findOne({
            guild_id: message.guild.id,
        });
        const curr_prefix = curr_guild.prefix;

        let embeds = [];

        let command_embed = {
            title: `HIDDEN`.toUpperCase(),
            fields: [],
            footer: {
                text: "",
            },
            color: "RANDOM",
            thumbnail: {
                url: "",
            },
        };

        const commandFiles = fs
            .readdirSync(path.join(__dirname, "../hidden"))
            .filter((file) => file.endsWith(".js"));

        for (const file of commandFiles) {
            const command = require(path.join(__dirname, `../hidden/${file}`));
            command_embed.fields.push({
                name: `${curr_prefix}${command.name}`,
                value: `Description: ${command.description}\nCategory: ${
                    command.category
                }\nAliases: ${command.aliases.join(", ")}\nUsage: ${
                    command.usage
                }`,
                inline: false,
            });
        }
        embeds.push(command_embed);
        /* 
        Categories:
        - Nhentai
        - Rule 34
        - Test
        - Catgirl
        - 31
        */
        embeds.reverse();
        for (i = 0; i < embeds.length; i++) {
            embeds[i].thumbnail.url =
                links.link[Math.floor(Math.random() * links.link.length)].name;
        }
        embedPagination(message, embeds, false).catch((err) =>
            SendErrorMessage(message, err)
        );
    },
};
