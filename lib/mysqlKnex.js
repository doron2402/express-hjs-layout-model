var Knex = require('knex'),
	knex = Knex.initialize({
  client: 'mysql',
  connection: {
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'leads',
    charset  : 'utf8',
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
  }
});

exports.MysqlKnex = knex;