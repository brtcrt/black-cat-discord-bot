// Dependencies & variables

const Discord = require("discord.js");
const fs = require("fs");

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
function SendSuccessMessage(message, success){
    if(!success) success = "Successfuly executed the command!";
    let generalsuccessmessage = new Discord.MessageEmbed()
    .setTitle("Success!")
    .setColor("#09ff01")
    .setDescription(success.toString());
    message.channel.send(generalsuccessmessage);
    };

// Error Message Template

module.exports = {
    name: "reload",
    description: "",
    cooldown: 5,
    aliases: ["restart"],
    async execute(message, args){
        if (!args.length) return SendErrorMessage(message, `You didn't pass any command to reload!`);
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if(!command) return SendErrorMessage(message, "That command doesn't exits!");
        delete require.cache[require.resolve(`./${commandName}.js`)];
        try {
            const newCommand = require(`./${commandName}.js`);
            message.client.commands.set(newCommand.name, newCommand);
        } catch (error) {
            console.error(error);
            SendErrorMessage(message);
        }
        SendSuccessMessage(message, `${commandName} was reloaded successfully`);
    }
};