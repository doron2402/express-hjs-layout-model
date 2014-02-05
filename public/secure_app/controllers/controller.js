	// create the controller and inject Angular's $scope
	adminApp.controller('mainController', function($scope, $http) {
		// create a message to display in our view
		$scope.message = 'Everyone come and see how good I look!';

		$http({method: 'POST',
	    	url: 'http://localhost:3000/campigns/available'}).
          		success(function(data, status, headers, config) {
            	// this callback will be called asynchronously
            	// when the response is available
            	console.log(data);
            	$scope.cardentials = data;
          	}).
          	error(function(data, status, headers, config) {
            	// called asynchronously if an error occurs
            	// or server returns response with an error status.
            	console.log(data);
            	$scope.cardentials = null;
          });

	});
	
	adminApp.controller('menuController',function($scope){
	  $scope.menu = [
	    {link: '', icon: 'home', name: 'Home'},
	    {link: 'about', icon: 'shield', name: 'About'},
	    {link: 'contact', icon: 'comment', name: 'Contact'},
	    {link: 'register', icon: 'pencil', name: 'Register'},
	    {link: 'login', icon: 'user', name: 'Login'}
	    ];
	    
	$scope.menuUser = [
	    {link: '', icon: 'home', name: 'Home'},
	    {link: 'about', icon: 'shield', name: 'Leads'},
	    {link: 'about', icon: 'comment', name: 'Campigns'},
	    {link: 'about', icon: 'pencil', name: 'Performance'},
	    {link: 'about', icon: 'user', name: 'Logout'}
	    ];
	});
	
	//Signup Controller
	adminApp.controller('signupController', function($scope) {
		$scope.message = 'Please join us';
		$scope.signupOptions = [{name: 'Facebook', link: 'auth/facebook'},
		{name: 'Google+', link: 'auth/google'},
		{name: 'Twitter', link: 'auth/twitter'}];
	});
  
    adminApp.controller('thanksController', function($scope) {
		// create a message to display in our view
		$scope.message = 'Thanks for contacting us';
	});

	adminApp.controller('aboutController', function($scope) {
		$scope.message = 'Look! I am an about page.';
	});

	adminApp.controller('contactController', function($scope) {
		$scope.message = 'Contact us! JK. This is just a demo.';
	});
	
	adminApp.controller('loginController', function($scope,$http){
	   $scope.authenticateUserForm = function() {
	     if (this.user && this.user.username !== null && this.user.password !== null){
	    	$http({method: 'POST',
	    		url: 'http://localhost:3000/lead/all/' + this.user.username}).
          		success(function(data, status, headers, config) {
            	// this callback will be called asynchronously
            	// when the response is available
            	console.log(data);
          	}).
          	error(function(data, status, headers, config) {
            	// called asynchronously if an error occurs
            	// or server returns response with an error status.
            	console.log(data);
          });
	     }
	   }
	});
	

	adminApp.controller('adminLeads',function($scope,$http, $route, $routeParams){
	  	$http({method: 'POST',
	    	url: 'http://localhost:3000/leads/all/' + parseInt($routeParams.id,10)}).
          		success(function(data, status, headers, config) {
            	// this callback will be called asynchronously
            	// when the response is available
            	console.log(data);
            	$scope.leads = data;
          	}).
          	error(function(data, status, headers, config) {
            	// called asynchronously if an error occurs
            	// or server returns response with an error status.
            	console.log(data);
            	$scope.leads = null;
          });

	});

	
	adminApp.controller('campignPage', function($scope, $http, $route, $routeParams, $location){

		$http({method: 'POST',
			data: { 'campignId': parseInt($routeParams.id,10)},
	    	url: 'http://localhost:3000/campigns/info'}).
          		success(function(data, status, headers, config) {
            	
            	    console.log('Doron');
            		//User have permission to all data
            		//Get All Leads And Traffic Data
            		$http({method: 'POST',
						data: { 'campignId': parseInt($routeParams.id,10)},
				    	url: 'http://localhost:3000/leads/all/' + parseInt($routeParams.id,10)}).
			          		success(function(data, status, headers, config) {
			            	// this callback will be called asynchronously
			            	// when the response is available
			            	console.log(data);
			            	$scope.leads = data;
			          	}).
			          	error(function(data, status, headers, config) {
			            	// called asynchronously if an error occurs
			            	// or server returns response with an error status.
			            	console.log(data);
			            	$scope.leads = null;
			          });

			        $http({method: 'POST',
						data: { 'campignId': parseInt($routeParams.id,10)},
				    	url: 'http://localhost:3000/traffic/all/' + parseInt($routeParams.id,10)}).
			          		success(function(data, status, headers, config) {
			            	// this callback will be called asynchronously
			            	// when the response is available
			            	console.log(data);
			            	$scope.traffic = data;
			          	}).
			          	error(function(data, status, headers, config) {
			            	// called asynchronously if an error occurs
			            	// or server returns response with an error status.
			            	console.log(data);
			            	$scope.traffic = null;
			          });


            	$scope.campign = data;
          	}).
          	error(function(data, status, headers, config) {
            	// called asynchronously if an error occurs
            	// or server returns response with an error status.
            	console.log(data);
            	$scope.campign = null;
          });


        $http({method: 'POST',
			data: { 'campignId': parseInt($routeParams.id,10)},
			url: 'http://localhost:3000/leads/conversion/' + parseInt($routeParams.id,10)}).
			    success(function(data, status, headers, config) {
			    	console.log(data);
					$scope.ConversionRate = data;
				}).error(function(data, status, headers, config) {
					console.log(data);
			        $scope.ConversionRate = null;
			    });
        
	});

	adminApp.controller('meController', function($scope){
	 $scope.user = {name: 'me', email: 'me@me.com', lastLogin: '01-23-2014'};
	});

	