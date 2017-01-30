angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $http, loginFactory) {

  $scope.serverAddress = 'http://localhost:8888/';

  $scope.currentEnigme = 0;
  $scope.groupe_name = {"value":"Groupe Des Cerises"};

  // Open the login modal
  $scope.login = function() {
    $http({
      method: 'POST',
      url: $scope.serverAddress+'team',
      headers: { 'Content-type': 'application/json' },
      data: { teamName: $scope.groupe_name.value}
    }).then(function successCallback(response) {
      loginFactory.setId(response.data);
      loginFactory.setGroupeName($scope.groupe_name.value);
      var alertGoodPopup = $ionicPopup.alert({
        title: 'Groupe enregistré',
        template: 'Votre groupe a bien été pris en compte. Vous pouvez commencer à jouer!'  ,
        okText: 'Fermer'
      });
    }, function errorCallback(response) {
      console.log("Couldn't get enigma.");
      var alertGoodPopup = $ionicPopup.alert({
        title: 'Erreur',
        template: 'Votre groupe n\'a pas pu être enregistré. Veuillez réessayer plus tard.'  ,
        okText: 'Fermer'
      });
    });
  };
})

.controller('CarteCtrl', function($scope, $http) {
  //Affichage de la carte (avec un position à Strasbourg par défaut)
  var centerpos = new google.maps.LatLng(48.579400,7.7519);
  var optionsGmaps = {
    center:centerpos,
    navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 15
  };
  var map = new google.maps.Map(document.getElementById("map"), optionsGmaps);
  //console.log(JSON.stringify($scope.enigmes));

  //Affichage de la position
  $scope.position = {x : 0, y : 0};
  $scope.setPosition = function (givenPosition){
    $scope.position.x = givenPosition.coords.latitude;
    $scope.position.y = givenPosition.coords.longitude;
    var latlng = new google.maps.LatLng($scope.position.x, $scope.position.y);

    // Ajout d'un pointeur
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title:"You are here"
    });
    // centre la carte sur la position
    map.panTo(latlng);
    //console.log(position.x + " - "+ position.y);
  };
  $scope.showError = function (error){
    console.log("Error - Couldn't find position - "+ error);
  };
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition($scope.setPosition,$scope.showError);
    //navigator.geolocation.getCurrentPosition($scope.setPosition,$scope.showError);
  } else{
    console.log("Geolocation is not supported by this browser.");
  }

  //Affichage de la position des énigmes
  $http({
    method: 'GET',
    url: $scope.serverAddress+'access',
    headers: { 'Content-type': 'application/json' }
  }).then(function successCallback(response) {
    var enigmes = response.data;
    for (var enigme in enigmes) {
     // console.log(enigmes[enigme]);
      var roiCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: enigmes[enigme].coo,
        radius: 150
      });
    }
  }, function errorCallback(response) {
    console.log("Couldn't get enigma.");
  });
})


.controller('EnigmesCtrl', function($scope, $stateParams, $http, $ionicPopup) {
  $scope.position = {x : 0, y : 0};
  $scope.setPosition = function (givenPosition){
    $scope.position.x = givenPosition.coords.latitude;
    $scope.position.y = givenPosition.coords.longitude;
    //plusieurs énigmes ont la meme position -> meme groupe d'énigmes
    $http({
      method: 'GET',
      url: $scope.serverAddress+'access',
      headers: { 'Content-type': 'application/json' }
    }).then(function successCallback(response) {
      $scope.enigmes = response.data;
      for (var enigme in $scope.enigmes) {
        var a = $scope.enigmes[enigme].coo;
        var b = $scope.position;
        var distance =  $scope.getDistanceFromLatLonInKm(a.lat,a.lng,b.x,b.y);
        console.log("::::::::::::HERE::::::::::::");
        //console.log("La distance entre l'énigme et l'user est de " + distance + " km");
        if (distance<=0.150) {
          $scope.enigmes[enigme].isAvailable = true;
          var alertGoodPopup = $ionicPopup.alert({
            title: 'Zone d\'énigme',
            template: 'Vous venez d\'entrer dans la zone de l\'énigme \''+ $scope.enigmes[enigme].titre + '\'. \nAllez dans \'Enigmes\' pour la lire et la résoudre'  ,
            okText: 'Continuer'
          });
        }else
          $scope.enigmes[enigme].isAvailable = false;
      }
    }, function errorCallback(response) {
      console.log("Couldn't get enigma.");
    });
  };
  $scope.showError = function (error){
    console.log("Error - Couldn't find position - "+ error);
  };
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition($scope.setPosition,$scope.showError);
    //navigator.geolocation.getCurrentPosition($scope.setPosition,$scope.showError);
  } else{
    console.log("Geolocation is not supported by this browser.");
  }

  $scope.deg2rad = function(deg) {
    return deg * (Math.PI/180)
  }

  $scope.getDistanceFromLatLonInKm = function(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = $scope.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = $scope.deg2rad(lon2-lon1);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos($scope.deg2rad(lat1)) * Math.cos($scope.deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
  }
})



