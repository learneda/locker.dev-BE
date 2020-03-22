export * from './generateToken'
export * from './getRequestUser'
import { blue, cyan, magenta, red, white, yellow } from 'chalk'
/**
 * @param port {number} server port number defaults to 8000
 * @description Logs to the console that server is up and running along with port number
 */
export const logServerPrompt = port => {
  console.log(
    `\n 🦄 ${red('===')}${white('===')}${blue('===')} ${yellow('localhost')} ${cyan('listens and obeys')} ${magenta(
      `on port: ${port}`
    )} ${red('===')}${white('===')}${blue('===')}  🚀\n`
  )
}
