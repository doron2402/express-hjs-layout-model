exports.counter = function(req, res){
  //TO Do
  /*
		Check for media, erate, prod, size, reffer and CampignID

		return success
  */

  //console.log(req.params);
  //console.log(req.body.media);

  var Model = require('../models/trafficModel');

  new Model.TrafficModel({campignId: req.params.campignId, media: req.body.media }).save().then(function(model){
  	console.log(model);
  	return res.json({ data: 'success' });	
  });


  return res.json({ error: 'something went wrong...'});
  



};