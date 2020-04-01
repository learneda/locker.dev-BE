const db = require('../../dbConfig')
const folderUtils = require('./folderUtils')

module.exports = {
  async createFolder(user_id, folder_name) {
    try {
      const folderInsertRecord = await db('folders')
        .insert({
          name: folder_name,
          user_id,
        })
        .returning('*')
      return {
        statusCode: 201,
        response: { msg: 'success', folder: folderInsertRecord },
      }
    } catch (err) {
      return { statusCode: 500, response: { msg: 'something went wrong', err } }
    }
  },
  async addItemToFolder(user_id, body) {
    const { post_id, folder_id } = body
    const isOwner = await folderUtils.isOwner(user_id, folder_id)
    if (!isOwner) {
      return { statusCode: 401, response: { msg: 'not authorized' } }
    }
    try {
      const folderPostsRecord = await db('folder_posts')
        .insert({
          folder_id,
          post_id,
          user_id,
        })
        .returning('*')
      return {
        statusCode: 201,
        response: { msg: 'success', folderPostsRecord },
      }
    } catch (err) {
      return { statusCode: 500, response: { msg: 'something went wrong' } }
    }
  },
  async getUserFolders(user_id) {
    try {
      const folders = await db('folders').where({ user_id })
      if (folders) {
        return { statusCode: 200, response: { msg: 'success', folders } }
      }
      return { statusCode: 404, response: { msg: 'something went wrong?' } }
    } catch (err) {
      return { statusCode: 500, response: { msg: 'something went wrong' } }
    }
  },
  async getPostsByFolderId(folder_id) {
    try {
      const posts = await db('folder_posts as fp')
        .where({ folder_id })
        .join('posts as p', 'p.id', 'fp.post_id')
        .select(
          'p.id',
          'fp.folder_id',
          'p.user_id',
          'p.post_url',
          'p.title',
          'p.description',
          'p.thumbnail_url',
          'p.user_thoughts',
          'p.root_url',
          'p.type_id',
          'p.created_at',
          'p.updated_at'
        )
      if (posts) {
        return { statusCode: 200, response: { msg: 'success', posts } }
      }
      return { statusCode: 404, response: { msg: 'something went wrong' } }
    } catch (err) {
      return { statusCode: 500, response: { msg: 'fatal error' } }
    }
  },
  async getSingleFolder(folder_id) {
    try {
      const folder = await db('folders')
        .where({ id: folder_id })
        .first()
      return { statusCode: 200, response: { msg: 'success', folder } }
    } catch (e) {
      return { statusCode: 500, response: { msg: 'fatal error' } }
    }
  },
  async updateSingleFolder(folder_id, name, user_id) {
    const isOwner = await folderUtils.isOwner(user_id, folder_id)
    if (!isOwner) {
      return { statusCode: 401, response: { msg: 'not authorized' } }
    }
    try {
      const updatedFolder = await db('folders')
        .where({ id: folder_id })
        .update({
          name,
        })
        .returning('*')
      return { statusCode: 200, response: { msg: 'success', updatedFolder } }
    } catch (err) {
      return { statusCode: 500, response: { msg: 'fatal error' } }
    }
  },
  async deleteFolderByFolderId(folder_id, user_id) {
    const isOwner = await folderUtils.isOwner(user_id, folder_id)
    if (!isOwner) {
      return { statusCode: 401, response: { msg: 'not authorized' } }
    }

    try {
      await db('folders')
        .where({ id: folder_id })
        .del()
        .returning('*')
      return { statusCode: 204, response: { msg: 'successfully deleted' } }
    } catch (err) {
      return { statusCode: 500, response: { msg: 'fatal error' } }
    }
  },
}
