var myApp = angular.module('myApp', ['ngRoute','ngCookies']);

	// create the controller and inject Angular's $scope
	myApp.controller('mainController', function($scope) {
		// create a message to display in our view

        $scope.showGraphAndCharts = function () {

            /*
                Pie Chart - Most effective Media
            */
            var data = [
                ['Facebook', 12],
                ['Ynet', 9],
                ['Yad2', 14],
                ['Calcalist', 16],
                ['Instagram', 7],
                ['Blog', 9]
            ];
            
            $.jqplot ('piechart', [data],
                {
                    seriesDefaults: {
                        // Make this a pie chart.
                        renderer: $.jqplot.PieRenderer,
                        rendererOptions: {
                            showDataLabels: true
                        }
                    },
                    legend: { 
                        show:true, 
                        location: 'e' 
                    }
                }
            );
            $.jqplot('chartdiv',  [[[1, 2],[3,5.12],[5,13.1],[7,33.6],[9,85.9],[11,219.9]]],
                { title:'Number of leads',
                    axes:{yaxis:{min:-10, max:240}},
                    series:[{color:'#5FAB78'}]
                });

            var line1=[['23-May-08', 578.55], ['20-Jun-08', 566.5], ['25-Jul-08', 480.88], ['22-Aug-08', 509.84],
                ['26-Sep-08', 454.13], ['24-Oct-08', 379.75], ['21-Nov-08', 303], ['26-Dec-08', 308.56],
                ['23-Jan-09', 299.14], ['20-Feb-09', 346.51], ['20-Mar-09', 325.99], ['24-Apr-09', 386.15]];
            
            $.jqplot('chart', [line1], {
                title:'Data Point Highlighting',
                axes:{
                    xaxis:{
                        renderer:$.jqplot.DateAxisRenderer,
                        tickOptions:{
                            formatString:'%b&nbsp;%#d'
                        }
                    },
                    yaxis:{
                        tickOptions:{
                            formatString:'$%.2f'
                        }
                    }
                },
                highlighter: {
                    show: true,
                    sizeAdjust: 7.5
                },
                cursor: {
                    show: false
                }
            });

            var line1 = [['Cup Holder Pinion Bob', 7], ['Generic Fog Lamp', 9], ['HDTV Receiver', 15],
                ['8 Track Control Module', 12], [' Sludge Pump Fourier Modulator', 3],
                ['Transcender/Spice Rack', 6], ['Hair Spray Danger Indicator', 18]];

            $.jqplot('barchart', [line1], {
                title: 'Concern vs. Occurrance',
                series:[{renderer:$.jqplot.BarRenderer}],
                axesDefaults: {
                    tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
                    tickOptions: {
                        angle: -30,
                        fontSize: '10pt'
                    }
                },
                axes: {
                    xaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer
                    }
                }
            });
            // For horizontal bar charts, x an y values must will be "flipped"
            // from their vertical bar counterpart.
            $.jqplot('charts', [
                [[2,1], [4,2], [6,3], [3,4]],
                [[5,1], [1,2], [3,3], [4,4]],
                [[4,1], [7,2], [1,3], [2,4]]], {
                seriesDefaults: {
                    renderer:$.jqplot.BarRenderer,
                    // Show point labels to the right ('e'ast) of each bar.
                    // edgeTolerance of -15 allows labels flow outside the grid
                    // up to 15 pixels.  If they flow out more than that, they
                    // will be hidden.
                    pointLabels: { show: true, location: 'e', edgeTolerance: -15 },
                    // Rotate the bar shadow as if bar is lit from top right.
                    shadowAngle: 135,
                    // Here's where we tell the chart it is oriented horizontally.
                    rendererOptions: {
                        barDirection: 'horizontal'
                    }
                },
                axes: {
                    yaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer
                    }
                }
            });
            
            /* !!!!!!!!!!!!! jqplot examples END  !!!!!!!!!!*/
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

