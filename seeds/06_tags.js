const hashtags = [
  'react',
  'javascript',
  'webdev',
  'beginners',
  'typescript',
  'git',
  'hiring',
  'discuss',
  'career',
  'productivity',
  'tutorial',
  'css',
  'python',
  'node',
  'showdev',
  'opensource',
  'php',
  'ruby',
  'java',
  'html',
  'testing',
  'devops',
  'help',
  'vue',
  'ios',
  'rails',
  'go',
  'docker',
  'angular',
  'sql',
  'knex',
]
const createTagObj = (hashtag, i) => {
  return { id: i + 1, hashtag }
}
const tagObjects = hashtags.map(createTagObj)

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('tags')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('tags').insert(tagObjects)
    })
}
