exports.getCampignCaredentialByUserId = function(req, res){
   
   var Mysql = require('../lib/mysqlKnex');

   
   if (req.body.userId > 0){

		return Mysql.MysqlKnex('cardential').where('userId',parseInt(req.body.userId,10))
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
