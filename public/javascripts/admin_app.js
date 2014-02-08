var adminApp = angular.module('adminApp', ['ngRoute','ngCookies']);  
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
	
	//Campign Main page where you can edit/view/create campign
	adminApp.controller('campignMain', function ($scope, $http, $location, $window) {

		//Get list of all campigns
		$http({
			method: 'POST',
			url: 'http://localhost:3000/campign/all/'}).
		   	success(function(data, status, headers, config) {

		    	if (data.error){
		    		$scope.createNew = 'block';	
		    	}else{
		    		console.log(data);
		    		$scope.AllCampigns = data;
		    	}
		    	
		        
		    }).
		    error(function(data, status, headers, config) {
		           		
		    });

		$scope.displayCampignName = function(campign){
			return campign.name;
		};

		$scope.editCampign = function(){
			if (this.campignEdit.name !== undefined){
				console.log(this.campignEdit);
				//redirect to the campign page -> /admin/campign/:id
				$window.location.href = 'admin#/admin/campign/' + this.campignEdit.id;
			}
			
		};
		
		$scope.clients = [{id: 1, name: 'a'},{id: 1234111, name: 'aasdf'},{id: 112, name: 'ca'}];
		
		$scope.createCampign = function(){
			console.log('createCampign');
			$scope.createNew = true;

		};

		$scope.addCampign = function(){
			
			if (this.campign.name != null && this.campign.url != null){
				this.campign.code = Math.round(Math.abs(Math.random() * 1000000000));
				$scope.campign = this.campign;
				
				console.log(this.campign);

				$http({
					method: 'POST',
					data: this.campign,
			    	url: 'http://localhost:3000/campign/add/'}).
		          		success(function(data, status, headers, config) {
		            		console.log(data);
		            		$scope.createNew = 'show';
		          	}).
		          	error(function(data, status, headers, config) {
		            		
		          });
			}
		};


	});

	//List of exsisting clients per user
	adminApp.controller('clientsPage', function($scope, $http) {
		//Get a list of all clients
		$http({
			method: 'POST',
	    	url: 'http://localhost:3000/clients/all/'}).
          		success(function(data, status, headers, config) {
            		console.log(data);
            		$scope.clients = data;

          	}).
          	error(function(data, status, headers, config) {
            		$scope.clients = null;
          });
 		
 		$scope.editable = {};
 		
 		$scope.deleteClient = function(){
 			var ClientId = this.client.id;
 			$http({
			method: 'POST',
			data: this.client,
	    	url: 'http://localhost:3000/client/delete/'}).
          		success(function(data, status, headers, config) {
            		console.log(data);
            		$scope.deleted = {};
            		$scope.deleted[ClientId] = true;
          	}).
          	error(function(data, status, headers, config) {
            		console.log(data);
          });
 		}

 		$scope.editClient = function() {

 			if ($scope.editable[this.client.id]){
 				$http({
					method: 'POST',
					data: this.client,
			    	url: 'http://localhost:3000/client/update/'}).
		          		success(function(data, status, headers, config) {
		            	console.log(data);
		          	}).
		          	error(function(data, status, headers, config) {
		            		console.log(data);
		          });
 			}

 			if (!$scope.editable[this.client.id])
 				$scope.editable[this.client.id] = true;
 			else
 				$scope.editable[this.client.id] = false;

 		}
         	
	});

	//Add new client
	adminApp.controller('clientNew', function($scope, $http, $location, $window) {
		$scope.submitNewClientForm = function(){
			console.log(this.client);

			$http({
				method: 'POST',
				data: this.client,
		    	url: 'http://localhost:3000/client/new/'}).
	          		success(function(data, status, headers, config) {
	            		console.log(data);
	            		$scope.clients = data;
	            		$window.location.href = 'admin#/admin/clients';
	          	}).
	          	error(function(data, status, headers, config) {
	            		$scope.clients = null;
	          });
		}

	});
	
	
	adminApp.controller('loginController', function($scope,$http){
	   $scope.authenticateUserForm = function() {
	     if (this.user && this.user.username !== null && this.user.password !== null){
	    	$http({method: 'POST',
	    		url: 'http://localhost:3000/lead/all/' + this.user.username}).
          		success(function(data, status, headers, config) {
            		console.log(data);
          	}).
          	error(function(data, status, headers, config) {
            	console.log(data);
          });
	     }
	   }
	});
	

	adminApp.controller('adminLeads',function($scope,$http, $route, $routeParams){
	  	$http({method: 'POST',
	    	url: 'http://localhost:3000/leads/all/' + parseInt($routeParams.id,10)}).
          		success(function(data, status, headers, config) {
            	console.log(data);
            	$scope.leads = data;
          	}).
          	error(function(data, status, headers, config) {
            	console.log(data);
            	$scope.leads = null;
          });

	});


	adminApp.controller('campignPage', function($scope, $http, $route, $routeParams, $location){

		$http({method: 'POST',
			data: { 'campignId': parseInt($routeParams.id,10)},
	    	url: 'http://localhost:3000/campigns/info'}).
          		success(function(data, status, headers, config) {
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

	
	adminApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'admin_templates/home.html',
				controller  : 'mainController'
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
			})

			// route for the contact page
			.when('/contact', {
				templateUrl : 'admin_templates/contact.html',
				controller  : 'contactController'
			});
			
	});