	adminApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'admin_templates/home.html',
				controller  : 'mainController'
			})
			
			//Users CRUD
			.when('/admin/users', {
				templateUrl : 'admin_templates/users/home.html',
				controller : 'usersController'
			})

			//Login
			.when('/login', {
			  templateUrl : 'admin_templates/login.html',
			  controller : 'loginController'
			})
			
			.when('/me', {
			  templateUrl : 'admin_templates/me.html',
			  controller : 'meController'
			})
			
			.when('/admin/leads',{
				'templateUrl' : 'admin_templates/leads.html',
				controller : 'adminLeads'
			})

			.when('/admin/campign/:id',{
				'templateUrl' : 'admin_templates/campign.html',
				controller : 'campignPage'
			})

			//Clients page -> each users can have multiple clients
			.when('/admin/clients',{
				'templateUrl' : 'admin_templates/clients.html',
				controller : 'clientsPage'
			})

			//Add a new client
			.when('/admin/client/new',{
				'templateUrl' : 'admin_templates/newclient.html',
				controller : 'clientNew'
			})
			
			//Campign page
			.when('/admin/campign', {
				'templateUrl' : 'admin_templates/campign_main.html',
				controller: 'campignMain'
			});
	});