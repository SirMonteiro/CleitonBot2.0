require('dotenv').config()
const fs = require('fs')
const { Collection, Client } = require('discord.js')
const { connect } = require('mongoose')

// Set variables
const client = new Client()
client.commands = new Collection()
client.CommandsNameArray = []

// Get all events from /events folder
fs.readdir('./src/events/', (err, files) => {
  if (err) return console.error(err)
  files.forEach(file => {
    if (!file.endsWith('.js')) return
    const event = require(`./events/${file}`)
    const eventName = file.split('.')[0]
    client.on(eventName, event.bind(null, client))
    delete require.cache[require.resolve(`./events/${file}`)]
  })
})

// Get all commands from /commands folder
fs.readdir('./src/commands/', (err, files) => {
  if (err) return console.error(err)
  files.forEach(file => {
    if (!file.endsWith('.js')) return
    const props = require(`./commands/${file}`)
    const commandName = file.split('.')[0]
    client.CommandsNameArray.push(commandName)
    console.log(`Attempting to load command ${commandName}`)
    client.commands.set(commandName, props)
  })
})

// Login on discord
// client.login(process.env.TOKEN)

connect(
  process.env.MONGODB_URI,
  {
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASS,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  },
  err => {
    if (err) {
      console.log('Error on Database, Killing bot...')
      setTimeout(() => {
        process.exit()
      }, 10)
    } else {
      client.login(process.env.TOKEN)
    }
  }
)
