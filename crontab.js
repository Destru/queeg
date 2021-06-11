const Discord = require('discord.js')
const cron = require('node-cron')
const fetch = require('node-fetch')
const ordinal = require('ordinal/indicator')

const config = require('./config')
const { randomEntries } = require('./helpers')

const deathsChannel = '832394205422026813'
const eventsChannel = '160320676580818951'
const testChannel = '845382463685132288'

const dailyDeaths = (client, channel) => {
  const now = new Date()

  fetch(
    `https://byabbe.se/on-this-day/${
      now.getMonth() + 1
    }/${now.getDate()}/deaths.json`
  )
    .then((response) => response.json())
    .then((data) => {
      const deaths = randomEntries(data.deaths, 24, 'byabbe') // Hail, Satan!
      const embed = new Discord.MessageEmbed()
        .setColor(config.embedColor)
        .setTitle(`Deaths on ${data.date}${ordinal(now.getDate())} :headstone:`)

      deaths.forEach((death) => {
        const description = death.description.replace('[[', '')
        const link = death.wikipedia[0].wikipedia
        let year = death.year
        if (year.match(/-/)) year = `${year.replace('-', '')} BC`
        embed.addField(year, `[${description}](${link})`, true)
      })

      client.channels.cache.get(channel).send(embed)
    })
}

const dailyEvents = (client, channel) => {
  const now = new Date()

  fetch(
    `https://byabbe.se/on-this-day/${
      now.getMonth() + 1
    }/${now.getDate()}/events.json`
  )
    .then((response) => response.json())
    .then((data) => {
      const events = randomEntries(data.events, 10, 'byabbe')
      const embed = new Discord.MessageEmbed()
        .setColor(config.embedColor)
        .setTitle(`Events on ${data.date}${ordinal(now.getDate())} :newspaper:`)

      events.forEach((event) => {
        let description = event.description
        let year = event.year
        if (year.match(/-/)) year = `${year.replace('-', '')} BC`

        event.wikipedia.forEach((wiki, i) => {
          let link = `[${wiki.title}](${wiki.wikipedia})`

          if (i === 0) description += `\n ${link}`
          else description += `, ${link}`
        })

        embed.addField(event.year, `${description}`)
      })

      client.channels.cache.get(channel).send(embed)
    })
}

module.exports = {
  dev: (client) => {
    dailyDeaths(client, testChannel)
    dailyEvents(client, testChannel)
  },
  load: (client) => {
    cron.schedule(
      '0 8 * * *',
      () => {
        console.log('Running 8am tasks.')

        dailyDeaths(client, deathsChannel)
        dailyEvents(client, eventsChannel)
      },
      {
        timezone: 'America/Los_Angeles',
      }
    )
  },
}
