const mysql = require('mysql2');

var host = 'localhost';
if (process.env.NODE_ENV == 'production') {
    host = 'mysql-server';
}

const db = mysql.createConnection({
    host: host,
    user: 'admin',
    password: 'password',
    database: 'kshop'
});

db.connect((err) => {
    if (err) {
        console.log('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

module.exports = db;
