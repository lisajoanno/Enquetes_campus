  // Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic.service.core', 'btford.socket-io', 'starter.controllers', 'ngCordova'])

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
    var myIoSocket = io.connect('https://web-map-project-si5.herokuapp.com/');

    mySocket = socketFactory({
      ioSocket: myIoSocket
    });

    return mySocket;
  })

  .factory('Camera', function($q) {

    return {
      getPicture: function(options) {
        var q = $q.defer();

        navigator.camera.getPicture(function(result) {
          q.resolve(result);
        }, function(err) {
          q.reject(err);
        }, options);

        return q.promise;
      }
    }

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

  .factory('currentEnigmaFactory', function() {
    var currentEnigmaService = {};
    var currentEnigma = {};
    var isSet = false;

    currentEnigmaService.set = function(enigma){
      currentEnigma = enigma;
      isSet = true;
    }

    currentEnigmaService.isSet = function () {
      return isSet;
    }

    currentEnigmaService.get = function() {
      return currentEnigma;
    };
    return currentEnigmaService;
  })


  .factory('loginFactory', function() {
    var loginService = {};
    var loginData = {'groupe_name' : '', 'groupe_id' : ''};

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

  .factory('posFactory', function() {
    var posService = {};
    var position = {x : 0, y : 0};

    var setPosition = function (givenPosition) {
      position.x = givenPosition.coords.latitude;
      position.y = givenPosition.coords.longitude;
    };

    var showError = function (error){
      console.log("Error - Couldn't find position - "+ error);
    };

    posService.start = function(groupeName) {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(setPosition,showError);
      } else{
        console.log("Geolocation is not supported by this browser.");
      }
    };

    posService.getPos = function(groupeId) {
      console.log(JSON.stringify(position));
      return position;
    };

    var deg2rad = function(deg) {
      return deg * (Math.PI/180)
    };

    posService.getDistanceFromLatLonInKm = function(lat1,lon1,lat2,lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1);
      var a =
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
          Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c; // Distance in km
      return d;
    };

    return posService;
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
