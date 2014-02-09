var myApp = angular.module('myApp', ['ngRoute','ngCookies']);

	// create the controller and inject Angular's $scope
	myApp.controller('mainController', function($scope) {
		// create a message to display in our view
		$scope.message = 'Everyone come and see how good I look!';
		$scope.current_user = {username: 'doron2402'};

        $scope.init = function () {

            /* !!!!!!!!!!!!! jqplot examples start from here !!!!!!!!!!*/
            /* !!!!!!!!!!!!! very messy code but its just for playing with it !!!!!!!!!!*/

            $.jqplot('chartdiv',  [[[1, 2],[3,5.12],[5,13.1],[7,33.6],[9,85.9],[11,219.9]]],
                { title:'Exponential Line',
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
            var data = [
                ['Heavy Industry', 12],['Retail', 9], ['Light Industry', 14],
                ['Out of home', 16],['Commuting', 7], ['Orientation', 9]
            ];
            $.jqplot ('piechart', [data],
                {
                    seriesDefaults: {
                        // Make this a pie chart.
                        renderer: $.jqplot.PieRenderer,
                        rendererOptions: {
                            // Put data labels on the pie slices.
                            // By default, labels show the percentage of the slice.
                            showDataLabels: true
                        }
                    },
                    legend: { show:true, location: 'e' }
                }
            );
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
            var s1 = [2, 6, 7, 10];
            var s2 = [7, 5, 3, 4];
            var s3 = [14, 9, 3, 8];
            $.jqplot('ch', [s1, s2, s3], {
                // Tell the plot to stack the bars.
                stackSeries: true,
                captureRightClick: true,
                seriesDefaults:{
                    renderer:$.jqplot.BarRenderer,
                    rendererOptions: {
                        // Put a 30 pixel margin between bars.
                        barMargin: 30,
                        // Highlight bars when mouse button pressed.
                        // Disables default highlighting on mouse over.
                        highlightMouseDown: true
                    },
                    pointLabels: {show: true}
                },
                axes: {
                    xaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer
                    },
                    yaxis: {
                        // Don't pad out the bottom of the data range.  By default,
                        // axes scaled as if data extended 10% above and below the
                        // actual range to prevent data points right on grid boundaries.
                        // Don't want to do that here.
                        padMin: 0
                    }
                },
                legend: {
                    show: true,
                    location: 'e',
                    placement: 'outside'
                }
            });
            // Bind a listener to the "jqplotDataClick" event.  Here, simply change
            // the text of the info3 element to show what series and ponit were
            // clicked along with the data for that point.
            $('#ch').bind('jqplotDataClick',
                function (ev, seriesIndex, pointIndex, data) {
                    $('#info3').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);
                }
            );
            var line1 = [14, 32, 41, 44, 40, 47, 53, 67];
            $.jqplot('ch1', [line1], {
                title: 'Chart with Point Labels',
                seriesDefaults: {
                    showMarker:false,
                    pointLabels: { show:true }
                }
            });
            var line1 = [14, 32, 41, 44, 40, 37, 29];
            var line2 = [7, 12, 15, 17, 20, 27, 39];
            $.jqplot('ch2', [line1, line2], {
                title: 'Stacked Bar Chart with Cumulative Point Labels',
                stackSeries: true,
                seriesDefaults: {
                    renderer: $.jqplot.BarRenderer,
                    rendererOptions:{barMargin: 25},
                    pointLabels:{show:true, stackedValue: true}
                },
                axes: {
                    xaxis:{renderer:$.jqplot.CategoryAxisRenderer}
                }
            });
            $.jqplot('ch3', [line1], {
                title: 'Google, Inc.',
                series: [{
                    label: 'Google, Inc.',
                    neighborThreshold: -1
                }],
                axes: {
                    xaxis: {
                        renderer: $.jqplot.DateAxisRenderer,
                        min:'August 1, 2007 16:00:00',
                        tickInterval: '4 months',
                        tickOptions:{formatString:'%Y/%#m/%#d'}
                    },
                    yaxis: {
                        tickOptions:{formatString:'$%.2f'}
                    }
                },
                cursor:{
                    show: true,
                    zoom:true,
                    showTooltip:false
                }
            });
            /* !!!!!!!!!!!!! jqplot examples END  !!!!!!!!!!*/
        };
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

                /*

                faq should keywords should be an array,
                so it can be iterated, or an alternative would be
                to take data.keywords split it at "," then iterate over it
                ( some thoughts about to be consider )

                 */

                console.log(data);
                console.log(data.keywords);
                $scope.faq = data;
          }).
          error(function(data, status, headers, config) {
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