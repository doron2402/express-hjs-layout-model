	adminApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'admin_templates/home.html',
				controller  : 'mainController'
			})

	        //After user contact us
			.when('/contact/thanks', {
			  templateUrl : 'admin_templates/thanks.html',
			  controller : 'thanksController'
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
			
			// route for the contact page
			.when('/contact', {
				templateUrl : 'admin_templates/contact.html',
				controller  : 'contactController'
			});
			
	});