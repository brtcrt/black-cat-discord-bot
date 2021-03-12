// Dependencies & variables

const Discord = require("discord.js");
const client = new Discord.Client()
const path = require("path");
let notCooldown = true;
let voteKicks = 0;
let voteStays = 0;

// Dependencies & variables end

// Error Message Template

function SendErrorMessage(message, reason){
    if(!reason){
        reason = "Looks like something went wrong. Please try again. If you need help use =bot?"
    };
    let generalerrormessage = new Discord.MessageEmbed()
    .setTitle("Uh oh! Something went wrong!")
    .setColor("#f01717")
    .setDescription(reason.toString());
    message.channel.send(generalerrormessage);
};

// Error Message Template

module.exports = {
    name: "",
    description: "Open a poll to kick people.",
    cooldown: 30,
    aliases: ["", "", ""],
    async execute(message, args){
        if(message.author.bot) return;
        if(!message.guild.me.hasPermission("ADMINISTRATOR")) return SendErrorMessage(message, "I need to have administrator to run this command!");
        if(!message.guild.me.hasPermission("KICK_MEMBERS")) return SendErrorMessage(message, "I don't have the permission to kick members!");
        if (message.content.includes("@everyone")) return SendErrorMessage(message, "You can't @ everyone!");
        if (message.content.includes("@here")) return SendErrorMessage(message, "You can't @ here!");
        if(!message.mentions.members.first()) return SendErrorMessage(message, "You didn't @ a person!");
        if(message.mentions.members.first().id == message.guild.me.id) return SendErrorMessage(message, "I can't kick myself!");
        if(notCooldown){
            const voteMsg = {
                title: `Vote to kick **${message.mentions.members.first().displayName}**`,
                description: "React with ✅ for the member to get kicked. React with ⛔ for the member to stay.",
                color: "RANDOM"
            }; 
            notCooldown = false;
            var member = message.mentions.members.first();
            const sentVoteMsg = await message.channel.send({embed: voteMsg});
            await sentVoteMsg.react("✅");
            await sentVoteMsg.react("⛔");
            setTimeout(makeDecision, 30000);
            sentVoteMsg.delete({ timeout: 30000});
            client.on('messageReactionAdd', async (reaction) => {
                try {
                    await reaction.fetch();
                } catch (error) {
                    console.error('Something went wrong when fetching the message: ', error);
                    return;
                };
            
                if (reaction.emoji.name == '✅') {
                    if (reaction.message.id === sentVoteMsg.id){
                        voteKicks += 1;
                        console.log("Someone voted yes.");
                    };
                } else if (reaction.emoji.name == '⛔') {
                    if (reaction.message.id === sentVoteMsg.id){
                        voteStays += 1;
                        console.log("Someone voted no.");
                    };
                };
            
            });
            client.on('messageReactionRemove', async (reaction) => {
                try {
                    await reaction.fetch();
                } catch (error) {
                    console.error('Something went wrong when fetching the message: ', error);
                    return;
                };
            
                if (reaction.emoji.name == '✅') {
                    if (reaction.message.id === sentVoteMsg.id){
                        voteKicks -= 1;
                        console.log("Someone un-voted yes.");
                    };
                } else if (reaction.emoji.name == '⛔') {
                    if (reaction.message.id === sentVoteMsg.id){
                        voteStays -= 1;
                        console.log("Someone un-voted no.");
                    };
                };
            
            });
            async function makeDecision(){
                if(voteKicks > voteStays){
                    const kickMsg = {
                        title: `**Begone!** ***${message.mentions.members.first().displayName}***`,
                        fields: [
                            {
                                name: "Votes for kick:",
                                value: voteKicks,
                                inline: true
                            },
                            {
                                name: "Votes for stay:",
                                value: voteStays,
                                inline: true
                            }
                        ],
                        color: "RANDOM"
                    };  
                    message.channel.send({embed: kickMsg});
                    if(message.mentions.members.first().id === message.guild.ownerID) return SendErrorMessage(message, "I can't kick the owner of the server.");
                    if(!message.guild.member(message.mentions.members.first().id)) return SendErrorMessage(message, "That user is no longer in the server!");
                    try  {
                        member.kick();
                    } catch(err) {
                        console.log(err);
                        message.channel.send(`An error occured while trying to kick **${message.mentions.members.first().displayName}**`);
                    }
                    notCooldown = true;
                    voteKicks = 0;
                    voteStays = 0;
                } else{
                    const stayMsg = {
                        title: `**You stay** ***${message.mentions.members.first().displayName}***...`,
                        fields: [
                            {
                                name: "Votes for kick:",
                                value: voteKicks,
                                inline: true
                            },
                            {
                                name: "Votes for stay:",
                                value: voteStays,
                                inline: true
                            }
                        ],
                        color: "RANDOM"
                    };  
                    message.channel.send({embed: stayMsg});
                    notCooldown = true;
                    voteKicks = 0;
                    voteStays = 0;
                };
            };
        };
    }
};