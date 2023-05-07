const fetch = require('node-fetch')

module.exports = {
  name: 'insult',
  description: `Feeling too good about yourself?`,
  execute(message) {
    fetch(`https://insult.mattbas.org/api/insult.json`)
      .then((response) => response.json())
      .then((data) => {
        message.channel
          .send(`${data.insult}, ${message.author}`)
          .then((message) => {
            message.react('👍')
            message.react('👎')
          })
      })
  },
}
