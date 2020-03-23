const { blue, cyan, magenta, red, white, yellow } = require('chalk')
/**
 * @param port server port number defaults to 8000
 * @description Server awakens
 */
const logServerPrompt = (port: number) => {
  console.log(
    `\n 🦄 ${red('===')}${white('===')}${blue('===')} ${yellow('localhost')} ${cyan('listens and obeys')} ${magenta(
      `on port: ${port}`
    )} ${red('===')}${white('===')}${blue('===')}  🚀\n`
  )
}

module.exports = {
  ...require('./generateToken'),
  ...require('./getRequestUser'),
  logServerPrompt,
}
