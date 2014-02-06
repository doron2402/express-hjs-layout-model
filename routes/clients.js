var Mysql = require('../lib/mysqlKnex');

exports.getAllClients = function(req, res){

  	if (req.session.userId != null && !isNaN(req.session.userType)){
  		
  		if (req.session.userType == 0){

  			return Mysql.MysqlKnex('clients').select().exec(function(err, resp) { 
  	  			console.log(resp);
  				  return res.json(resp);
  	  		});
  		}
  		else if (req.session.userType == 1){
  			return Mysql.MysqlKnex('clients').where('userId','=', req.session.userId).exec(function(err, resp) { 
  	  			console.log(resp);
  				return res.json(resp);
  	  		});
  		}
  	}
  	else
   		return res.json({'error': 'Missing arguments'});
};


//Adding a new client
exports.addNewClient = function (req, res) {

  if (req.body){

  }else
    return res.json({ error: 'No body'});

};