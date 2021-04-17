// Dependencies & variables

const Discord = require('discord.js')
const path = require('path')
const embedPagination = require('../utils/embedPaginator')
const links = require(path.join(__dirname, '../') + '/storage/links.json')
const { embeds } = require(path.join(__dirname, '../') +
    '/storage/help_commands.json')
const prefixes = require(path.join(__dirname, '../') +
    '/database/prefixes.json')

// Dependencies & variables end

// Error Message Template

function SendErrorMessage(message, reason) {
    if (!reason) {
        reason =
            'Looks like something went wrong. Please try again. If you need help use =bot?'
    }
    let generalerrormessage = new Discord.MessageEmbed()
        .setTitle('Uh oh! Something went wrong!')
        .setColor('#f01717')
        .setDescription(reason.toString())
    message.channel.send(generalerrormessage)
}

// Error Message Template

module.exports = {
    name: 'bot?',
    description: '',
    cooldown: 1,
    aliases: ['help', 'commands', 'bot', 'bot???'],
    async execute(message, args) {
        let curprefix = prefixes[message.guild.id].prefix
        for (i = 0; i < embeds.length; i++) {
            embeds[i].thumbnail.url =
                links.link[Math.floor(Math.random() * links.link.length)].name
            embeds[i].footer.text = `Current prefix is ${curprefix}\n`
        }
        embedPagination(message, embeds).catch((err) =>
            SendErrorMessage(message, err)
        )
    },
}
