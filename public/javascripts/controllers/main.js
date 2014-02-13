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
		$scope.patternCheckAlpha = /^[a-zA-Z]*$/;
		$scope.patternCheckNumeric = /^\d+$/;

		$scope.resetForm = function(){
			console.log(this.user);
			return this.user = {};

		};
		
		$scope.submitForm = function(){

			var data = $scope.user; 
			if (data && data.password && 
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

  	myApp.controller('faqController', function($scope, $http) {
  		
        //GET faq array 
        $http({
            method: 'GET',
            url: '/faq/all'
        }).success(function(data, status, headers, config) {
            $scope.faq = data;

        }).error(function(data, status, headers, config) {
            console.log('Something Went wrong');
        });
  	});


	myApp.controller('aboutController', function($scope) {
		$scope.message = 'Look! I am an about page.';
	});

	myApp.controller('contactController', function($scope, $http, $location, $window) {
		$scope.message = 'Contact us! JK. This is just a demo.';
		
		$scope.contactFormSubmit = function(){
			console.log('contactFormSubmit');
			console.log(this.contact);
			if (this.contact && 
				this.contact.fname && 
				this.contact.lname &&
				this.contact.phone &&
				this.contact.email ){

				$scope.showForm = true;
				console.log('submit form...');
			$http({
	      	method: 'POST',
	      	data: this.contact, 
	      	headers: {"Content-Type": "application/json"},
  			url: '/contact/new'
  		}).
          	success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(data);
            $location.path('/contact/thanks');
          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log(data);
            console.log('Something Went wrong')
            $location.path('/contact/thanks');
          });

		
			}
			
			
		};
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