const { Permissions } = require("discord.js");

const hentaiPaginator = async (
    msg,
    title = "Some unknown hentai",
    pages,
    pageOnFooter = true,
    emojiList = ["⏪", "⏩", "🗑️"],
    timeout = 120000
) => {
    const warning_msg = !msg.guild.me.permissions.has(
        Permissions.FLAGS.MANAGE_MESSAGES
    )
        ? await msg.channel.send(
              "I don't have MANAGE_MESSAGE as a permission so I can't remove your reactions. If you want to have an easier time using these embeds, you might want to consider giving me the permission."
          )
        : null;
    if (!msg && !msg.channel) throw new Error("Channel is inaccessible.");
    if (!pages) throw new Error("Pages are not given.");
    if (emojiList.length !== 3) throw new Error("Need three emojis.");
    let page = 0;
    const curPage = await msg.channel.send({
        embeds: [
            {
                title: title,
                image: {
                    url: pages[page],
                },
                footer: {
                    text: pageOnFooter
                        ? `Page ${page + 1} of ${pages.length}`
                        : "",
                },
            },
        ],
    });
    const filter = (reaction, user) =>
        emojiList.includes(reaction.emoji.name) &&
        !user.bot &&
        user.id == msg.author.id;
    for (const emoji of emojiList) await curPage.react(emoji);
    const reactionCollector = curPage.createReactionCollector({
        filter: filter,
        time: timeout,
    });
    reactionCollector.on("collect", async (reaction) => {
        msg.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)
            ? reaction.users.remove(msg.author)
            : null;
        switch (reaction.emoji.name) {
            case emojiList[0]:
                page = page > 0 ? --page : pages.length - 1;
                break;
            case emojiList[1]:
                page = page + 1 < pages.length ? ++page : 0;
                break;
            case emojiList[2]:
                warning_msg !== null ? warning_msg.delete() : null;
                curPage.delete();
                break;
            default:
                break;
        }
        !curPage.deleted
            ? curPage.edit({
                  embeds: [
                      {
                          title: title,
                          image: {
                              url: pages[page],
                          },
                          footer: {
                              text: pageOnFooter
                                  ? `Page ${page + 1} of ${pages.length}`
                                  : "",
                          },
                      },
                  ],
              })
            : null;
    });
    reactionCollector.on("end", () => {
        if (!curPage.deleted) {
            msg.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)
                ? curPage.reactions.removeAll()
                : null;
        }
    });
    return curPage;
};

module.exports = hentaiPaginator;
