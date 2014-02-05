var Mysql = require('../lib/mysqlKnex');


exports.newCampign = function(req, res){

  var Model = require('../models/campignModel');
	
	
	if (req.params.campignId > 0){

	  return new Model.TrafficModel({
	  	campignId: req.params.campignId,
	  	prod: req.body.prod || 'NULL',
	  	channel: req.body.channel || 'NULL',
	  	media: req.body.media || 'NULL',
	  	size: req.body.size || 'NULL',
	  	reffer: req.body.reffer || 'NULL',
	  	erate: req.body.erate || 'NULL',
	  	dayOfWeek: new Date().getDay()
	  	}).save().then(function(model,err){
	  	if (err)
	  		console.log('Error : %s', err);

	  	console.log(model);
	  	return res.json({ data: 'success' });	
	  });  	
	}
  	console.log('here..');

};

exports.deleteCampign = function(req, res){

  var Model = require('../models/campignModel');
	
	
	if (req.params.campignId > 0){

	  return new Model.TrafficModel({
	  	campignId: req.params.campignId,
	  	prod: req.body.prod || 'NULL',
	  	channel: req.body.channel || 'NULL',
	  	media: req.body.media || 'NULL',
	  	size: req.body.size || 'NULL',
	  	reffer: req.body.reffer || 'NULL',
	  	erate: req.body.erate || 'NULL',
	  	dayOfWeek: new Date().getDay()
	  	}).save().then(function(model,err){
	  	if (err)
	  		console.log('Error : %s', err);

	  	console.log(model);
	  	return res.json({ data: 'success' });	
	  });  	
	}
  	console.log('here..');

};

exports.information = function(req, res) {

   if (parseInt(req.body.campignId,10) > 0 ){

		return Mysql.MysqlKnex('cardential').where('userId',parseInt(req.session.userId,10))
		.andWhere('campignId','=',parseInt(req.body.campignId,10))
  		.join('campigns', function() {
      		this.on('cardential.campignId', '=', 'campigns.id');
  		}).exec(function(err, resp) { 
  			
  			console.log(resp);
			res.json(resp);
  		});

  		

   }//eo if

   res.header("Access-Control-Allow-Origin", "*");
   res.json({error: 'Missing arguments'});
};
