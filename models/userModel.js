var base = require('./baseModel').LeadsMySql;

var UserModel = base.Model.extend({
  tableName: 'users'
});

exports.UserModel = UserModel;