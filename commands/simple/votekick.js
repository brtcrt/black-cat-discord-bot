// Dependencies & variables

const Discord = require("discord.js");
const path = require("path");
let voteservers = {};

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "votekick",
    description: "Open a poll to kick people.",
    usage: "votekick @user",
    category: "Simple",
    cooldown: 0,
    aliases: ["kickvote", "kick", "kickpoll"],
    async execute(client, message, args) {
        if (message.author.bot) return;
        if (
            !message.guild.me.permissions.has(
                Discord.Permissions.FLAGS.KICK_MEMBERS
            )
        )
            return SendErrorMessage(
                message,
                "I don't have the permission to kick members!"
            );
        if (
            !message.guild.me.permissions.has(
                Discord.Permissions.FLAGS.MANAGE_MESSAGES
            )
        )
            return SendErrorMessage(
                message,
                "I need MANAGE_MESSAGES in order to run this command as it uses an embed with reactions and also deletes reactions!"
            );

        if (message.content.includes("@everyone"))
            return SendErrorMessage(message, "You can't @ everyone!");
        if (message.content.includes("@here"))
            return SendErrorMessage(message, "You can't @ here!");
        if (!message.mentions.members.first())
            return SendErrorMessage(message, "You didn't @ a person!");
        if (message.mentions.members.first().id == message.guild.ownerId)
            return SendErrorMessage(
                message,
                "I can't kick the owner of the server."
            );
        if (message.mentions.members.first().id == message.guild.me.id)
            return SendErrorMessage(message, "I can't kick myself!");
        if (!voteservers[message.guild.id] || voteservers[message.guild.id]) {
            if (!voteservers[message.guild.id]) {
                voteservers[message.guild.id] = {
                    notCooldown: true,
                    voteStays: 0,
                    voteKicks: 0,
                    member: message.mentions.members.first(),
                };
            }
            if (voteservers[message.guild.id].notCooldown === false)
                return SendErrorMessage(
                    message,
                    "You must wait for the other vote to end!"
                );
            voteservers[message.guild.id].notCooldown = false;
            const voteMsg = {
                title: `Vote to kick **${
                    message.mentions.members.first().displayName
                }**`,
                description:
                    "React with ✅ for the member to get kicked. React with ⛔ for the member to stay.",
                color: "RANDOM",
            };
            const sentVoteMsg = await message.channel.send({
                embeds: [voteMsg],
            });
            await sentVoteMsg.react("✅");
            await sentVoteMsg.react("⛔");
            setTimeout(makeDecision, 30000);
            setTimeout(() => sentVoteMsg.delete(), 30000);
            client.on("messageReactionAdd", async (reaction, user) => {
                try {
                    await reaction.fetch();
                } catch (error) {
                    console.error(
                        "Something went wrong when fetching the message: ",
                        error
                    );
                    return;
                }

                if (reaction.emoji.name == "✅" && !user.bot) {
                    if (reaction.message.id === sentVoteMsg.id) {
                        voteservers[message.guild.id].voteKicks += 1;
                        console.log("Someone voted yes.");
                    }
                } else if (reaction.emoji.name == "⛔" && !user.bot) {
                    if (reaction.message.id === sentVoteMsg.id) {
                        voteservers[message.guild.id].voteStays += 1;
                        console.log("Someone voted no.");
                    }
                }
            });
            client.on("messageReactionRemove", async (reaction, user) => {
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
                        voteservers[message.guild.id].voteKicks -= 1;
                        console.log("Someone un-voted yes.");
                    }
                } else if (reaction.emoji.name == "⛔") {
                    if (reaction.message.id === sentVoteMsg.id) {
                        voteservers[message.guild.id].voteStays -= 1;
                        console.log("Someone un-voted no.");
                    }
                }
            });
            async function makeDecision() {
                if (
                    voteservers[message.guild.id].voteKicks >
                    voteservers[message.guild.id].voteStays
                ) {
                    const kickMsg = {
                        title: `**Begone!** ***${
                            message.mentions.members.first().displayName
                        }***`,
                        fields: [
                            {
                                name: "Votes for kick:",
                                value: voteservers[
                                    message.guild.id
                                ].voteKicks.toString(),
                                inline: true,
                            },
                            {
                                name: "Votes for stay:",
                                value: voteservers[
                                    message.guild.id
                                ].voteStays.toString(),
                                inline: true,
                            },
                        ],
                        color: "RANDOM",
                    };

                    await message.mentions.members
                        .first()
                        .kick()
                        .catch((err) => {
                            SendErrorMessage(message, err);
                            voteservers[message.guild.id].notCooldown = true;
                            voteservers[message.guild.id].voteKicks = 0;
                            voteservers[message.guild.id].voteStays = 0;
                            voteservers[message.guild.id].member = null;
                        });
                    await message.channel.send({ embeds: [kickMsg] });
                    voteservers[message.guild.id].notCooldown = true;
                    voteservers[message.guild.id].voteKicks = 0;
                    voteservers[message.guild.id].voteStays = 0;
                    voteservers[message.guild.id].member = null;
                } else {
                    const stayMsg = {
                        title: `**You stay** ***${
                            message.mentions.members.first().displayName
                        }***...`,
                        fields: [
                            {
                                name: "Votes for kick:",
                                value: voteservers[
                                    message.guild.id
                                ].voteKicks.toString(),
                                inline: true,
                            },
                            {
                                name: "Votes for stay:",
                                value: voteservers[
                                    message.guild.id
                                ].voteStays.toString(),
                                inline: true,
                            },
                        ],
                        color: "RANDOM",
                    };
                    message.channel.send({ embeds: [stayMsg] });
                    voteservers[message.guild.id].notCooldown = true;
                    voteservers[message.guild.id].voteKicks = 0;
                    voteservers[message.guild.id].voteStays = 0;
                    voteservers[message.guild.id].member = null;
                }
            }
        }
    },
};
