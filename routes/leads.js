/*
	curl -X POST 
	-H "Content-Type: application/json" 
	-d '{fname": "Doron", "lname": "Segal",media" : "Boaz ata homo"}' 
	http://localhost:3000/lead/123
*/
exports.getAllLeads = function(req, res){
   var Collection = require('../collections/leadsCollection');
   //Todo: Authenticate user and user.type
   console.log(req);

   if (req.params.campignId > 0){
	


	var qb = new Collection.LeadsCollection().query();
	
	return qb.where({campignId: req.params.campignId}).select().then(function(resp,err) {
		if (err)
			console.log('err %s',err);
			
			console.log(resp);
			res.header("Access-Control-Allow-Origin", "*");
			res.json(resp);

		});
   }

   res.header("Access-Control-Allow-Origin", "*");
   res.json({error: 'Missing arguments'});
};



//Get Campign Id and Media -> Return an array of leads
exports.getLeadByMedia = function(req, res){

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