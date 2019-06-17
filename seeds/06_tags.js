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
]
const tagObjects = []
for (let i = 0; i < hashtags.length - 1; i++) {
  const hashtag = {
    id: i + 1,
    hashtag: hashtags[i],
  }
  tagObjects.push(hashtag)
}
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  console.log(tagObjects)

  return knex('tags')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('tags').insert(tagObjects)
    })
}
