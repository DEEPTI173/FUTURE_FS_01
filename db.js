const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Deepti123@",
    database: "portfolio"
});
db.connect(() => console.log("MySQL Connection"));
module.exports = db;