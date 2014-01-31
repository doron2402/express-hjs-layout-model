
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

};

exports.getList = function(req, res){

	return res.json([{username: 'Doron'},{username: 'Rachel'}]);
}