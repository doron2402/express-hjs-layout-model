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
			
			.when('/leads',{
				'templateUrl' : 'admin_templates/leads.html',
				controller : 'adminLeads'
			})

			// route for the contact page
			.when('/contact', {
				templateUrl : 'admin_templates/contact.html',
				controller  : 'contactController'
			});
			
	});