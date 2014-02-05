var base = require('./baseModel').BaseModel;

var CampignModel = base.Model.extend({
  tableName: 'campigns'
});

exports.CampignModel = CampignModel;