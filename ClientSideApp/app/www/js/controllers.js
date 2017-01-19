angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $http) {

  // Form data for the login modal
  $scope.loginData = {'groupe_name' : '', 'mdp' : ''};
  $scope.connected = false;

  // Open the login modal
  $scope.login = function() {
    console.log(JSON.stringify($scope.loginData));
    $scope.connected= true;
  };

})

.controller('CarteCtrl', function($scope, $http) {
 // $scope.position = {x : 0, y : 0};

  //Affichage de la carte (avec un position à Strasbourg par défaut)
  var centerpos = new google.maps.LatLng(48.579400,7.7519);
  var optionsGmaps = {
    center:centerpos,
    navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 15
  };
  var map = new google.maps.Map(document.getElementById("map"), optionsGmaps);
  console.log(JSON.stringify($scope.enigmes));

  //Affichage de la position
  $scope.position = {x : 0, y : 0};
  $scope.setPosition = function (givenPosition){
    console.log("in set pos");
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
    url: 'http://10.212.118.204:8888/access',
    headers: { 'Content-type': 'application/json' }
  }).then(function successCallback(response) {
    var enigmes = response.data;
    for (var enigme in enigmes) {
      console.log(enigmes[enigme]);
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
  $scope.enigmes;
  //plusieurs énigmes ont la meme position -> meme groupe d'énigmes
  $http({
    method: 'GET',
    url: 'http://10.212.118.204:8888/access',
    headers: { 'Content-type': 'application/json' }
  }).then(function successCallback(response) {
    $scope.enigmes = response.data;
  }, function errorCallback(response) {
    console.log("Couldn't get enigma.");
  });

})



.controller('EnigmeCtrl', function($scope, $stateParams, $http, $stateParams) {
  $scope.selectedEnigme;
  $scope.answToSend = {
    "enigmaID": $stateParams.enigmeId,
    "teamID" : 4,
    "answer" : ""
  };
  $scope.isCorrect;

  //plusieurs énigmes ont la meme position -> meme groupe d'énigmes
  $http({
    method: 'GET',
    url: 'http://10.212.118.204:8888/access',
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
    $http({
      method: 'POST',
      url: 'http://10.212.118.204:8888/master',
      data : $scope.answToSend,
      headers: { 'Content-type': 'application/json' }
    }).then(function successCallback(response) {
      $scope.isCorrect = response.data;
      if ($scope.isCorrect)
        document.getElementById("answer-input").className += " true-cadre";
      else
        document.getElementById("answer-input").className += " false-cadre";
    }, function errorCallback(response) {
      console.log("Couldn't check answer");
    });
  };
});
