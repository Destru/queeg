const Discord = require('discord.js')
const { embedColor, role } = require('../../config')
const prettyMs = require('pretty-ms')

const db = require('flat-db')
db.configure({ dir: './data' })
const Resurrection = new db.Collection('resurrections', { uid: '' })

module.exports = {
  name: 'resurrect',
  description: 'Removes all death penalties.',
  restricted: 'voter',
  execute(message) {
    if (!message.member.roles.cache.has(role.ghost))
      return message.channel.send(`You're not dead.`)

    const embed = new Discord.MessageEmbed()
      .setColor(embedColor)
      .setTitle(`Ressurection`)
    const matches = Resurrection.find().matches('uid', message.author.id).run()
    const hasResurrected = matches.length > 0
    let timeRemaining

    if (hasResurrected) {
      const expires = matches[0]._ts_ + 3 * 24 * 60 * 60 * 1000
      if (Date.now() < expires) timeRemaining = expires - Date.now()
    }

    if (!timeRemaining) {
      message.member.roles.remove(role.ghost)
      if (hasResurrected) Resurrection.remove(matches[0]._id_)
      Resurrection.add({ uid: message.author.id })
      embed.setDescription(`You have been resurrected 🙏`)
    } else {
      embed.setDescription(
        `You have to wait \`${prettyMs(timeRemaining)}\` to resurrect.`
      )
    }
    message.channel.send(embed)
  },
}
