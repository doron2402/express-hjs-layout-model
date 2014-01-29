
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var admin = require('./routes/admin');
var user = require('./routes/user');
var static_pages = require('./routes/pages');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.set('layout', 'layouts/default');
app.set('partials', {header: "partials/header", topnav: "partials/topnav", topnav_admin: "partials/topnav_admin"});
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
}

app.get('/', routes.index);
app.get('/about', static_pages.about);
app.get('/contact', static_pages.contact);
app.get('/faq', static_pages.faq);
app.get('/admin/users', admin.users);
app.get('/admin/dashboard', admin.dashboard);
app.get('/admin', admin.dashboard);
app.get('/admin/analytics', admin.analytics);
app.get('/admin/users', admin.users);
app.get('/users', user.list);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
