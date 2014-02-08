var Mysql = require('../lib/mysqlKnex');
var Model = require('../models/campignModel');

/* 
	Create a new campign from admin page 
*/
exports.createNewCampign = function(req,res){
	if (req.body && req.body.name && req.body.url){
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
