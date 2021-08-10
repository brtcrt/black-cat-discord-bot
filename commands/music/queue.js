// Dependencies & variables

const Discord = require("discord.js");
const embedPaginator = require("../../utils/embedPaginator");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "queue",
    description: "Shows the queue of the server.",
    usage: "queue",
    cooldown: 1,
    aliases: ["songs", "tracks"],
    async execute(client, message, args) {
        if (!client.playServers[message.guild.id])
            return SendErrorMessage(message, "Queue is currently empty!");
        if (!client.playServers[message.guild.id].playing)
            return SendErrorMessage(message, "Queue is currently empty!");
        if (client.playServers[message.guild.id].queue[0] == null)
            return SendErrorMessage(message, "Queue is currently empty!");
        if (
            !message.guild.me.permissions.has(
                Discord.Permissions.FLAGS.MANAGE_MESSAGES
            )
        )
            return SendErrorMessage(
                message,
                "I need to have MANAGE_MESSAGES to run this command as it uses an embed with reactions and also deletes reactions!"
            );
        let qinfo = [];
        for (
            let i = 0;
            i < client.playServers[message.guild.id].queue.length;
            i++
        ) {
            let vidInfo = client.playServers[message.guild.id].queue[i];
            qinfo.push(
                (i + 1).toString() +
                    ") " +
                    `[${vidInfo.title}](${vidInfo.url})  -  [${vidInfo.channelname}](${vidInfo.channelurl})` +
                    "\n "
            );
        }
        const qIndex = Math.round(qinfo.length / 8) + 1;
        const qArray = [];
        for (let i = 0; i <= qIndex; i++) {
            let qText = "";
            qText += qinfo.slice(i * 8, (i + 1) * 8).join("");
            let b = i - 1;
            qArray.push(
                new Discord.MessageEmbed()
                    .setTitle(`${message.guild.name}' queue, Page #${i + 1}`)
                    .setDescription(qText)
            );
        }
        embedPaginator(message, qArray, false);
    },
};
