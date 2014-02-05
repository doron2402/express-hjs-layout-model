var base = require('./baseModel').BaseModel;

var UserModel = base.Model.extend({
  tableName: 'users'
});

exports.UserModel = UserModel;