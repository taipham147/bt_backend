require('dotenv').config()
module.exports = {
  HOST: process.env.MYSQL_HOST ,
  PORT: "3306",
  USER: process.env.MYSQL_USERNAME ,
  PASSWORD: process.env.MYSQL_PASSWORD,
  DB: "tutorials",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
