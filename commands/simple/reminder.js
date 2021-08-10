// Dependencies & variables

const Discord = require("discord.js");
const path = require("path");
let reminder = require(path.join(__dirname, "../../") +
    "/database/reminders.json");
const fs = require("fs");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "setreminder",
    description: "Sets a reminder. (WIP)",
    category: "Simple",
    usage: "setreminder day month year hour:minute [all obligatory]",
    cooldown: 1,
    aliases: ["remindme"],
    async execute(client, message, args) {
        let allreminders = "allreminders";
        if (!args[0] || !args[1] || !args[2] || !args[3])
            return SendErrorMessage(message, `Use bot? if you need any help.`);
        if (!reminder[allreminders] && !message.author.bot) {
            let data = {
                Date:
                    args[0] +
                    " " +
                    (parseInt(args[1]) - 1).toString() +
                    " " +
                    args[2],
                Time: args[3],
            };
            reminder[allreminders] = [];
            reminder[allreminders].push(
                message.author.id + " " + message.channel.id
            );
            reminder[allreminders].push(data);
            message.reply(
                "Reminder set for " +
                    args[3] +
                    " on " +
                    args[0] +
                    " " +
                    args[1] +
                    " " +
                    args[2]
            );
            return;
        }
        let userIndex = reminder[allreminders].indexOf(
            message.author.id + " " + message.channel.id
        );
        if (
            reminder[allreminders][userIndex] !=
                message.author.id + " " + message.channel.id &&
            !message.author.bot
        ) {
            let data = {
                Date:
                    args[0] +
                    " " +
                    (parseInt(args[1]) - 1).toString() +
                    " " +
                    args[2],
                Time: args[3],
            };
            reminder[allreminders].push(
                message.author.id + " " + message.channel.id
            );
            reminder[allreminders].push(data);
            message.reply(
                "Reminder set for " +
                    args[3] +
                    " on " +
                    args[0] +
                    " " +
                    args[1] +
                    " " +
                    args[2]
            );
        } else {
            reminder[allreminders][userIndex + 1].Date =
                args[0] +
                " " +
                (parseInt(args[1]) - 1).toString() +
                " " +
                args[2];
            reminder[allreminders][userIndex + 1].Time = args[3];
            message.reply(
                "Reminder changed. Current reminder is set for " +
                    args[3] +
                    " on " +
                    args[0] +
                    " " +
                    args[1] +
                    " " +
                    args[2]
            );
        }
        fs.writeFile(
            path.join(__dirname, "../") + "/database/reminders.json",
            JSON.stringify(reminder, null, 4),
            (err) => {
                if (err) console.log(err);
            }
        );
    },
};
