var base = require('./baseModel').BaseModel;

var ContactModel = base.Model.extend({
  tableName: 'contacts'
});

exports.ContactModel = ContactModel;