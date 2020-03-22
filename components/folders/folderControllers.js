const helpers = require('./folderHelpers')

module.exports = {
  async createFolder(req, res) {
    const { folder_name } = req.body
    const user_id = req.user.id
    if (!folder_name) {
      return res
        .status(400)
        .json({ err: 'must include folder_name in the request body.' })
    }
    try {
      const { statusCode, response } = await helpers.createFolder(
        user_id,
        folder_name
      )
      return res.status(statusCode).json(response)
    } catch ({ statusCode, response }) {
      return res.status(statusCode).json(response)
    }
  },

  async addPost(req, res) {
    const { post_id, folder_id } = req.body
    const user_id = req.user.id
    if (!post_id && !folder_id) {
      return res.status(400).json({
        err: 'must include folder_id && post_id in the request body..',
      })
    }
    try {
      const { statusCode, response } = await helpers.addItemToFolder(
        user_id,
        req.body
      )
      return res.status(statusCode).json(response)
    } catch ({ statusCode, response }) {
      return res.status(statusCode).json(response)
    }
  },
  // make sure num is a number
  async getUserFolders(req, res) {
    const user_id = req.params.id
    try {
      const { statusCode, response } = await helpers.getUserFolders(
        Number(user_id)
      )
      return res.status(statusCode).json(response)
    } catch ({ statusCode, response }) {
      return res.status(statusCode).json(response)
    }
  },
  async getPostsByFolderId(req, res) {
    const folder_id = req.params.id
    if (!folder_id) {
      return res
        .status(400)
        .json({ err: 'must include folder_id in query string..' })
    }
    try {
      const { statusCode, response } = await helpers.getPostsByFolderId(
        Number(folder_id)
      )
      return res.status(statusCode).json(response)
    } catch ({ statusCode, response }) {
      return res.status(statusCode).json(response)
    }
  },
  async updateFolderByFolderId(req, res) {
    const folder_id = req.params.id
    const name = req.body.name
    const user_id = req.user.id

    if (!folder_id && name) {
      return res.status(400).json({
        err:
          'must include folder_id in query string, and folder name in the body',
      })
    }
    try {
      const { statusCode, response } = await helpers.updateSingleFolder(
        folder_id,
        name,
        user_id
      )
      return res.status(statusCode).json(response)
    } catch ({ statusCode, response }) {
      return res.status(statusCode).json(response)
    }
  },
  async deleteFolderByFolderId(req, res) {
    const folder_id = req.params.id
    const user_id = req.user.id

    if (!folder_id) {
      return res
        .status(400)
        .json({ err: 'must include folder_id in query string..' })
    }

    try {
      const { statusCode, response } = await helpers.deleteFolderByFolderId(
        folder_id,
        user_id
      )
      return res.status(statusCode).json(response)
    } catch ({ statusCode, response }) {
      return res.status(statusCode).json(response)
    }
  },
}
