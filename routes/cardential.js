var Mysql = require('../lib/mysqlKnex');

exports.getCampignCaredentialByUserId = function(req, res){
  
		return Mysql.MysqlKnex('cardential').where('userId',parseInt(req.session.userId,10))
  		.join('campigns', function() {
      		this.on('cardential.campignId', '=', 'campigns.id');
  		}).exec(function(err, resp) { 
  			console.log(resp);
			res.json(resp);
  		});

   res.header("Access-Control-Allow-Origin", "*");
   res.json({error: 'Missing arguments'});
};
