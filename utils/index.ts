export * from './generateToken'
export * from './getRequestUser'
import { blue, cyan, magenta, red, white, yellow } from 'chalk'
/**
 * @param port server port number defaults to 8000
 * @description Server awakens
 */
export const logServerPrompt = (port: number) => {
  console.log(
    `\n 🦄 ${red('===')}${white('===')}${blue('===')} ${yellow('localhost')} ${cyan('listens and obeys')} ${magenta(
      `on port: ${port}`
    )} ${red('===')}${white('===')}${blue('===')}  🚀\n`
  )
}
