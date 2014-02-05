var Bookshelf = require('Bookshelf'),
	MySql = Bookshelf.initialize({
  client: 'mysql',
  connection: {
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'leads',
    charset  : 'utf8'
  }
});

exports.MySql = MySql;
exports.Bookshelf = Bookshelf;

