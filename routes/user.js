
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

	if (req.body && req.body.username && req.body.password){
		//Check with DB
		var Model = require('../models/userModel');
		console.log(Model);
		return res.json({Done: 'done...'});
	}else
		return res.json({Error: 'Bad username or password'});
};

exports.getList = function(req, res){

	return res.json([{username: 'Doron'},{username: 'Rachel'}]);
}