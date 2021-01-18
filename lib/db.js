const mysql = require('mysql');


const db = mysql.createConnection({
	host:'localhost',
	user:'root',
	password: 'kmil1103',
	database: 'nodejs_sql'
});
db.connect();

module.exports = db;

