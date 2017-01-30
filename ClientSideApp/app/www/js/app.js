  // Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic.service.core', 'btford.socket-io', 'starter.controllers'])

// Identify App
  .config(['$ionicAppProvider', function($ionicAppProvider) {
    // Identify app
    $ionicAppProvider.identify({
      app_id: 'a1625e2d',
      api_key: 'dbecb11453f29e0344d34ec999c1b419aedff69a9bd7cece'
    });
  }])

  .factory('socket',function(socketFactory){
    //Create socket and connect to http://chat.socket.io
    var myIoSocket = io.connect('http://localhost:8888/');

    mySocket = socketFactory({
      ioSocket: myIoSocket
    });

    return mySocket;
  })


  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      /*var push = new Ionic.Push({
        "debug": true
      });

      push.register(function(token) {
        console.log("My Device token:",token.token);
        push.saveToken(token);  // persist the token in the Ionic Platform
      });*/

    });
  })

  /*.factory('positionFactory', function() {
    var posService = {};
    var position= {};

    setPosition = function (givenPosition){
      position.x = givenPosition.coords.latitude;
      position.y = givenPosition.coords.longitude;
      console.log(position.x + " - "+ position.y);
    };
    showError = function (error){
      console.log("Error - Couldn't find position");
    };

    posService.set = function() {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(setPosition,showError);
       // navigator.geolocation.getCurrentPosition(setPosition,showError);
      } else{
        console.log("Geolocation is not supported by this browser.");
      }

    };
    posService.get = function() {
      return position;
    };
    return posService;
  })*/


  .factory('loginFactory', function() {
    var loginService = {};
    var loginData = {'groupe_name' : 'Groupe Des Cerises', 'groupe_id' : ''};

    loginService.setGroupeName = function(groupeName) {
      loginData.groupe_name = groupeName;
    };

    loginService.setId = function(groupeId) {
      loginData.groupe_id = groupeId;
    };

    loginService.get = function() {
      return loginData;
    };
    return loginService;
  })

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })

    .state('app.carte', {
      url: '/carte',
      views: {
        'menuContent': {
          templateUrl: 'templates/carte.html',
          controller: 'CarteCtrl'
        }
      }
    })

    .state('app.identification', {
      url: '/identification',
      views: {
        'menuContent': {
          templateUrl: 'templates/identification.html',
          controller: 'AppCtrl'
        }
      }
    })

    .state('app.enigmes', {
      url: '/enigmes',
      views: {
        'menuContent': {
          templateUrl: 'templates/enigmes.html',
          controller: 'EnigmesCtrl'
        }
      }
    })


    .state('app.enigme', {
      url: '/enigme/:enigmeId',
      views: {
        'menuContent': {
          templateUrl: 'templates/enigme.html',
          controller: 'EnigmeCtrl'
        }
      }
    })

    .state('app.chat', {
      url: '/chat',
      views: {
        'menuContent': {
          templateUrl: 'templates/chat.html',
          controller: 'ChatCtrl'
        }
      }
    })

    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/carte');
});
