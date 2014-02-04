var base = require('./baseCollection').MySql;

var CardentialModel = base.Model.extend({
  		tableName: 'cardential'
	});

var CardentialCollection = base.Collection.extend({
  		model: CardentialModel
	});

exports.CardentialCollection = CardentialCollection;
