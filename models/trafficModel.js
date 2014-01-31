var base = require('./baseModel').LeadsMySql;

var TrafficModel = base.Model.extend({
  tableName: 'traffic'
});

exports.TrafficModel = TrafficModel;