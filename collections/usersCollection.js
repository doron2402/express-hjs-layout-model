var base = require('./baseCollection').MySql;

var UserModel = base.Model.extend({
  		tableName: 'users'
	});

var UsersCollection = base.Collection.extend({
  		model: UserModel
	});

exports.UsersCollection = UsersCollection;
