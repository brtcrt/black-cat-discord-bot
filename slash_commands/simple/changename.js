// Dependencies & variables

const Discord = require("discord.js");
const SendSuccessMessage = require("../../utils/slash_SuccessMessage");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/slash_ErrorMessage");

// Error Message Template

module.exports = {
    name: "changename",
    description: "Change nicknames.",
    options: [
        {
            name: "name",
            type: "STRING",
            description: "New nickname for the user.",
            required: true,
        },
        {
            name: "user",
            type: "USER",
            description: "User to change the nickname of.",
            required: true,
        },
    ],
    category: "Simple",
    usage: "changename (optional: @user) [obligatory: new name]",
    cooldown: 1,
    aliases: ["namechange", "changenick"],
    async execute(client, interaction) {
        const name = interaction.options.getString("name");
        const target = interaction.options.getUser("user");
        let theGuy = interaction.guild.members.cache.get(target.id);
        const old_name = target.username;
        if (
            !interaction.guild.me.permissions.has(
                Discord.Permissions.FLAGS.MANAGE_NICKNAMES
            )
        )
            return SendErrorMessage(
                interaction,
                "I don't have permission to change your nickname!"
            );
        if (theGuy.id === interaction.guild.ownderId)
            return SendErrorMessage(
                interaction,
                "I can't change the name of the owner!"
            );
        if (name.length > 32)
            return SendErrorMessage(
                interaction,
                "Nickname can't be longer than 32 characters."
            );
        await theGuy
            .setNickname(name)
            .catch((err) => SendErrorMessage(interaction, err));
        SendSuccessMessage(
            interaction,
            `Set ${old_name}'s nickname to ${name}`
        );
    },
};
