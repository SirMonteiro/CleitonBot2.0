const guildsdb = require('../models/guilds')
const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 7200 })
module.exports = async (client, message) => {
  // Verify if the message is from another bot
  if (message.author.bot) return

  // Verify if the message is from dm
  if (message.channel.type === 'dm') {
    message.channel.send(
      'Infelizmente eu não consigo processar os comandos vindos da dm :('
    )
  }

  // Consider prefix and mention
  const prefixMention = new RegExp(`^<@!?${client.user.id}> `)
  // client.prefix = message.content.match(prefixMention)
  //   ? message.content.match(prefixMention)[0]
  //   : '!'
  if (message.content.match(prefixMention)) {
    client.prefix = message.content.match(prefixMention)[0]
  } else if (cache.get(message.guild.id)) {
    client.prefix = cache.get(message.guild.id).prefix
  } else {
    console.log('passou pela query')
    guildsdb.findOne({ id: message.guild.id }, (err, prefix) => {
      if (err) throw err
      if (!prefix) {
        const newguildsdb = guildsdb({
          id: message.guild.id
        })
        newguildsdb.save()
      }
    })
    const query = await guildsdb.findOne({ id: message.guild.id })
    client.prefix = query.prefix
    cache.set(message.guild.id, { prefix: client.prefix })
  }
  if (!client.prefix) client.prefix = '!!'

  // Verify if the message contain the prefix
  if (message.content.indexOf(client.prefix) !== 0) return

  // Our standard argument/command name definition.
  const args = message.content.slice(client.prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()

  // Search a command
  const cmd = client.commands.get(command)
  // Search a command aliases
  const aliases = client.commands.find(x => x.info.aliases.includes(command))

  // Execute the command if exists
  if (cmd) {
    cmd.run(client, message, args)
  } else if (aliases) {
    aliases.run(client, message, args)
  }
}
