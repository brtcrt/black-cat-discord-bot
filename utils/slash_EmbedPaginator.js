const { Permissions } = require("discord.js");

const embedPagination = async (
    interaction,
    pages,
    pageOnFooter = true,
    emojiList = ["⏪", "⏩", "🗑️"],
    timeout = 120000
) => {
    const warning_msg = !interaction.guild.me.permissions.has(
        Permissions.FLAGS.MANAGE_MESSAGES
    )
        ? await interaction.channel.send(
              "I don't have MANAGE_MESSAGE as a permission so I can't remove your reactions. If you want to have an easier time using these embeds, you might want to consider giving me the permission."
          )
        : null;
    if (!interaction && !interaction.channel)
        throw new Error("Channel is inaccessible.");
    if (!pages) throw new Error("Pages are not given.");
    if (emojiList.length !== 3) throw new Error("Need three emojis.");
    let page = 0;
    pageOnFooter
        ? (pages[page].footer.text += `Page ${page + 1} of ${pages.length}`)
        : null;
    const sent_reply = await interaction.editReply({
        embeds: [pages[page]],
    });
    const curPage = await interaction.fetchReply();
    for (const emoji of emojiList) await curPage.react(emoji);
    const filter = (reaction, user) =>
        emojiList.includes(reaction.emoji.name) &&
        !user.bot &&
        user.id == interaction.user.id;
    const reactionCollector = curPage.createReactionCollector({
        filter: filter,
        time: timeout,
    });
    reactionCollector.on("collect", async (reaction) => {
        interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)
            ? reaction.users.remove(interaction.user)
            : null;
        switch (reaction.emoji.name) {
            case emojiList[0]:
                page = page > 0 ? --page : pages.length - 1;
                break;
            case emojiList[1]:
                page = page + 1 < pages.length ? ++page : 0;
                break;
            case emojiList[2]:
                if (!curPage.deleted) {
                    warning_msg !== null ? warning_msg.delete() : null;
                    interaction.delete();
                }
                break;
            default:
                break;
        }
        pageOnFooter
            ? (pages[page].footer.text += `Page ${page + 1} of ${pages.length}`)
            : null;
        !curPage.deleted
            ? interaction.editReply({
                  embeds: [pages[page]],
              })
            : null;
    });
    reactionCollector.on("end", () => {
        if (!curPage.deleted) {
            interaction.guild.me.permissions.has(
                Permissions.FLAGS.MANAGE_MESSAGES
            )
                ? curPage.reactions.removeAll()
                : null;
        }
    });
    return curPage;
};

module.exports = embedPagination;
