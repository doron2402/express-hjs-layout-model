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

  if (req.body && req.body.name && req.session.userId){

    return Mysql.MysqlKnex('clients').insert({
      userId: req.session.userId,
      clientName: req.body.name,
      clientPhone: req.body.phone || 'NULL',
      clientSite: req.body.site || 'NULL',
      clientAddress: req.body.address || 'NULL',
      clientCity: req.body.city || 'NULL',
      clientState: req.body.state || 'NULL',
      clientCountry: req.body.country || 'NULL',
      clientFax: req.body.fax || 'NULL',
      clientContactPhone: req.body.contactPhone || 'NULL',
      clientContactName: req.body.contactName || 'NULL'
     }).then(function(err, response){
        if (err)
          console.log(err);

        return res.json({data: response});
     });
    
    
  }else
    return res.json({ error: 'No body'});

};

exports.deleteClient = function (req, res) {
  console.log(req.body);
  
  return Mysql.MysqlKnex('clients').where('id', parseInt(req.body.id,10)).del().then(function(err, response){
    if (err)
      console.log(err);

    return res.json({data: 'Delete Successfully'});
  });
  
};