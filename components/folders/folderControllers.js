const helpers = require('./folderHelpers')
const utils = require('../../utils/getRequestUser')

module.exports = {
  async createFolder(req, res, next) {
    const { folder_name } = req.body
    const user_id = req.user.id
    if (!folder_name) {
      return res
        .status(404)
        .json({ err: 'must include folder_name in the request body.' })
    }
    try {
      const helper = await helpers.createFolder(user_id, folder_name)
      return res.status(helper.statusCode).json(helper.response)
    } catch (err) {
      return res.status(500).json({ msg: 'fatal error' })
    }
  },

  async addPost(req, res, next) {
    const { post_id, folder_id } = req.body
    const user_id = req.user.id
    if (!post_id && !folder_id) {
      return res.status(400).json({
        err: 'must include folder_id && post_id in the request body..',
      })
    }
    try {
      const helper = await helpers.addItemToFolder(user_id, req.body)
      return res.status(helper.statusCode).json(helper.response)
    } catch (err) {
      console.log(err)
      return res.status(500).json({ msg: 'fatal error' })
    }
  },
  // make sure num is a number
  async getUserFolders(req, res, next) {
    const user_id = req.params.id
    try {
      const helper = await helpers.getUserFolders(Number(user_id))
      return res.status(helper.statusCode).json(helper.response)
    } catch (err) {
      return res.status(500).json({ msg: 'fatal error' })
    }
  },
  async getPostsByFolderId(req, res, next) {
    const folder_id = req.params.id
    if (!folder_id) {
      return res
        .status(400)
        .json({ err: 'must include folder_id in query string..' })
    }
    try {
      const helper = await helpers.getPostsByFolderId(Number(folder_id))
      return res.status(helper.statusCode).json(helper.response)
    } catch (err) {
      console.log(err)
      return res.status(500).json({ msg: 'fatal error' })
    }
  },
}
