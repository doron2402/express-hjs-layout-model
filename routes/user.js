exports.getAllUsers = function(req, res){
	//First check for user type
	if (req.session.userType < 3){
		var UserCollection = require('../collections/usersCollection');
		console.log(UserCollection);

		return res.json(UserCollection.fetch().toJSON());
	}
	else
		return res.json({error: 'No Permission'});
};


//Get User by Id
exports.getUserId = function(req, res){

};

//Singup new user
exports.signupUser = function(req, res){
	//1. validate user details, check for mysql injection
	//2. insert to db
	var Model = require('../models/userModel'),
		crypto = require('crypto'),
  		password = crypto.createHash('sha1'),
		UserData = req.body;

	if (UserData.username && UserData.password && UserData.email){
		
		password.update(UserData.password);
		
		new Model.UserModel({ 
			username: UserData.username, 
			password:  password.digest('hex'),
			email: UserData.email || 'NULL'
		}).save().then(function(model) {
	    	//console.log(model);
	    	var session_id = crypto.createHash('sha1');
				session_id.update('#' + model.get('id') + '-' + model.get('username'));

				req.session.user_id = session_id.digest('hex');
	    	return res.json({redirect: '/admin',dataReturn: 'success' });
	  	});

	}
	else
		return res.json({redirect: '/sigup', dataReturn: 'Missing arguments'});
};

//login
exports.loginUser = function(req, res){

	if (req.body && req.body.username && req.body.password && req.body.password.length > 4){
		//Check with DB
		var Model = require('../models/userModel'),
			crypto = require('crypto'),
  			password = crypto.createHash('sha1');

			password.update(req.body.password);

			var tmp_pass = password.digest('hex');

		return new Model.UserModel({'username': req.body.username}).fetch().then(function(model){
			
			if (model.get('password') == tmp_pass)
			{
				console.log('login');
				var session_id = crypto.createHash('sha1');
				session_id.update('#' + model.get('id') + '-' + model.get('username'));

				req.session.user_id = session_id.digest('hex');
				req.session.userId = model.get('id');
				req.session.userType = model.get('type');

				return res.json({redirect: '/admin',dataReturn: 'success' });
			}	
			else
				return res.json({redirect: '/login',dataReturn: 'fail' });

			
		});
		
	}else
		return res.json({Error: 'Bad username or password'});
};

exports.logoutUser = function(req, res, next){
	delete req.session.user_id;
	delete req.session.userId;
	return res.redirect('/');
};
