angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $http) {

  $scope.serverAddress = 'http://10.212.118.204:8888/';

  $scope.loginData = {'groupe_name' : 'Groupe Des Cerises', 'groupe_id' : ''};
  $scope.currentEnigme = 0;

  // Open the login modal
  $scope.login = function() {
    console.log(JSON.stringify($scope.loginData));
    $http({
      method: 'POST',
      url: $scope.serverAddress+'team',
      headers: { 'Content-type': 'application/json' },
      data: { teamName: $scope.loginData.groupe_name}
    }).then(function successCallback(response) {
      $scope.loginData.groupe_id = response.data;
      console.log("IDENTIFIANT ::: "+ response.data);
      console.log(JSON.stringify($scope.loginData));
    }, function errorCallback(response) {
      console.log("Couldn't get enigma.");
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


.controller('EnigmesCtrl', function($scope, $stateParams, $http, $stateParams) {
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
        //console.log(JSON.stringify($scope.enigmes[enigme].coo));
        //console.log(JSON.stringify($scope.position));
        //coo???

        var a = $scope.enigmes[enigme].coo;
        var b = $scope.position;
        var distance =  $scope.getDistanceFromLatLonInKm(a.lat,a.lng,b.x,b.y);
        //console.log("La distance entre l'énigme et l'user est de " + distance + " km");
        if (distance<=0.150) {
          $scope.enigmes[enigme].isAvailable = true;
          ///XXXXXXXXXXXXXXXXXXXXXXXXXXXEnvoyer notif ici
          console.log("envoie de notif");


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



.controller('EnigmeCtrl', function($scope, $stateParams, $http, $ionicPopup, socket) {
  $scope.selectedEnigme;
  $scope.answToSend = {
    "enigmaID": $stateParams.enigmeId,
    "teamID" : $scope.loginData.groupe_id,
    "answer" : ""
  };
  $scope.isCorrect;

  //plusieurs énigmes ont la meme position -> meme groupe d'énigmes
  $http({
    method: 'GET',
    url: $scope.serverAddress+'access',
    headers: { 'Content-type': 'application/json' }
  }).then(function successCallback(response) {
    var enigmes = response.data;
    console.log("enigmes::"+JSON.stringify(enigmes));
    for (var enigme in enigmes) {
      console.log("id::"+enigmes[enigme].id);
      if(enigmes[enigme].id == $stateParams.enigmeId)
        $scope.selectedEnigme = enigmes[enigme];
    }
    console.log("selelcted::"+JSON.stringify($scope.selectedEnigme));
  }, function errorCallback(response) {
    console.log("Couldn't get enigma.");
  });

  $scope.sendAnswer = function (){
    console.log(JSON.stringify($scope.loginData));
    console.log(JSON.stringify($scope.answToSend));
    socket.emit("addvalidation",  $scope.answToSend);
  };

  //Envoyé lorsque la réponse a bien été reçue par le serveur
  socket.on('sentvalidation',function(data){
    console.log("in sent validation");
    var alertFailPopup = $ionicPopup.alert({
      title: 'Réponse envoyée',
      template: 'Un administrateur va vérifier votre réponse.',
      okText: 'Continuer',
      cssClass: 'failPopup'
    });
  });

  //Envoyé lorsqu'un administrateur a vérifié la réponse
  socket.on('isvalidated',function(isCorrect){
    if (isCorrect){
      document.getElementById("answer-input").className += " true-cadre";
      $scope.currentEnigme++;
    }
    else
      document.getElementById("answer-input").className += " false-cadre";
  });
})


  .controller('ChatCtrl', function($scope, socket) {
    $scope.messages = [];
    $scope.messageToSend = "";
    socket.on('connect',function(){
      //Add user called nickname
      socket.emit('adduser',$scope.loginData.groupe_name);
      console.log("Connected to socket server");
    })
    socket.on('updatechat',function(username, data){
      if (username != $scope.loginData.groupe_name)
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
