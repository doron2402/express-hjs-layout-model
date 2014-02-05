exports.checkAuth = function(req, res, next){
	console.log('Checking Auth...');
	if (!req.session.user_id || !req.session.userId)
    	res.send('You are not authorized to view this page');
  	else 
    	next();
  
};
