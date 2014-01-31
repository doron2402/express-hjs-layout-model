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