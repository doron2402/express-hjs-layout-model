var Mysql = require('../lib/mysqlKnex');
/* 
	Return an array of user list
	a user can see only greater type than himself, for example if my user type=1 I can see all user type 2 and 4. (not 1 or 0)
*/
exports.getAllUsers = function(req, res){
	//First check for user type is 0,1,2
	//0 - Admin , 1 - Manager, 2 - account manager
	if (req.session.userType < 3){
		return Mysql.MysqlKnex('users').select().where('type', '>=', parseInt(req.session.userType,10)).then(function(resp){
			return res.json(resp);
		});
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
			name: UserData.name || 'NULL',
			email: UserData.email || 'NULL',
			password:  password.digest('hex'),
			username: UserData.username,
			type: parseInt(UserData.type,10) || '4',
			phone: UserData.phone || 'NULL',
			company: UserData.company_name || 'NULL',
			companySite: UserData.company_website || 'NULL'
		}).save().then(function(model) {
	    	//console.log(model);
	    	var session_id = crypto.createHash('sha1');
				session_id.update('#' + model.get('id') + '-' + model.get('username'));

				req.session.user_id = session_id.digest('hex');
	    	return res.json({ redirect: '/admin',
	    					dataReturn: 'success',
	    					username: model.get('username')
	    			});
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
