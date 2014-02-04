exports.newContactInformation = function(req,res){
	
	var selfData = req.body;
	var Model = require('../models/contactModel');
	console.log('Self Data');
	console.log(selfData);

	if (selfData && selfData.fname && selfData.lname && selfData.phone && selfData.email){

		return new Model.ContactModel({
			name: selfData.fname + ' ' + selfData.lname,
			phone: selfData.phone || 'NULL',
			email: selfData.email || 'NULL',
			message: selfData.msg || 'NULL'
			})
			.save()
			.then(function(model) {

				return res.json({model: model,redirect: '/admin',dataReturn: 'success' });
			});

	}
	else{
		return res.json({dataReturn: 'error', error: 'Wrong params' });
	}

	
};