'use strict';

const app = angular.module('JWT', ['ngRoute']);

app.config(function($routeProvider) {

  // App routes
  $routeProvider
    .when('/', {
      templateUrl: 'partials/home.html',
      controller: 'HomeCtrl'
    })
    .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'LoginCtrl'
    })
    .when('/register', {
      templateUrl: 'partials/register.html',
      controller: 'RegisterCtrl'
    })
    .when('/game', {
      templateUrl: 'partials/game.html',
      controller: 'GameCtrl',
      resolve: {
        //This function is injected with the AuthService where you'll put your authentication logic
        'auth': function(authFactory) {
          return authFactory.authenticateRoute();
        }
      }
    })
    .otherwise('/');

});

app.run(function($rootScope, $location){
  //If the route change failed due to authentication error, redirect them out
  $rootScope.$on('$routeChangeError', function(event, current, previous, rejection){
    if(rejection === 'Not Authenticated'){
      $location.url('/');
    }
  });
});