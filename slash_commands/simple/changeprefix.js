// Dependencies & variables

const Discord = require("discord.js");
const SendSuccessMessage = require("../../utils/slash_SuccessMessage");
const SendErrorMessage = require("../../utils/slash_ErrorMessage");

// Dependencies & variables end

module.exports = {
    name: "prefix",
    description: "Prefix info.",
    options: [
        {
            name: "prefix",
            type: "STRING",
            description: "Sets a new prefix.",
            required: false,
        },
    ],
    category: "Simple",
    usage: "prefix (optional: new prefix)",
    cooldown: 1,
    aliases: ["changeprefix"],
    async execute(client, interaction) {
        const new_prefix = interaction.options.getString("prefix");
        const Guild = client.models.get("Guild");
        await interaction.deferReply();
        if (!new_prefix) {
            let preembed = new Discord.MessageEmbed()
                .setThumbnail(interaction.guild.iconURL())
                .setDescription(
                    `Current prefix for this guild is ${client.curprefix}`
                );
            return interaction.editReply({ embeds: [preembed] });
        } else {
            if (new_prefix === "") {
                return interaction.editReply({
                    embeds: [
                        {
                            title: "Uh oh! Something went wrong!",
                            color: "RED",
                            description: "Can't set prefix to nothing!",
                        },
                    ],
                });
            }
            await Guild.findOne(
                { guild_id: interaction.guild.id },
                "prefix",
                async (err, guild) => {
                    if (err) {
                        console.log(err);
                        return interaction.editReply({
                            embeds: [
                                {
                                    title: "Uh oh! Something went wrong!",
                                    color: "RED",
                                    description:
                                        "An error occurred while trying to set a new prefix.",
                                },
                            ],
                        });
                    }

                    guild.prefix = new_prefix;
                    await guild.save();
                    console.log("new prefix");
                    if (guild.prefix === new_prefix) {
                        interaction.editReply({
                            embeds: [
                                {
                                    title: "Success!",
                                    color: "#09ff01",
                                    description: `Set prefix to ${new_prefix}`,
                                },
                            ],
                        });
                    }
                }
            );
        }
    },
};
