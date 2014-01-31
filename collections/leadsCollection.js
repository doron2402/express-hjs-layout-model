var base = require('./baseCollection').MySql;

var LeadModel = base.Model.extend({
  		tableName: 'leads'
	});

var LeadsCollection = base.Collection.extend({
  		model: LeadModel
	});

exports.LeadsCollection = LeadsCollection;
