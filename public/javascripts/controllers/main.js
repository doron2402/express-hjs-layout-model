var myApp = angular.module('myApp', ['ngRoute','ngCookies']);

	// create the controller and inject Angular's $scope
	myApp.controller('mainController', function($scope) {
		// create a message to display in our view
		$scope.message = 'Everyone come and see how good I look!';
		$scope.current_user = {username: 'doron2402'};
	});
	
	//Signup Controller
	myApp.controller('signupController', function($scope,$http,$location,$window) {
		$scope.message = 'Please join us';
		$scope.resetForm = function(){
			console.log(this.user);
			return this.user = {};

		};
		
		$scope.submitForm = function(){

			var data = $scope.user; 
			if (data.password && 
				data.password_confirmation && 
				data.password == data.password_confirmation && 
				data.username && data.email){
				//Create User
				//Todo create a call to backend create the user in the database and redirect the user to admin welcome page
				$http({
			      	method: 'POST',
			      	data: data, 
			      	headers: {"Content-Type": "application/json"},
		  			url: '/user/signup'
		  		}).
		          	success(function(data, status, headers, config) {
		            // this callback will be called asynchronously
		            // when the response is available
		            console.log(data);
		            $window.location.href = data.redirect;
		        }).
		        	error(function(data, status, headers, config) {
		            // called asynchronously if an error occurs
		            // or server returns response with an error status.
		            console.log(data);
		        });
			}
		};
	});
  
  	myApp.controller('thanksController', function($scope) {
		// create a message to display in our view
		$scope.message = 'Thanks for contacting us';
	});

	myApp.controller('aboutController', function($scope) {
		$scope.message = 'Look! I am an about page.';
	});

	myApp.controller('contactController', function($scope) {
		$scope.message = 'Contact us! JK. This is just a demo.';
	});

	myApp.controller('formContactController', function($scope){
		$scope.user = null;
	});

	myApp.controller('loginController', function($scope,$http,$location,$window){
		$scope.authenticateUserForm = function() {
	     if (this.user && this.user.username !== null && this.user.password !== null){
	      
	      $http({
	      	method: 'POST',
	      	data: this.user, 
	      	headers: {"Content-Type": "application/json"},
  			url: '/auth/user'
  		}).
          	success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(data);
            $window.location.href = data.redirect;
          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log(data);
          });
	     }
	   }
	});