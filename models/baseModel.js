var Bookshelf = require('Bookshelf'),
	MySql = Bookshelf.initialize({
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'root',
    password : 'root',
    database : 'leads',
    charset  : 'utf8'
  }
});

exports.LeadsMySql = MySql;

