exports.users = function(req, res){
  res.render('admin/users', { title: 'SpeedLeads', admin: true, users: [{id: 1, name: 'aaaa'},{id: 2, name: 'bbbb'}, {id:3, name: 'ccccc'}]});
};

exports.dashboard = function(req, res){
	res.render('admin/dashboard', { title: 'SpeedLeads', admin: true});
};

exports.analytics = function(req, res){
	res.render('admin/analytics', {title: 'SpeedLeads', admin: true});
};