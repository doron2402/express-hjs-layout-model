var myApp = angular.module('myApp', ['ngRoute','ngCookies']);

	// create the controller and inject Angular's $scope
	myApp.controller('mainController', function($scope) {
		// create a message to display in our view
		$scope.message = 'Everyone come and see how good I look!';
		$scope.current_user = {username: 'doron2402'};
	});
	
	//Signup Controller
	myApp.controller('signupController', function($scope) {
		$scope.message = 'Please join us';
		$scope.signupOptions = [{name: 'Facebook', link: '#'},
		{name: 'Google+', link: '#'},
		{name: 'Twitter', link: '#'}];
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
	
	myApp.controller('meController', function($scope){
	 $scope.user = {name: 'me', email: 'me@me.com', lastLogin: '01-23-2014'};
	});

	myApp.controller('formContactController', function($scope){
		$scope.user = null;
	});