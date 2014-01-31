exports.counter = function(req, res){
  //TO Do
  /*
		Check for media, erate, prod, size, reffer and CampignID

		return success
  */

  //console.log(req.params);
  //console.log(req.body.media);

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
	  	}).save().then(function(model,err){
	  	if (err)
	  		console.log('Error : %s', err);

	  	console.log(model);
	  	return res.json({ data: 'success' });	
	  });  	
	}
  	console.log('here..');

};