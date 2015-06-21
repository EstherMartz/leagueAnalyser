var app = angular.module("app",['ngRoute']);

app.config(['$locationProvider','$routeProvider',
  function( $locationProvider, $routeProvider) {
    $routeProvider.
      when('/results', {
        templateUrl: 'views/results',
		controller: 'retrieveController'
      });
	  
  	// $stateProvider
   //    .state('results', {
   //      params: ['user', 'match'],
   //      templateUrl: "views/results"
   //    });

	$locationProvider.html5Mode({
	    enabled: true,
	    requireBase: true
	  });
  }]);

app.factory("dataService",function(){	
	var info = {
		user:'',
		match:''
	};

	function getData(){
		userInfo = data;
	}

	return{
		setTest: function(name){
			info.user = name;
		},
		getTest: function(){
			return info.user;
		}
	}
});

app.controller("InfoController",['$scope','$log','$http','$filter','dataService',function($scope,$log,$http,$filter, dataService){	
		
	$scope.info = {
		summonerName: ''
	};

	$scope.info.onClick = function(){
		$scope.info.summonerName = $scope.info.summonerNameBox;
		
		$scope.info.summonerName = $scope.info.summonerName.replace(' ','');
		$scope.info.summonerName = $scope.info.summonerName.toLowerCase();

		$http.post('/api/getSummonerName', JSON.stringify($scope.info))
		.success(function(data,status){
			console.log("enviado");	
			})
		};
}])

app.controller("retrieveController",['$scope','dataService','$http',function($scope, dataService, $http){
	$scope.info = {
		display: '',
		jsonData: '',
		championsData: '',
	};

	$http.get('/api/summonerData')
				.success(function(data, status){
					console.log("Success");
					$scope.info.display = data;
					$http.get('/api/matchInfo')
					.success(function(data, status){
							$scope.jsonData = data;
							})

					$http({
						url:'/api/champInfo',
						method: 'GET',
						transformResponse: [function(data){
							$scope.championsData = data;
						}]
					})
				})
	}]);