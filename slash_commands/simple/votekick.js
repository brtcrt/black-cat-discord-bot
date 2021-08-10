// Dependencies & variables

const { Console } = require("console");
const Discord = require("discord.js");
const path = require("path");
let voteservers = {};

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/slash_ErrorMessage");

// Error Message Template

module.exports = {
    name: "votekick",
    description: "Open a poll to kick people.",
    usage: "votekick @user",
    options: [
        {
            name: "user",
            type: "USER",
            description: "User to votekick.",
            required: true,
        },
    ],
    category: "Simple",
    cooldown: 0,
    aliases: ["kickvote", "kick", "kickpoll"],
    async execute(client, interaction) {
        const user = interaction.options.getUser("user");
        const target = await interaction.guild.members.cache.get(user.id);
        if (
            !interaction.guild.me.permissions.has(
                Discord.Permissions.FLAGS.KICK_MEMBERS
            )
        )
            return SendErrorMessage(
                interaction,
                "I don't have the permission to kick members!"
            );
        if (
            !interaction.guild.me.permissions.has(
                Discord.Permissions.FLAGS.MANAGE_MESSAGES
            )
        )
            return SendErrorMessage(
                interaction,
                "I need MANAGE_MESSAGES in order to run this command as it uses an embed with reactions and also deletes reactions!"
            );

        if (target.id == interaction.guild.ownerId)
            return SendErrorMessage(
                interaction,
                "I can't kick the owner of the server."
            );
        if (target.id == client.user.id)
            return SendErrorMessage(interaction, "I can't kick myself!");
        if (
            !voteservers[interaction.guild.id] ||
            voteservers[interaction.guild.id]
        ) {
            if (!voteservers[interaction.guild.id]) {
                voteservers[interaction.guild.id] = {
                    notCooldown: true,
                    voteStays: 0,
                    voteKicks: 0,
                    member: target,
                };
            }
            if (voteservers[interaction.guild.id].notCooldown === false)
                return SendErrorMessage(
                    interaction,
                    "You must wait for the other vote to end!"
                );
            voteservers[interaction.guild.id].notCooldown = false;
            const voteMsg = {
                title: `Vote to kick **${target.displayName}**`,
                description:
                    "React with ✅ for the member to get kicked. React with ⛔ for the member to stay.",
                color: "RANDOM",
            };
            await interaction.reply({
                embeds: [voteMsg],
            });
            const sentVoteMsg = await interaction.fetchReply();
            await sentVoteMsg.react("✅");
            await sentVoteMsg.react("⛔");
            setTimeout(makeDecision, 30000);
            setTimeout(() => interaction.deleteReply(), 30000);
            client.on("messageReactionAdd", async (reaction) => {
                try {
                    await reaction.fetch();
                } catch (error) {
                    console.error(
                        "Something went wrong when fetching the message: ",
                        error
                    );
                    return;
                }

                if (reaction.emoji.name == "✅") {
                    if (reaction.message.id === sentVoteMsg.id) {
                        voteservers[interaction.guild.id].voteKicks += 1;
                        console.log("Someone voted yes.");
                    }
                } else if (reaction.emoji.name == "⛔") {
                    if (reaction.message.id === sentVoteMsg.id) {
                        voteservers[interaction.guild.id].voteStays += 1;
                        console.log("Someone voted no.");
                    }
                }
            });
            client.on("messageReactionRemove", async (reaction) => {
                try {
                    await reaction.fetch();
                } catch (error) {
                    console.error(
                        "Something went wrong when fetching the message: ",
                        error
                    );
                    return;
                }

                if (reaction.emoji.name == "✅") {
                    if (reaction.message.id === sentVoteMsg.id) {
                        voteservers[interaction.guild.id].voteKicks -= 1;
                        console.log("Someone un-voted yes.");
                    }
                } else if (reaction.emoji.name == "⛔") {
                    if (reaction.message.id === sentVoteMsg.id) {
                        voteservers[interaction.guild.id].voteStays -= 1;
                        console.log("Someone un-voted no.");
                    }
                }
            });
            async function makeDecision() {
                if (
                    voteservers[interaction.guild.id].voteKicks >
                    voteservers[interaction.guild.id].voteStays
                ) {
                    const kickMsg = {
                        title: `**Begone!** ***${target.displayName}***`,
                        fields: [
                            {
                                name: "Votes for kick:",
                                value: voteservers[
                                    interaction.guild.id
                                ].voteKicks.toString(),
                                inline: true,
                            },
                            {
                                name: "Votes for stay:",
                                value: voteservers[
                                    interaction.guild.id
                                ].voteStays.toString(),
                                inline: true,
                            },
                        ],
                        color: "RANDOM",
                    };
                    await target.kick().catch((err) => {
                        console.log(err);
                        voteservers[interaction.guild.id].notCooldown = true;
                        voteservers[interaction.guild.id].voteKicks = 0;
                        voteservers[interaction.guild.id].voteStays = 0;
                        voteservers[interaction.guild.id].member = null;
                    });
                    await interaction.channel.send({ embeds: [kickMsg] });
                    voteservers[interaction.guild.id].notCooldown = true;
                    voteservers[interaction.guild.id].voteKicks = 0;
                    voteservers[interaction.guild.id].voteStays = 0;
                    voteservers[interaction.guild.id].member = null;
                } else {
                    const stayMsg = {
                        title: `**You stay** ***${target.displayName}***...`,
                        fields: [
                            {
                                name: "Votes for kick:",
                                value: voteservers[
                                    interaction.guild.id
                                ].voteKicks.toString(),
                                inline: true,
                            },
                            {
                                name: "Votes for stay:",
                                value: voteservers[
                                    interaction.guild.id
                                ].voteStays.toString(),
                                inline: true,
                            },
                        ],
                        color: "RANDOM",
                    };
                    interaction.channel.send({ embeds: [stayMsg] });
                    voteservers[interaction.guild.id].notCooldown = true;
                    voteservers[interaction.guild.id].voteKicks = 0;
                    voteservers[interaction.guild.id].voteStays = 0;
                    voteservers[interaction.guild.id].member = null;
                }
            }
        }
    },
};
