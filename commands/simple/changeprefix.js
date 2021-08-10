// Dependencies & variables

const Discord = require("discord.js");
const SendSuccessMessage = require("../../utils/SendSuccessMessage");
const SendErrorMessage = require("../../utils/SendErrorMessage");

// Dependencies & variables end

module.exports = {
    name: "prefix",
    description: "Prefix info.",
    category: "Simple",
    usage: "prefix (optional: new prefix)",
    cooldown: 1,
    aliases: ["changeprefix"],
    async execute(client, message, args) {
        const Guild = client.models.get("Guild");
        if (!args[0]) {
            let preembed = new Discord.MessageEmbed()
                .setThumbnail(message.guild.iconURL())
                .setDescription(
                    `Current prefix for this guild is ${client.curprefix}`
                );
            return message.channel.send({ embeds: [preembed] });
        } else {
            let new_prefix = args[0];
            if (new_prefix === "") {
                return SendErrorMessage("Can't set prefix to nothing!");
            }
            await Guild.findOne(
                { guild_id: message.guild.id },
                "prefix",
                async (err, guild) => {
                    if (err) {
                        console.log(err);
                        return SendErrorMessage(
                            message,
                            "Something went wrong while changing the prefix. Please try again."
                        );
                    }

                    guild.prefix = new_prefix;
                    await guild.save();
                    console.log("new prefix");
                    if (guild.prefix === new_prefix) {
                        SendSuccessMessage(
                            message,
                            'Command prefix is now "' + args[0] + '"'
                        );
                    }
                }
            );
        }
    },
};
