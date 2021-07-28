const { cyan, magenta, yellow, red, white, blue } = require('chalk')
/**
 * @param port {number} server port number defaults to 8000
 * @description Logs to the console that server is up and running along with port number
 */
const logServerPrompt = port => {
  console.log(
    `\n 🦄 ${red('===')}${white('===')}${blue('===')} ${yellow('localhost')} ${cyan('listens and obeys')} ${magenta(
      `on port: ${port}`
    )} ${red('===')}${white('===')}${blue('===')}  🚀\n`
  )
}

module.exports = {
  ...require('./getRequestUser'),
  ...require('./generateToken'),
  logServerPrompt,
  createWelcomeEmail: require('./createWelcomeEmail'),
  handleScrapping: require('./handleScrapping'),
  getUrlsMetadata: require('./getUrlsMetadata'),
}
