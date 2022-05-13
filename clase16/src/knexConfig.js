const dbConfig = {
    host: '127.0.0.1',
    port: 3306,
    user: 'coder',
    password: 'passwordCoder',
    database: 'backEnd_CoderHouse'
}

export const knexConfig = {
    client: 'mysql2',
    connection: dbConfig
}