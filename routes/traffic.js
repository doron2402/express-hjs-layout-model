var Mysql = require('../lib/mysqlKnex');

exports.counter = function(req, res){

/*
	curl -X POST 
	-H "Content-Type: application/json" 
 	-d '{"media" : "Boaz ata homo"}' 
	http://localhost:300/traffic/123
*/

  var Model = require('../models/trafficModel');	
	
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
	  	},{insert: true}).save().then(function(model,err){
	  	if (err)
	  		console.log('Error : %s', err);

	  	return res.json({ data: 'success', id: model.get('id') });	
	  });  	
	}

};

exports.getAllTraffic = function (req, res) {
	console.log('get All Traffic for campignId: ' + req.body.campignId);
	
	if (req.body && req.body.media){ /* Traffic from specific media */
		
		//Clearing string for mysql injection
		var mediaTmp = req.body.media.toString(),
			media = mediaTmp.replace(/[^a-z0-9]/gi, "");

		return Mysql.MysqlKnex('cardential')
		.where('userId',parseInt(req.session.userId,10))
		.andWhere('cardential','=',1)
		.andWhere('traffic.campignId','=',parseInt(req.body.campignId,10))
		.andWhere('traffic.media','=',media)
		.join('traffic', function(){
			this.on('cardential.campignId', '=', 'traffic.campignId');
		}).exec(function (err, response) {
			
			if (err){
				console.log(err);
				res.json({'Error':'Something Went Wrong...'});
		 	}
				console.log(response);
				res.json(response);
		});

		return res.json({'error':'nada'});
	}
	else /*This query will run for a user with 'cardential.cardential' == 1 meaning the user have access to everything in the speicific campign */ 
	{

		return Mysql.MysqlKnex('cardential')
		.where('userId',parseInt(req.session.userId,10))
		.andWhere('cardential','=',1)
		.andWhere('traffic.campignId','=',parseInt(req.body.campignId,10))
		.join('traffic', function(){
			this.on('cardential.campignId', '=', 'traffic.campignId');
		}).exec(function (err, response) {
			
			if (err){
				console.log(err);
				res.json({'Error':'Something Went Wrong...'});
		 	}
				console.log(response);
				res.json(response);
		});
	}
	
};