.controller('EnigmeCtrl', function($scope, $stateParams, $http, $ionicPopup, socket, loginFactory) {
  $scope.selectedEnigme;
  $scope.answToSend = {
    "enigmaID": $stateParams.enigmeId,
    "teamID" : loginFactory.get().groupe_id,
    "answer" : ""
  };

  //plusieurs énigmes ont la meme position -> meme groupe d'énigmes
  $http({
    method: 'GET',
    url: $scope.serverAddress+'access',
    headers: { 'Content-type': 'application/json' }
  }).then(function successCallback(response) {
    var enigmes = response.data;
    console.log("enigmes::"+JSON.stringify(enigmes));
    for (var enigme in enigmes) {
      if(enigmes[enigme].id == $stateParams.enigmeId)
        $scope.selectedEnigme = enigmes[enigme];
    }
    console.log("selelcted::"+JSON.stringify($scope.selectedEnigme));
  }, function errorCallback(response) {
    console.log("Couldn't get enigma.");
  });

  $scope.sendAnswer = function (){
    //console.log(JSON.stringify($scope.loginData));
    console.log(JSON.stringify($scope.answToSend));
    socket.emit("addvalidation",  $scope.answToSend);
  };

  //Envoyé lorsque la réponse a bien été reçue par le serveur
  socket.on('sentvalidation',function(data){
    console.log("in sent validation");
    var alertFailPopup = $ionicPopup.alert({
      title: 'Réponse envoyée',
      template: 'Un administrateur va vérifier votre réponse.',
      okText: 'Continuer'
    });
  });

  //Envoyé lorsqu'un administrateur a vérifié la réponse
  socket.on('isvalidated',function(isCorrect){
    if (isCorrect === 'OK'){
      document.getElementById("answer-input").className += " true-cadre";
      var alertGoodPopup = $ionicPopup.alert({
        title: 'Réponse corrigée',
        template: 'Votre réponse a été validée par un administrateur! Vous pouvez passer à l\'énigme suivante!',
        okText: 'Continuer'
      });
      $scope.currentEnigme++;
    }
    else if (isCorrect === 'NOK'){
      document.getElementById("answer-input").className += " false-cadre";
      var alertBadPopup = $ionicPopup.alert({
        title: 'Réponse corrigée',
        template: 'Votre réponse n\'a pas été validée. Vous devez faire valider votre réponse pour passer à l\'énigme suivante. \nVeuillez réessayer.',
        okText: 'Continuer'
      });
    }
  });
})


.controller('ChatCtrl', function($scope, socket) {
  $scope.messages = [];
  $scope.messageToSend = "";
  socket.on('connect',function(){
    //Add user called nickname
    socket.emit('adduser',$scope.groupe_name.value);
    console.log("Connected to socket server");
  })
  socket.on('updatechat',function(username, data){
    if (username != $scope.groupe_name.value)
      $scope.messages[$scope.messages.length] = {"content":data, "sender":username};
    else
      $scope.messages[$scope.messages.length] = {"content":data, "sender":"Vous"};
  })
  $scope.sendMessage = function() {
    socket.emit("sendchat", $scope.messageToSend);
    $scope.messageToSend = "";
  }
})

;
