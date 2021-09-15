// Update with your config settings.
module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_CONNECTION_URL || {
      database: process.env.DB_LOCAL,
      user: process.env.DB_LOCAL_USER,
      password: process.env.DB_LOCAL_PASSWORD,
      host: process.env.DB_LOCAL_HOST,
    },
    useNullAsDefault: true,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'dbmigrations',
      directory: './migrations',
    },
    seeds: { directory: './seeds' },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    ssl:true,
    useNullAsDefault: true,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'dbmigrations',
      directory: './migrations',
    },
    seeds: { directory: './seeds' },
  },
}
