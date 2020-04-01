const c = require('chalk')
const process = require('process')
/**
 * @param port server port number defaults to 8000
 * @description Server awakens
 */
const logServerPrompt = port => {
  process.stdout.write(
    `\n 🦄 ${c.red('===')}${c.white('===')}${c.blue('===')} ${c.yellow('localhost')} ${c.cyan(
      'listens and obeys'
    )} ${c.magenta(`on port: ${port}`)} ${c.red('===')}${c.white('===')}${c.blue('===')}  🚀\n`
  )
}

module.exports = {
  logServerPrompt,
}
