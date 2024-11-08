const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'mysql',
    user: 'admin',
    password: 'password',
    database: 'kshop'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

module.exports = db;
