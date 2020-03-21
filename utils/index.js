const { cyan, magenta, yellow, red, white, blue } = require('chalk')

exports.logServerPrompt = port => {
  console.log(
    `\n 🦄 ${red('===')}${white('===')}${blue('===')} ${yellow(
      'localhost'
    )} ${cyan('listens and obeys')} ${magenta(`on port: ${port}`)} ${red(
      '==='
    )}${white('===')}${blue('===')}  🚀\n`
  )
}
