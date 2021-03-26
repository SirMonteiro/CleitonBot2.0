const Discord = require('discord.js')
const color = require('../components/colors')

module.exports = {
  info: {
    description: 'Esse comando mostra o que faz todos os comandos do Cleiton',
    usage: 'help | help [comando/categoria]',
    aliases: ['h', 'ajuda'],
    category: 'utilidades'
  },

  run: async function (client, message, args) {
    // Set variables
    const commands = []
    let helpmes = ''
    const helppembed = new Discord.MessageEmbed()
      .setTitle(':mag_right: Ajuda do Cleiton')
      .setColor(color())
      .setFooter(`Use ${client.prefix} antes de qualquer comando!`)

    // Verify if don't have an argument
    if (!args[0]) {
      const helpembed = new Discord.MessageEmbed()
        .setTitle(':mag_right: Ajuda do Cleiton')
        .setColor(color())
        .addField(':moneybag: Moeda', `\`${client.prefix}help moeda\``, true)
        .addField(':game_die: Jogos', `\`${client.prefix}help jogos\``, true)
        .addField(
          ':joy: Entreterimento',
          `\`${client.prefix}help entreterimento\``,
          true
        )
        .addField(
          ':tools: Utilidades',
          `\`${client.prefix}help utilidades\``,
          true
        )
        .addField(
          ':gear: Admin e config',
          `\`${client.prefix}help config\``,
          true
        )
        .setFooter(`Use ${client.prefix} antes de qualquer comando!`)
      message.channel.send(helpembed)
      return
    }

    // Verify if you want a help from a category or command
    // if (
    //   !["moeda", "jogos", "entreterimento", "utilidades", "config"].includes(args[0]) &&
    //   !client.CommandsNameArray.includes(args[0])
    // )
    //   return message.channel.send("Categoria/comando não encontrada :(");

    // Verify if its a command or a category and set the entire message
    if (
      ['moeda', 'jogos', 'entreterimento', 'utilidades', 'config'].includes(
        args[0]
      )
    ) {
      for (const [key] of client.commands.filter(
        x => x.info.category === args[0].toLowerCase()
      )) {
        commands.push(key)
      }

      commands.forEach(command => {
        helpmes += `**${command}**\nDescrição: ${
          client.commands.get(command).info.description
        }\nUso: ${
          client.prefix + client.commands.get(command).info.usage
        }\nApelidos: ${client.commands
          .get(command)
          .info.aliases.toString()
          .replace(',', ', ')}\n`
        helppembed.setDescription(helpmes)
      })
    } else {
      let command = client.commands.get(args[0])
      if (!command) {
        command = client.commands.find(x => x.info.aliases.includes(args[0]))
      }
      if (!command) {
        helppembed.setDescription('Comando não encontrado :(')
        return message.channel.send(helppembed)
      }

      helpmes = `**${args[0]}**\nUso: ${command.info.description}\nApelidos: ${command.info.aliases}`
      helppembed.setDescription(
        `Comando: **${
          client.commands
            .filter(x => x === command)
            .keys()
            .next().value
        }**`
      )
      helppembed.addFields(
        { name: 'Descrição', value: command.info.description },
        { name: 'Uso', value: client.prefix + command.info.usage },
        { name: 'Categoria', value: command.info.category, inline: true },
        {
          name: 'Apelidos',
          value: command.info.aliases.toString().replace(',', ', '),
          inline: true
        }
      )
    }
    // Send the help message
    message.channel.send(helppembed)
  }
}
