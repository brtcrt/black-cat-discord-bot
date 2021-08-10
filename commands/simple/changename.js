// Dependencies & variables

const Discord = require("discord.js");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "changename",
    description: "Change nicknames.",
    category: "Simple",
    usage: "changename (optional: @user) [obligatory: new name]",
    cooldown: 1,
    aliases: ["namechange", "changenick"],
    async execute(client, message, args) {
        args = args.slice(1);
        let theGuy = message.mentions.members.first();
        if (!theGuy) return SendErrorMessage(message, "You didn't @ a person!");
        if (!args)
            return SendErrorMessage(
                message,
                "You didn't give a new nickname for the person!"
            );
        if (
            !message.guild.me.permissions.has(
                Discord.Permissions.FLAGS.MANAGE_NICKNAMES
            )
        )
            return SendErrorMessage(
                message,
                "I don't have permission to change your nickname!"
            );
        if (theGuy.id === message.guild.ownderId)
            return SendErrorMessage(
                message,
                "I can't change the name of the owner!"
            );
        if (args.join(" ").length > 32)
            return SendErrorMessage(
                message,
                "Nickname can't be longer than 32 characters."
            );
        theGuy
            .setNickname(args.join(" "))
            .catch((err) => SendErrorMessage(message, err));
    },
};
