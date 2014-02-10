var express = require('express'),
	auth = require('./lib/auth'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path');


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
api.post('/traffic/:campignId', routes.traffic.counter);//Traffic
api.post('/lead/new/:campignId', routes.leads.newLead);//Lead

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
app.use(express.favicon("public/favicon.ico"));
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

app.get('/', routes.static_pages.index);

/* Admin Pages - Route that need to be secure */
app.get('/admin/users', auth.checkAuth, routes.admin.users);
app.get('/admin/dashboard',auth.checkAuth, routes.admin.dashboard);
app.get('/admin', auth.checkAuth, routes.admin.dashboard);
app.get('/admin/analytics',auth.checkAuth, routes.admin.analytics);
app.get('/admin/users',auth.checkAuth, routes.admin.users);

//User routes
app.get('/users', routes.user.list);
app.post('/users', routes.user.getList);
app.post('/user/signup', routes.user.signupUser)
app.post('/auth/user', routes.user.loginUser);
app.get('/admin/logout', routes.user.logoutUser);

app.post('/contact/new', routes.contact.newContactInformation);
app.post('/campigns/available', auth.checkAuth, routes.cardential.getCampignCaredentialByUserId);
app.get('/leads/media/:campignId', routes.leads.getLeadByMedia);

//Non Secure Pages
app.get('/faq/all', routes.static_pages.getFaq);

//Campign create/delete/update/read
app.post('/campign/add', auth.checkAuth, routes.campign.createNewCampign); //Create a new campign
app.post('/campign/update',auth.checkAuth, routes.campign.updateCampign); //Create a new campign
app.post('/campigns/info', auth.checkAuth, routes.campign.information);
app.post('/campign/all', auth.checkAuth, routes.campign.getAllCampigns);

//Clients 
app.post('/clients/all',auth.checkAuth, routes.clients.getAllClients);
app.post('/client/new', auth.checkAuth, routes.clients.addNewClient);
app.post('/client/delete', auth.checkAuth, routes.clients.deleteClient);
app.post('/client/update', auth.checkAuth, routes.clients.updateClient);

app.post('/leads/all/:campignId', auth.checkAuth, routes.leads.getAllLeads); //Get Leads by campign id
app.post('/traffic/all/:campignId', auth.checkAuth, routes.traffic.getAllTraffic); //Get Traffic by campign id
app.post('/leads/conversion/:campignId', auth.checkAuth, routes.leads.getConversionRate);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/* Running API SERVER */
http.createServer(api).listen(api.get('port'), function(){
  console.log('Running API SERVER on port ' + api.get('port'));
});

