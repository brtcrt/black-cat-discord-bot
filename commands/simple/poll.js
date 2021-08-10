// Dependencies & variables

const Discord = require("discord.js");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "poll",
    description: "Opens up a simple poll for people to vote on.",
    category: "Simple",
    usage: "poll [obligatory: title] | (optional: options. If no options than just opens a yes/no type poll.)",
    cooldown: 3,
    aliases: ["simplepoll", "vote"],
    async execute(client, message, args) {
        if (
            !message.guild.me.permissions.has(
                Discord.Permissions.FLAGS.MANAGE_MESSAGES
            )
        )
            return SendErrorMessage(
                message,
                "I need MANAGE_MESSAGES in order to run this command as it uses an embed with reactions and also deletes reactions!"
            );
        let num_emj = [
            "1️⃣",
            "2️⃣",
            "3️⃣",
            "4️⃣",
            "5️⃣",
            "6️⃣",
            "7️⃣",
            "8️⃣",
            "9️⃣",
            "🔟",
        ];
        args = args.join(" ").split("|");
        let prepd_args = [];
        for (i in args) {
            prepd_args.push(args[i].trim());
        }
        args = prepd_args;
        let topic = args[0];
        let yesno = false;
        if (!args[1]) {
            yesno = true;
        }
        let choices = "";
        let poll_embed = {
            title: topic,
            description: "",
            color: "RANDOM",
            footer: {
                text: "",
            },
        };
        if (yesno) {
            poll_embed.description =
                "\n:white_check_mark: - Yes\n\n:negative_squared_cross_mark: - No\n";
            let sent_poll_yesno = await message.channel.send({
                embeds: [poll_embed],
            });
            await sent_poll_yesno.react("✅");
            await sent_poll_yesno.react("❎");
        } else {
            args.shift();
            let fin_args = [];
            let unused = [];
            for (l in args) {
                if (l <= 9) {
                    fin_args.push(args[l]);
                } else {
                    unused.push(args[l]);
                }
            }
            args = fin_args;
            for (j in args) {
                choices += `\n${num_emj[j]} - ${args[j]}\n`;
            }
            poll_embed.description = choices + "\n";
            if (unused.join(", ") !== "") {
                poll_embed.footer.text = `${unused.join(
                    ", "
                )} couldn't be used.`;
            } else {
                poll_embed.footer.text = "";
            }
            let sent_poll = await message.channel.send({
                embeds: [poll_embed],
            });
            for (k in args) {
                await sent_poll.react(num_emj[k]);
            }
        }
    },
};
