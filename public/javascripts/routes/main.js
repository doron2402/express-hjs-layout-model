	myApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'templates/home.html',
				controller  : 'mainController'
			})

			// route for the about page
			.when('/about', {
				templateUrl : 'templates/about.html',
				controller  : 'aboutController'
			})

      		//After user contact us
			.when('/contact/thanks', {
			  templateUrl : 'templates/thanks.html',
			  controller : 'thanksController'
			})
			
			//Login view
			.when('/login',{
				templateUrl : 'templates/login.html',
			  	controller : 'loginController'
			})
			
			.when('/faq', {
			  templateUrl : 'templates/faq.html',
			  controller : 'faqController'
			})

			// route for the contact page
			.when('/contact', {
				templateUrl : 'templates/contact.html',
				controller  : 'contactController'
			});
			
	});