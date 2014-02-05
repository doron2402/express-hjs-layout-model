var base = require('./baseModel').BaseModel;

var LeadModel = base.Model.extend({
  tableName: 'leads'
});

exports.LeadModel = LeadModel;