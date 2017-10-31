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
### Setup home.html
```
<div class="home-container">

  <div class="home-row-container">
    <div class="home-column-container">
      <div>
        <h1>JWT and Angular</h1>
      </div>

      <div ng-if="!isLoggedIn" class="container">
        <a class="waves-effect waves-light btn-large green" href="/#!/login">Login</a>
        <a class="waves-effect waves-light btn-large blue" href="/#!/register">Register</a>
      </div>

      <h7 ng-if="isLoggedIn" class="top-right">welcome <a href="#" ng-click="logout()">{{username}}</a></h7>

      <div ng-if="isLoggedIn" class="menu-container">
        <div class="menu-item-container">
          <a class="waves-effect waves-yellow menu-item" ng-click="newGame()" ng-mouseover="show=!show" ng-mouseleave="show=!show">Play Game</a>
        </div>
      </div>

    </div>
  </div>
</div>
```

### Setup registerCtrl.js
```
'use strict';

app.controller('RegisterCtrl', function($scope, $location, authFactory) {

  $scope.register = function() {
    authFactory.register($scope.user)
      .then(function(response) {
        localStorage.setItem('username', $scope.user.username);
        localStorage.setItem('token', response.data.token);
        $location.url('/');
      })
      .catch((err) => {
        console.log(err);
      });
  };
});
```

### Setup register.html
```
<div class="auth-container">
  <div class="container">
    <div class="row">
      <div class="col-md-4">
        <h1>Register</h1>
        <form ng-submit="register()" novalidate>
         <div class="form-group">
           <input type="text" class="form-control" id="username" placeholder="username" ng-model="user.username" required autofocus>
         </div>
         <div class="form-group">
           <input type="password" class="form-control" id="password" placeholder="password" ng-model="user.password" required>
         </div>
         <button type="submit" class="btn btn-default">Register</button>
        </form>
        <div class="other-auth-option">
          <small>Already have an account? <a href="/#!/login">Login</a></small>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Setup loginCtrl.js
```
'use strict';

app.controller('LoginCtrl', function($scope, $location, authFactory) {

  $scope.login = function() {
    authFactory.login($scope.user)
      .then(function(response) {
        localStorage.setItem('username', $scope.user.username);
        localStorage.setItem('token', response.data.token);
        $location.url('/');
      })
      .catch((err) => {
        console.log(err);
      });
  };
});
```
### Setup login.html
```
<div class="auth-container">
  <div class="container">
    <div class="row">
      <div class="col-md-4">
        <h1>Login</h1>
        <form ng-submit="login()" novalidate>
         <div class="form-group">
           <input type="text" class="form-control" id="username" placeholder="username" ng-model="user.username" required autofocus>
         </div>
         <div class="form-group">
           <input type="password" class="form-control" id="password" placeholder="password" ng-model="user.password" required>
         </div>
         <button type="submit" class="btn btn-default">Login</button>
        </form>
        <div class="other-auth-option">
          <small>Don't have an account? <a href="/#!/register">Register</a></small>
        </div>
      </div>
    </div>
  </div>
</div>
```
### Setup authFactory.js
```
app.factory('authFactory', function($http, $q) {
  
  const baseURL = 'http://localhost:3000/api/v1/auth/';
  
  return {
    // registers an new user with username and password
    register: function({username, password}) {
      return $http({
        method: 'POST',
        url: baseURL + 'register',
        data: {username, password},
        headers: {'Content-Type': 'application/json'}
      });
    },
  
    // logs in a user with username and password
    login: function({username, password}) {
      return $http({
        method: 'POST',
        url: baseURL + 'login',
        data: {username, password},
        headers: {'Content-Type': 'application/json'}
      });
    },
  
    // logs user out
    logout: function() {
      localStorage.token = '';
      localStorage.username = '';
    },
  
    // makes sure user token is valid
    ensureAuthenticated: function(token) {
      return $http({
        method: 'GET',
        url: baseURL + 'user',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      });
    },
  
    authenticateRoute : function() {
      if(localStorage.isLoggedIn === 'true'){
        //If authenticated, return anything you want, probably a user object
        return true;
      } else {
        //Else send a rejection
        return $q.reject('Not Authenticated');
      }
    }
  
  };
});
```
## Tutorial End