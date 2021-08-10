// Dependencies & variables

const Discord = require("discord.js");

// Dependencies & variables end

// Error Message Template

const SendSuccessMessage = require("../../utils/slash_SuccessMessage");

const SendErrorMessage = require("../../utils/slash_ErrorMessage");

// Error Message Template

module.exports = {
    name: "clear",
    description: "Delete messages.",
    options: [
        {
            name: "amount",
            type: "NUMBER",
            description: "Amount of messages to delete.",
            required: true,
        },
    ],
    category: "Simple",
    usage: "clear [obligatory: amount]",
    cooldown: 5,
    aliases: ["prune", "bulkdelete", "delete"],
    async execute(client, interaction) {
        let amount = interaction.options.getNumber("amount");
        if (
            !interaction.member.permissions.has(
                Discord.Permissions.FLAGS.MANAGE_MESSAGES
            )
        )
            return SendErrorMessage(
                interaction,
                "You don't have permisson (MANAGE_MESSAGES) to run this command!"
            );
        if (
            !interaction.guild.me.permissions.has(
                Discord.Permissions.FLAGS.MANAGE_MESSAGES
            )
        )
            return SendErrorMessage(
                interaction,
                "I don't have permisson (MANAGE_MESSAGES) to run this command!"
            );
        if (amount <= 0)
            return SendErrorMessage(
                interaction,
                "Amount must be larger than 0"
            );

        let to_clear = amount + 1;
        let fetched;
        let amountofmsgs = 0;
        while (to_clear > 99) {
            fetched = await interaction.channel.messages.fetch({ limit: 99 });
            console.log(`Fetched ${fetched.size} messages.`);
            interaction.channel.bulkDelete(fetched).catch((error) =>
                interaction.reply({
                    embeds: [
                        {
                            title: "Uh oh! Something went wrong!",
                            color: "RED",
                            description: `Error occured: ${error}`,
                        },
                    ],
                })
            );
            to_clear = to_clear - 99;
            amountofmsgs += 99;
        }
        fetched = await interaction.channel.messages.fetch({ limit: to_clear });
        console.log(`Fetched ${fetched.size} messages.`);
        amountofmsgs += fetched.size;
        interaction.channel.bulkDelete(fetched).catch((error) =>
            interaction.reply({
                embeds: [
                    {
                        title: "Uh oh! Something went wrong!",
                        color: "RED",
                        description: `Error occured: ${error}`,
                    },
                ],
            })
        );
        interaction.reply({
            embeds: [
                {
                    title: "Success!",
                    color: "#09ff01",
                    description: `Deleted ${amountofmsgs} messages.`,
                },
            ],
        });
    },
};
