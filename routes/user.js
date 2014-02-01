
/*
 * GET users listing.
 */

exports.list = function(req, res){
	return res.json([{username: 'Doron'},{username: 'Rachel'}]);
};

//Get User by Id
exports.getUserId = function(req, res){

};

//Register
exports.registerUser = function(req, res){

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
			console.log(model.get('password'));
			if (model.get('password') == tmp_pass)
			{
				console.log('login');
				var session_id = crypto.createHash('sha1');
				session_id.update('#' + model.get('id') + '-' + model.get('username'));

				req.session.user_id = session_id.digest('hex');
				console.log(req.session);

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
	return res.redirect('/');
};

exports.getList = function(req, res){

	return res.json([{username: 'Doron'},{username: 'Rachel'}]);
}