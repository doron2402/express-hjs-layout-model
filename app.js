var express = require('express'),
	routes = require('./routes'),
	admin = require('./routes/admin'),
	user = require('./routes/user'),
	static_pages = require('./routes/pages'),
	http = require('http'),
	path = require('path'),
	traffic = require('./routes/traffic'),
	leads = require('./routes/leads'),
	campign = require('./routes/campign');


/*
	API 
		POST traffic/new 
		POST lead/new 
*/
var api = express();
api.set('port', process.env.API_PORT || 6000);
api.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    next();
});
api.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
api.use(express.logger('dev'));
api.use(express.json());
api.use(express.urlencoded());
api.use(express.methodOverride());
api.use(api.router);
/* API Calls */
api.post('/traffic/:campignId',traffic.counter);//Traffic
api.post('/lead/new/:campignId',leads.newLead);//Lead

var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.set('layout', 'layouts/default');
app.set('partials', { header: "partials/header", 
					  topnav: "partials/topnav", 
					  topnav_admin: "partials/topnav_admin",
					  script_public: "partials/script_public",
					  script_auth: "partials/script_auth"});
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  api.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/admin/users', admin.users);
app.get('/admin/dashboard', admin.dashboard);
app.get('/admin', admin.dashboard);
app.get('/admin/analytics', admin.analytics);
app.get('/admin/users', admin.users);
app.get('/users', user.list);
app.post('/users', user.getList)

app.get('/leads/media/:campignId', leads.getLeadByMedia);
app.get('/leads/all/:campignId', leads.getAllLeads);
//Create new campign
app.post('/campign/new',campign.newCampign);
app.post('/campign/delete',campign.deleteCampign);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/* Running API SERVER */
http.createServer(api).listen(api.get('port'), function(){
  console.log('Running API SERVER on port ' + api.get('port'));
});

