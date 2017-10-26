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