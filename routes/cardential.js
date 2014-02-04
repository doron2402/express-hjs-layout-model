exports.getCampignCaredentialByUserId = function(req, res){
   
   var Collection = require('../collections/cardentialCollection'),
   	   Collection2 = require('../collections/campignCollection');

   
   if (req.body.userId > 0){
	
	var qb = new Collection.CardentialCollection().query();
	
	return qb.where({userId: req.body.userId}).select().then(function(resp,err) {
		if (err)
			console.log('err %s',err);
			
			console.log(resp);
			res.header("Access-Control-Allow-Origin", "*");
			res.json(resp);

			var qb2 = new Collection2.
		});
   }//eo if

   res.header("Access-Control-Allow-Origin", "*");
   res.json({error: 'Missing arguments'});
};
