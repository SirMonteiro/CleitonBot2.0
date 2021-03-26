module.exports = async client => {
  // Log on the console when server starts
  console.log(
    `[API] Logged in as ${client.user.username}, in ${client.guilds.cache.size} servers`
  )

  // Set bot activity on Discord
  await client.user.setActivity('Cleiton 2.0', {
    type: 'PLAYING' // can be LISTENING, WATCHING, PLAYING, STREAMING
  })
}
