var Knex = require('knex'),
	knex = Knex.initialize({
  client: 'mysql',
  connection: {
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'leads',
    charset  : 'utf8',
  }
});

exports.MysqlKnex = knex;