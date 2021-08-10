// Dependencies & variables

const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const embedPagination = require("../../utils/embedPaginator");
const links = require(path.join(__dirname, "../../") + "/storage/links.json");
// const { embeds } = require(path.join(__dirname, "../../") +
//     "/storage/help_commands.json");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "bot?",
    description: "Shows this message you idiot.",
    category: "Simple",
    usage: "bot?",
    cooldown: 1,
    aliases: ["help", "commands", "bot", "bot???", "usage"],
    async execute(client, message, args) {
        const guild_model = client.models.get("Guild");
        const curr_guild = await guild_model.findOne({
            guild_id: message.guild.id,
        });
        const curr_prefix = curr_guild.prefix;

        let embeds = [];
        const commandFolders = fs.readdirSync(
            path.join(__dirname, "../../commands")
        );

        for (const folder of commandFolders) {
            if (folder !== "hidden") {
                const commandFiles = fs
                    .readdirSync(
                        path.join(__dirname, `../../commands/${folder}`)
                    )
                    .filter((file) => file.endsWith(".js"));
                let command_embed = {
                    title: `${folder}`.toUpperCase(),
                    fields: [],
                    footer: {
                        text: "",
                    },
                    color: "RANDOM",
                    thumbnail: {
                        url: "",
                    },
                };
                for (const file of commandFiles) {
                    const command = require(path.join(
                        __dirname,
                        `../../commands/${folder}/${file}`
                    ));

                    command_embed.fields.push({
                        name: `${curr_prefix}${command.name}`,
                        value: `Description: ${
                            command.description
                        }\nAliases: ${command.aliases.join(", ")}\nUsage: ${
                            command.usage
                        }`,
                        inline: false,
                    });
                }
                embeds.push(command_embed);
            }
        }
        /* 
        Categories:
        - Simple
        - Music
        - Photo/GIF
        - Other
        */
        embeds.reverse();

        for (i = 0; i < embeds.length; i++) {
            embeds[i].thumbnail.url =
                links.link[Math.floor(Math.random() * links.link.length)].name;
            embeds[i].footer.text = `Page ${i + 1} of ${embeds.length} pages.`;
        }
        embedPagination(message, embeds, false).catch((err) =>
            SendErrorMessage(message, err)
        );
    },
};
