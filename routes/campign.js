var Mysql = require('../lib/mysqlKnex');
var Model = require('../models/campignModel');

/* 
	Create a new campign from admin page 
*/
exports.createNewCampign = function(req,res){
	if (req.body && req.body.name && req.body.url && req.session.userType < 3){
		//First check if campign code is already being used
		return Mysql.MysqlKnex.raw('select count(*) as `campignCode` from campigns where id = ' + parseInt(req.body.code,10))
			.then(function(resp){
				if (resp[0][0].campignCode == 0)
				{
					return Mysql.MysqlKnex('campigns').insert({
						id: parseInt(req.body.code,10),
						name: req.body.name,
						url: req.body.url,
						startAt: req.body.startDate || 'NULL',
						endAt: req.body.endDate || 'NULL',
						clientId: req.body.clientId !== undefined ? req.body.clientId.split('-')[0] : 'NULL',
						clientName: req.body.clientId !== undefined ? req.body.clientId.split('-')[1] : 'NULL',
						adminUser: req.session.userId,
						media: req.body.media || 'NULL',
						campignManagerName: req.body.managerName || 'NULL',
						campignManagerEmail: req.body.managerEmail || 'NULL',
						campignManagerPhone: req.body.managerPhone || 'NULL',
						notes: req.body.note || 'NULL',
						emailReportLeads: req.body.emails || 'NULL'
					}).then(function(err, response){
			        	if (err)
			          		console.log(err);

			        	return res.json({data: response});
			     	});
				}else{
					console.log('Campign code is already in use, adding 1');
					return Mysql.MysqlKnex('campigns').insert({
						id: parseInt(req.body.code,10)+1,
						name: req.body.name,
						url: req.body.url,
						startAt: req.body.startDate || 'NULL',
						endAt: req.body.endDate || 'NULL',
						clientId: req.body.clientId.split('-')[0] || 'NULL',
						clientName: req.body.clientId.split('-')[1] || 'NULL',
						adminUser: req.session.userId,
						media: req.body.media || 'NULL',
						campignManagerName: req.body.managerName || 'NULL',
						campignManagerEmail: req.body.managerEmail || 'NULL',
						campignManagerPhone: req.body.managerPhone || 'NULL',
						notes: req.body.note || 'NULL',
						emailReportLeads: req.body.emails || 'NULL'
					}).then(function(err, response){
			        	if (err)
			          		console.log(err);

			        	return res.json({data: response});
			     	});
				}
				return res.json({data: resp});
			});
	}
	else
		return res.json({error: 'Missing arguments' });
};


exports.getAllCampigns = function(req, res) {
	
	console.log(req.session.userType);

	if (req.session.userType < 3){
		console.log('getAllCampigns');
		return Mysql.MysqlKnex.raw('select * from `campigns`').then(function(response){
			
			return res.json(response[0]);
		});
	}else{
		return res.json({error: 'User dont have an access'});
	}
};

exports.information = function(req, res) {

   if (parseInt(req.body.campignId,10) > 0 ){

		return Mysql.MysqlKnex('cardential').where('userId',parseInt(req.session.userId,10))
		.andWhere('campignId','=',parseInt(req.body.campignId,10))
  		.join('campigns', function() {
      		this.on('cardential.campignId', '=', 'campigns.id');
  		}).exec(function(err, resp) { 
  			
  			//console.log(resp);
			res.json(resp);
  		});

  		

   }//eo if

   res.header("Access-Control-Allow-Origin", "*");
   res.json({error: 'Missing arguments'});
};
