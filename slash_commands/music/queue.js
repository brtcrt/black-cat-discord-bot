// Dependencies & variables

const Discord = require("discord.js");
const embedPaginator = require("../../utils/slash_EmbedPaginator");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/slash_ErrorMessage");

// Error Message Template

module.exports = {
    name: "queue",
    description: "Shows the queue of the server.",
    usage: "queue",
    cooldown: 1,
    aliases: ["songs", "tracks"],
    async execute(client, interaction) {
        if (!client.playServers[interaction.guild.id])
            return SendErrorMessage(interaction, "Queue is currently empty!");
        if (!client.playServers[interaction.guild.id].playing)
            return SendErrorMessage(interaction, "Queue is currently empty!");
        if (client.playServers[interaction.guild.id].queue[0] == null)
            return SendErrorMessage(interaction, "Queue is currently empty!");
        if (
            !interaction.guild.me.permissions.has(
                Discord.Permissions.FLAGS.MANAGE_MESSAGES
            )
        )
            return SendErrorMessage(
                interaction,
                "I need to have MANAGE_MESSAGES to run this command as it uses an embed with reactions and also deletes reactions!"
            );
        await interaction.deferReply();
        let qinfo = [];
        for (
            let i = 0;
            i < client.playServers[interaction.guild.id].queue.length;
            i++
        ) {
            let vidInfo = client.playServers[interaction.guild.id].queue[i];
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
                    .setTitle(
                        `${interaction.guild.name}' queue, Page #${i + 1}`
                    )
                    .setDescription(qText)
            );
        }
        embedPaginator(interaction, qArray, false);
    },
};
