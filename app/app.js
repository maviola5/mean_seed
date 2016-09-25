(function(){
	angular.module('app', ['ngRoute']);

	function config($routeProvider, $locationProvider){

		// route authentication code
		// var authenticate = ["$location", "authentication", function($location, authentication) { 
		// 	if(!authentication.isLoggedIn()) return $location.path("/login");
		// }];
		
		$routeProvider
		.when('/', {
			templateUrl: 'home/home.view.html',
			controller: 'homeCtrl',
			controllerAs: 'vm'
		})
		.when('/about', {
			templateUrl: '/about/about.view.html',
			controller: 'aboutCtrl',
			controllerAs: 'vm'
		})
		.otherwise({redirectTo: '/'});

		$locationProvider.html5Mode(true);
	}

	angular
	.module('app')
	.config(['$routeProvider', '$locationProvider', config]);
})();