var Mysql = require('../lib/mysqlKnex');

exports.getAllLeads = function(req, res){

   if (parseInt(req.params.campignId,10) > 0 || parseInt(req.body.campignId, 10) > 0){
	
		if (req.body && req.body.media){ /* Leads from specific media */
		
		//Clearing string for mysql injection
		var mediaTmp = req.body.media.toString(),
			media = mediaTmp.replace(/[^a-z0-9]/gi, "");

		return Mysql.MysqlKnex('cardential')
		.where('userId',parseInt(req.session.userId,10))
		.andWhere('cardential','=',1)
		.andWhere('leads.campignId','=',parseInt(req.body.campignId,10))
		.andWhere('leads.media','=',media)
		.join('leads', function(){
			this.on('cardential.campignId', '=', 'leads.campignId');
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
		.andWhere('leads.campignId','=',parseInt(req.body.campignId,10))
		.join('leads', function(){
			this.on('cardential.campignId', '=', 'leads.campignId');
		}).exec(function (err, response) {
			
			if (err){
				console.log(err);
				res.json({'Error':'Something Went Wrong...'});
		 	}
				console.log(response);
				res.json(response);
		});
	}
	
   }//eo if

   res.json({error: 'Missing arguments'});
};



//Get Campign Id and Media -> Return an array of leads
exports.getLeadByMedia = function(req, res){

};


/*
	Enter new leads to the system

	curl -X POST 
	-H "Content-Type: application/json" 
	-d '{fname": "Doron", "lname": "Segal",media" : "Facebook", "size":"120x120"}' 
	http://localhost:3000/lead/123
*/
exports.newLead = function(req, res){

  var Model = require('../models/leadsModel');
	
	if (req.params && req.params.campignId > 0){

	  //Get Name 
	  var Name = 'NULL';
	  if (req.body && req.body.name)
	  	Name = req.body.name;
	  else if (req.body && req.body.fname){
	  	Name = req.body.fname;
	  	if (req.body.lname)
	  		Name += ' ' + req.body.lname;
	  }

	  return new Model.LeadModel({
	  	id: (req.body && req.body.trafficId)? req.body.trafficId : 'NULL',
	  	campignId: req.params.campignId,
	  	name: Name,
	  	email: (req.body && req.body.email) ? req.body.email : 'NULL',
	  	phone: (req.body && req.body.phone) ? req.body.phone : 'NULL',
	  	message: (req.body && req.body.message) ? req.body.message : 'NULL',
	  	fields: (req.body && req.body.fields) ? req.body.fields : 'NULL',
	  	dayOfWeek: new Date().getDay(),
	  	media: (req.body && req.body.media) ? req.body.media : 'NULL',
	  	prod: (req.body && req.body.prod) ? req.body.prod : 'NULL',
	  	erate: (req.body && req.body.erate) ? req.body.erate : 'NULL',
	  	channel: (req.body && req.body.channel) ? req.body.channel : 'NULL',
	  	size: (req.body && req.body.size) ? req.body.size : 'NULL',
	  	reffer: (req.body && req.body.reffer) ? req.body.reffer : 'NULL',
	  	}).save({},{method: 'insert'}).then(function(model,err){
	  	if (err)
	  		console.log('Error : %s', err);
	  	
	  	return res.json({ data: 'success', id: model.get('id'),  campignId: model.get('campignId') });	
	  });  	
	}

	return res.json({ error: 'Something went wrong '})
};