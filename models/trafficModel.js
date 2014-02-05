var base = require('./baseModel').BaseModel;

var TrafficModel = base.Model.extend({
  tableName: 'traffic'
});

exports.TrafficModel = TrafficModel;