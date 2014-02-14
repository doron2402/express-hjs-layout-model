var myApp = angular.module('myApp', ['ngRoute','ngCookies','googlechart']);

	// create the controller and inject Angular's $scope
	myApp.controller('mainController', function($scope) {
		// create a message to display in our view

        $scope.showGraphAndCharts = function () {
            
            var chart1 = {};
            chart1.type = "ColumnChart";
            chart1.cssStyle = "height:400px; width:400px;";
            chart1.data = {"cols": [
                {id: "month", label: "Month", type: "string"},
                {id: "laptop-id", label: "Laptop", type: "number"},
                {id: "desktop-id", label: "Desktop", type: "number"},
                {id: "server-id", label: "Server", type: "number"},
                {id: "cost-id", label: "Shipping", type: "number"}
            ], "rows": [
                {c: [
                    {v: "January"},
                    {v: 19, f: "42 items"},
                    {v: 12, f: "Ony 12 items"},
                    {v: 7, f: "7 servers"},
                    {v: 4}
                ]},
                {c: [
                    {v: "February"},
                    {v: 13},
                    {v: 1, f: "1 unit (Out of stock this month)"},
                    {v: 12},
                    {v: 2}
                ]},
                {c: [
                    {v: "March"},
                    {v: 24},
                    {v: 0},
                    {v: 11},
                    {v: 6}

                ]}
            ]};

            chart1.options = {
                "title": "Sales per month",
                "isStacked": "true",
                "fill": 20,
                "displayExactValues": true,
                "vAxis": {
                    "title": "Sales unit", "gridlines": {"count": 6}
                },
                "hAxis": {
                    "title": "Date"
                }
            };

            chart1.formatters = {};

            $scope.chart = chart1;


        };

        $scope.showMediaPieChart = function(){
            $scope.chartObject = {};
            $scope.chartObject.type = "PieChart";
            $scope.chartObject.data = {"cols": [
                {id: "t", label: "Topping", type: "string"},
                {id: "s", label: "Slices", type: "number"}
            ], "rows": [
                {c: [
                    {v: "Ynet"},
                    {v: 3},
                ]},
                {c: [ {v: "Facebook"},{v: 33} ]},
                {c: [
                    {v: "Yad2"},
                    {v: 31}
                ]},
                {c: [
                    {v: "Blogs"},
                    {v: 1},
                ]},
                {c: [
                    {v: "Instagram"},
                    {v: 2},
                ]}
            ]};


            $scope.chartObject.options = {
                'title': 'Which media works the best for your campign?!'
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