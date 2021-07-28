const urlMetadata = require('url-metadata')

async function getUrlsMetadata(arr) {
  const metaPromises = arr.map(url => urlMetadata(url))

  try {
    const responses = await Promise.allSettled(metaPromises)
    return responses
      .filter(res => res.status === 'fulfilled')
      .map(response => {
        const { url, title, image, description } = response.value
        const article = {
          url,
          title,
          thumbnail: image,
          description,
        }
        return article
      })
  } catch (err) {
    console.log('runThruUrlMetadata err', err)
    return err
  }
}

module.exports = getUrlsMetadata
