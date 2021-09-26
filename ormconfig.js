const path = require('path');
module.exports = {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    entities: [path.join(__dirname, '**', '*.entity.js')],
    logging: true,
    migrations: [__dirname + '/dist/migrations/*.js'],
    cli: {
        migrationsDir: 'src/migrations',
    },
};