// Dependencies & variables

const Discord = require("discord.js");
const SendSuccessMessage = require("../../utils/SendSuccessMessage");
const SendErrorMessage = require("../../utils/SendErrorMessage");

// Dependencies & variables end

module.exports = {
    name: "config",
    description: "Change the settings.",
    category: "Other",
    usage: "config to see options. config (option) (true/false)",
    cooldown: 1,
    aliases: ["settings"],
    async execute(client, message, args) {
        const Guild = client.models.get("Guild");
        let curr_guild = await Guild.findOne({ guild_id: message.guild.id });
        if (!args[0] || args[0] === "") {
            const config_message = {
                title: `Configure Bläck Cät for ${message.guild.name}`,
                description: `To change a setting use ${
                    client.curprefix
                }config (name). eg: ${client.curprefix}config ${
                    Object.keys(client.config)[0]
                }`,
                thumbnail: {
                    url: message.guild.iconURL(),
                },
                fields: [],
                color: "RANDOM",
            };
            for (let key_name of Object.keys(client.config)) {
                config_message.fields.push({
                    name: key_name,
                    value: `Type: ${client.config[key_name].type.name}\nDefault: ${client.config[key_name].default}\nCurrent: ${curr_guild.config[key_name]}`,
                });
            }
            message.channel.send({ embeds: [config_message] });
        } else if (
            Object.keys(client.config).some((key_name) => key_name === args[0]) // if valid config
        ) {
            if (!args[1]) {
                return SendErrorMessage(message, "No args given.");
            }
            if (client.config[args[0]].type.name === "Boolean") {
                curr_guild.config[args[0]] =
                    args[1].toLowerCase() === "true" ? true : false;
                args[1] = args[1].toLowerCase() === "true" ? true : false;
            } else {
                curr_guild.config[args[0]] = args[1];
            }
            await curr_guild.save();
            return SendSuccessMessage(message, `Set ${args[0]} to ${args[1]}`);
        }
    },
};
