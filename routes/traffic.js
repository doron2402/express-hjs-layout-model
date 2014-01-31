exports.counter = function(req, res){
  //TO Do
  /*
		Check for media, erate, prod, size, reffer and CampignID

		return success
  */

  //console.log(req.params);
  //console.log(req.body.media);

  var Model = require('../models/trafficModel');
	
  return new Model.TrafficModel({id: null, campignId: req.params.campignId, media: req.body.media }).save().then(function(model,err){
  	if (err)
  		console.log('Error : %s', err);

  	console.log(model);
  	return res.json({ data: 'success' });	
  });  

};