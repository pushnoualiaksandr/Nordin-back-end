require('dotenv').config();

module.exports = {
    development: {
        username: process.env.SEQUELIZE_USERNAME || 'postgres',
        password: process.env.SEQUELIZE_PASSWORD || 'root',
        database: process.env.SEQUELIZE_DB || 'med',
        host: process.env.SEQUELIZE_HOST || 'localhost',
        port: process.env.SEQUELIZE_PORT || 5432,
        dialect: 'postgres',
        logging: process.env.DEBUG_MODE === '1' ? console.log : false,
    },
    test: {
        username: process.env.SEQUELIZE_USERNAME || 'postgres',
        password: process.env.SEQUELIZE_PASSWORD || 'root',
        database: process.env.SEQUELIZE_DB_TEST || 'med_test',
        host: process.env.SEQUELIZE_HOST || 'localhost',
        port: process.env.SEQUELIZE_PORT || 5432,
        dialect: 'postgres',
        logging: false,
    },
    production: {
        username: process.env.SEQUELIZE_USERNAME || 'postgres',
        password: process.env.SEQUELIZE_PASSWORD || 'root',
        database: process.env.SEQUELIZE_DB || 'med',
        host: process.env.SEQUELIZE_HOST || 'localhost',
        port: process.env.SEQUELIZE_PORT || 5432,
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            idle: 10000,
            acquire: 10000,
        },
    },
};
