const welcomeEmailTemplate = require('./welcomeEmailTemplate')

module.exports = function createWelcomeEmail(userEmailAddress, userName) {
  return {
    to: userEmailAddress,
    from: 'info@learnlocker.dev',
    subject: 'Welcome to locker.dev!',
    html: welcomeEmailTemplate(userName),
  }
}
