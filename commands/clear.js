// Dependencies & variables

const Discord = require("discord.js");

// Dependencies & variables end

// Error Message Template

function SendSuccessMessage(message, success){
    if(!success) success = "Successfuly executed the command!";
    let generalsuccessmessage = new Discord.MessageEmbed()
    .setTitle("Success!")
    .setColor("#09ff01")
    .setDescription(success.toString());
    message.channel.send(generalsuccessmessage);
};

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
    name: "clear",
    description: "Delete messages.",
    cooldown: 5,
    aliases: ["prune", "bulkdelete", "delete"],
    async execute(message, args){
        if(!message.guild.me.hasPermission("ADMINISTRATOR")) return SendErrorMessage(message, "I need to have administrator to run this command!");
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return SendErrorMessage(message, "You don't have permisson to run this command!");
        if(isNaN(args[0])) return SendErrorMessage(message);
        if(args[0] <= 0 ) return SendErrorMessage(message);
        var fetched;
        var amountofmsgs = 0;
        while(args[0] > 99){
                fetched = await message.channel.messages.fetch({limit: 99});
                console.log(`Fetched ${fetched.size} messages.`);
                message.channel.bulkDelete(fetched).catch(error => message.reply(`Error occured: ${error}`));
                args[0] = args[0] - 99;
                amountofmsgs += 99;
        };
        fetched = await message.channel.messages.fetch({limit: args[0]});
        console.log(`Fetched ${fetched.size} messages.`);
        amountofmsgs += fetched.size;
        message.channel.bulkDelete(fetched).catch(error => message.reply(`Error occured: ${error}`));
        SendSuccessMessage(message, `Deleted ${amountofmsgs} messages.`);
    }
};