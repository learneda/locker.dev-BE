// Update with your config settings.

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgresql://chivo@localhost/chivo'
  },

  staging: {
    client: 'postgresql',
    connection: 'postgresql://chivo@localhost/chivo',
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}
