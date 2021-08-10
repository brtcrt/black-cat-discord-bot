// Dependencies & variables

const Discord = require("discord.js");

// Dependencies & variables end

// Error Message Template

const SendSuccessMessage = require("../../utils/SendSuccessMessage");

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "clear",
    description: "Delete messages.",
    category: "Simple",
    usage: "clear [obligatory: amount]",
    cooldown: 5,
    aliases: ["prune", "bulkdelete", "delete"],
    async execute(client, message, args) {
        if (
            !message.member.permissions.has(
                Discord.Permissions.FLAGS.MANAGE_MESSAGES
            )
        )
            return SendErrorMessage(
                message,
                "You don't have permisson (MANAGE_MESSAGES) to run this command!"
            );
        if (
            !message.guild.me.permissions.has(
                Discord.Permissions.FLAGS.MANAGE_MESSAGES
            )
        )
            return SendErrorMessage(
                message,
                "I don't have permisson (MANAGE_MESSAGES) to run this command!"
            );
        if (isNaN(args[0]))
            return SendErrorMessage(message, "You didn't specify an amount!");
        if (args[0] <= 0)
            return SendErrorMessage(message, "Amount must be larger than 0");

        let to_clear = parseInt(args[0]) + 1;
        let fetched;
        let amountofmsgs = 0;
        while (to_clear > 99) {
            fetched = await message.channel.messages.fetch({ limit: 99 });
            console.log(`Fetched ${fetched.size} messages.`);
            message.channel
                .bulkDelete(fetched)
                .catch((error) => message.reply(`Error occured: ${error}`));
            to_clear = to_clear - 99;
            amountofmsgs += 99;
        }
        fetched = await message.channel.messages.fetch({ limit: to_clear });
        console.log(`Fetched ${fetched.size} messages.`);
        amountofmsgs += fetched.size;
        message.channel
            .bulkDelete(fetched)
            .catch((error) =>
                SendErrorMessage(message, `Error occured: ${error}`)
            );
        SendSuccessMessage(message, `Deleted ${amountofmsgs} messages.`);
    },
};
