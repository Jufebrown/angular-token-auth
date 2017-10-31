# angular-token-auth

## Summary:
This is a walkthrough for building an angular front-end for an express app that uses json web tokens for auth. The app is heavily influenced by Michael Herman's tutorial: http://mherman.org/blog/2017/01/05/token-based-authentication-with-angular/#.We-eA2SnEWo

The tutorial for the node/express app is here: https://github.com/Jufebrown/sequelize-token-auth

If you want to clone and run the code in this repo, you will need to run ```npm i``` to install the dependencies.

## Tutorial Start:

### Install Dependencies
```
"dependencies": {
  "angular": "^1.6.6",
  "angular-route": "^1.6.6",
  "jquery": "^3.2.1",
  "materialize-css": "^0.100.2"
}
```
### Setup folder/file structure
```
$ mkdir app partials app/controllers app/factories
$ touch index.html app/controllers/homeCtrl.js app/controllers/loginCtrl.js app/controllers/registerCtrl.js app/factories/authFactory.js app/app.js partials/home.html partials/login.html partials/register.html
```
### Setup index.html
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>JWT Auth</title>
    <link rel="stylesheet" href="node_modules/materialize-css/dist/css/materialize.min.css">
  </head>

  <body ng-app="JWT">
    <div ng-view></div>

    <script src="node_modules/jquery/dist/jquery.min.js"></script>
    <script src="node_modules/materialize-css/dist/js/materialize.min.js"></script>
    <script src="node_modules/angular/angular.min.js"></script>
    <script src="node_modules/angular-route/angular-route.min.js"></script>

    <script src="app/app.js"></script>
    <script src="app/controllers/HomeCtrl.js"></script>
    <script src="app/controllers/LoginCtrl.js"></script>
    <script src="app/controllers/RegisterCtrl.js"></script>
    <script src="app/factories/authFactory.js"></script>
  </body>
</html>
```
### Setup app.js
```
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
```
### Setup homeCtrl.js
```
'use strict';

app.controller('HomeCtrl', function($scope, $location, authFactory) {

  $scope.show='false';

  $scope.authStatus = () => {
    $scope.isLoggedIn = false;
    localStorage.setItem('isLoggedIn', false);
    const token = localStorage.token;
    if(token){
      authFactory.ensureAuthenticated(token)
        .then((user) => {
          if (user.data.status === 'success')
            $scope.isLoggedIn = true;
          $scope.username = localStorage.username;
          localStorage.setItem('isLoggedIn', true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  $scope.logout = () => {
    authFactory.logout();
    $location.url('/');
  };

  $scope.authStatus();

});
```
