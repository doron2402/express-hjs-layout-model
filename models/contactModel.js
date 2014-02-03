var base = require('./baseModel').LeadsMySql;

var ContactModel = base.Model.extend({
  tableName: 'contacts'
});

exports.ContactModel = ContactModel;