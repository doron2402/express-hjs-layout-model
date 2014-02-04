var base = require('./baseCollection').MySql;

var CampignModel = base.Model.extend({
  		tableName: 'campigns'
	});

var CampignCollection = base.Collection.extend({
  		model: CampignModel
	});

exports.CampignCollection = CampignCollection;
