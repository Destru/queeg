const fetch = require('node-fetch');

module.exports = {
  name: 'giphy',
  args: true,
  description: 'Fetch GIPHY',
  example: 'hello world',
  execute(message, args) {
    let tag = encodeURI(args.join(' '));
    fetch(`https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_TOKEN}&tag=${tag}&rating=pg13`)
      .then(response => response.json())
      .then(data => {
        message.channel.send(data.data.embed_url);
      });
  },
};