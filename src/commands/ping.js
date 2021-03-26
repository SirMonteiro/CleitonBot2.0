const Discord = require('discord.js')
const color = require('../components/colors')

module.exports = {
  info: {
    description:
      'Mostra o tempo de resposta entre você, a casa(servidor) do Cleiton e o Discord',
    usage: 'ping',
    aliases: ['p'],
    category: 'utilidades'
  },

  run: async function (client, message, args) {
    // Set variables
    const ms = await message.channel.send('Ping?')

    // Verify ping between client and the bot
    const clientms = Math.abs(ms.createdTimestamp - message.createdTimestamp)

    // Set the embed message
    const pingembed = new Discord.MessageEmbed()
      .setTitle(':ping_pong: Pong!')
      .setColor(color())
      .addField('**Seu ping:**', clientms + 'ms')
      .addField(
        '**Ping do Cleiton com sua casa:**',
        Math.floor(client.ws.ping) + 'ms'
      )

    // Edit message to an embed with the ping
    ms.edit(pingembed)
  }
}
