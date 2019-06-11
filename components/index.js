const router = require('express').Router()
const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')

const isDirectory = __dirname => lstatSync(__dirname).isDirectory() // checks if files are directories  true || false
const getDirectories = () =>
  readdirSync(__dirname) // files inside target directory
    .map(
      name => join(__dirname, name) //index.js & user
    )
    .filter(isDirectory)

const directoryArr = getDirectories() // Array full of all directory paths

module.exports = server => {
  require('./posts')(server)
  require('./auth')(server)
  require('./services')(server)
  require('./folders')(server)
  require('./users')(server)
  require('./comments')(server)
  require('./images')(server)
  require('./notifications')(server)
  require('./books')(server)
  require('./pocket')(server)
  require('./locker')(server)
  require('./newsfeed')(server)
}
