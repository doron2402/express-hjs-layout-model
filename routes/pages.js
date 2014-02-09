
/*
 * GET Static Pages.
 */
var Mysql = require('../lib/mysqlKnex');

//About
exports.about = function(req, res){
  res.render('pages/about', { title: 'About' });
};
//Contact
exports.contact = function(req, res){
	res.render('pages/contact', { title: 'Contact' });
};
//Faq
exports.faq = function(req, res){
	res.render('pages/faq', { title: 'FAQ' });	
};

//return a json with all faq
exports.getFaq = function(req, res){
	return Mysql.MysqlKnex.raw('select * from `faq`').then(function(resp){
		if (resp[0] === undefined)
			return res.json({error: 'Something went wrong'});

		return res.json(resp[0]);	
	})
	
};

exports.index = function(req, res){
  res.render('index', { title: 'SpeedLeads' });
};