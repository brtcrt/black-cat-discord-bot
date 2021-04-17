const embedPagination = async (
    msg,
    pages,
    pageOnFooter = true,
    emojiList = ['⏪', '⏩', '🗑️'],
    timeout = 120000
) => {
    const warning_msg = !msg.guild.me.hasPermission('MANAGE_MESSAGES')
        ? await msg.channel.send(
              "I don't have MANAGE_MESSAGE as a permission so I can't remove your reactions. If you want to have an easier time using these embeds, you might want to consider giving me the permission."
          )
        : null
    if (!msg && !msg.channel) throw new Error('Channel is inaccessible.')
    if (!pages) throw new Error('Pages are not given.')
    if (emojiList.length !== 3) throw new Error('Need two emojis.')
    let page = 0
    pageOnFooter
        ? (pages[page].footer.text += `Page ${page + 1} of ${pages.length}`)
        : null
    const curPage = await msg.channel.send({
        embed: pages[page],
    })
    for (const emoji of emojiList) await curPage.react(emoji)
    const reactionCollector = curPage.createReactionCollector(
        (reaction, user) =>
            emojiList.includes(reaction.emoji.name) && !user.bot,
        { time: timeout }
    )
    reactionCollector.on('collect', async (reaction) => {
        msg.guild.me.hasPermission('MANAGE_MESSAGES')
            ? reaction.users.remove(msg.author)
            : null
        switch (reaction.emoji.name) {
            case emojiList[0]:
                page = page > 0 ? --page : pages.length - 1
                break
            case emojiList[1]:
                page = page + 1 < pages.length ? ++page : 0
                break
            case emojiList[2]:
                warning_msg !== null ? warning_msg.delete() : null
                curPage.delete()
                return
            default:
                break
        }
        pageOnFooter
            ? (pages[page].footer.text += `Page ${page + 1} of ${pages.length}`)
            : null
        !curPage.deleted
            ? curPage.edit({
                  embed: pages[page],
              })
            : null
    })
    reactionCollector.on('end', () => {
        if (!curPage.deleted) {
            msg.guild.me.hasPermission('MANAGE_MESSAGES')
                ? curPage.reactions.removeAll()
                : null
        }
    })
    return curPage
}

module.exports = embedPagination
