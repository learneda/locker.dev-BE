// Update with your config settings.

require('dotenv').config();
module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DB_LOCAL_URL
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    useNullAsDefault: true,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'dbmigrations',
      directory: './migrations'
    },
    seeds: { directory: './seeds' }
  }
};
