var Bookshelf = require('Bookshelf'),
	MySql = Bookshelf.initialize({
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

exports.BaseModel = MySql;
