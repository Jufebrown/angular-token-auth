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


