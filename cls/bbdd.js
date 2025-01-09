const config = require("../config.js");
const mariadb = require('mariadb');

console.log("CONFIG", config);  

const poolConfig = {
    host: config.env.BBDD_HOST, 
    user: config.env.BBDD_USER, 
    password: config.env.BBDD_PASSWORD,
    database: config.env.BBDD_DATABASE,
    connectionLimit: Number.parseInt(config.env.BBDD_CONNECTION_LIMIT)
};

console.log("POOLCONFIG", poolConfig);

const pool = mariadb.createPool(poolConfig);

module.exports ={
    pool
}