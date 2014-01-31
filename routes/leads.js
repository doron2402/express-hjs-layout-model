/*
	curl -X POST 
	-H "Content-Type: application/json" 
	-d '{fname": "Doron", "lname": "Segal",media" : "Boaz ata homo"}' 
	http://localhost:3000/lead/123
*/
exports.listAllLeadsByCampignId = function(req, res){
  res.send("respond with a resource");
};

exports.listLeadsByMedia = function(req, res){
	
};

exports.newLead = function(req, res){

  var Model = require('../models/leadsModel');
	
	if (req.params.campignId > 0){

	  //Get Name 
	  var Name = 'NULL';
	  if (req.body.name)
	  	Name = req.body.name;
	  else if (req.body.fname){
	  	Name = req.body.fname;
	  	if (req.body.lname)
	  		Name += ' ' + req.body.lname;
	  }

	  console.log(req.body.trafficId || 'NULL');

	  return new Model.LeadModel({
	  	id: req.body.trafficId || 'NULL',
	  	campignId: req.params.campignId,
	  	name: Name,
	  	email: req.body.email || 'NULL',
	  	phone: req.body.phone || 'NULL',
	  	message: (req.body.message || req.body.msg) || 'NULL',
	  	fields: req.body.fields || 'NULL',
	  	dayOfWeek: new Date().getDay(),
	  	media: req.body.media || 'NULL',
	  	prod: req.body.prod || 'NULL',
	  	erate: req.body.erate || 'NULL',
	  	channel: req.body.channel || 'NULL',
	  	size: req.body.size || 'NULL',
	  	reffer: req.body.reffer || 'NULL' 	
	  	}).save({},{method: 'insert'}).then(function(model,err){
	  	if (err)
	  		console.log('Error : %s', err);
	  	
	  	return res.json({ data: 'success', id: model.get('id'),  campignId: model.get('campignId') });	
	  });  	
	}

	return res.json({ error: 'Something went wrong '})
};