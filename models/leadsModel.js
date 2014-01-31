var base = require('./baseModel').LeadsMySql;

var LeadModel = base.Model.extend({
  tableName: 'leads'
});

exports.LeadModel = LeadModel;