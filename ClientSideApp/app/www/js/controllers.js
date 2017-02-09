angular.module('starter.controllers', [])

  .controller('AppCtrl', function($scope, $http, loginFactory, $ionicPopup, posFactory) {
    $scope.serverAddress = 'https://web-map-project-si5.herokuapp.com/';

    $scope.isInScopeForCurrent = false;
    $scope.groupe_name = {"value":""};

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
        posFactory.start();
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

  .controller('CarteCtrl', function($scope, $http, posFactory, currentEnigmaFactory, $interval) {
    //refresh the map every 10sec
    $interval(function(){
      $scope.refresh();
    }, 10000);

    //Affichage de la carte (avec un position à Strasbourg par défaut)
    var centerpos = new google.maps.LatLng(48.579400,7.7519);
    var optionsGmaps = {
      center:centerpos,
      navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: 15
    };
    var map = new google.maps.Map(document.getElementById("map"), optionsGmaps);
    var marker;
    var circles = [];

    $scope.$on('$ionicView.enter', function() {
      $scope.refresh();
    });

    $scope.refresh = function () {
      //remove old circles
      for (var i = 0 ; i<circles.length ; i++ ){
        circles[i].setMap(null);
      }

      //Affichage de la position
      $scope.position = posFactory.getPos();
      var latlng = new google.maps.LatLng($scope.position.x, $scope.position.y);

      // Ajout d'un pointeur
      if (typeof marker == 'undefined') {
        marker = new google.maps.Marker({
          position: latlng,
          map: map,
          title: "You are here"
        });
      }
      else marker.setPosition(latlng);
      // centre la carte sur la position
      map.panTo(latlng);

      //Affichage de la position des énigmes
      $http({
        method: 'GET',
        url: $scope.serverAddress + 'enigmas',
        headers: {'Content-type': 'application/json'}
      }).then(function successCallback(response) {
        var enigmes = response.data;
        if (!currentEnigmaFactory.isSet()){
          currentEnigmaFactory.set(enigmes[0]);
        }
        var currentEnigma = currentEnigmaFactory.get();
        var alreadyDisplayedPositions = [];
        for (var enigme in enigmes) {
          var isAlreadyDisplayed = false;
          for (var i = 0 ; i<alreadyDisplayedPositions.length ; i++ ){
            if(alreadyDisplayedPositions[i].lat === enigmes[enigme].coo.lat && alreadyDisplayedPositions[i].lng === enigmes[enigme].coo.lng) {
              isAlreadyDisplayed = true;
            }
          }
          if (enigmes[enigme].id === currentEnigma.id && !isAlreadyDisplayed)
          {
            var roiCircle = new google.maps.Circle({
              strokeColor: '#079819',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#079819',
              fillOpacity: 0.35,
              map: map,
              center: enigmes[enigme].coo,
              radius: 150
            });
            circles.push(roiCircle);
            alreadyDisplayedPositions.push(enigmes[enigme].coo);
          }
          else if (!isAlreadyDisplayed)
          {
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
            circles.push(roiCircle);
            alreadyDisplayedPositions.push(enigmes[enigme].coo);
          }
        }
      }, function errorCallback(response) {
        console.log("Couldn't get enigma.");
      });
    }

  })


  .controller('EnigmesCtrl', function($scope, $stateParams, $http, $ionicPopup, posFactory, currentEnigmaFactory,  $interval ) {
    $interval(function(){
      $scope.refresh();
    }, 10000);

    $scope.setPosition = function (){
      $scope.position = posFactory.getPos();
      //plusieurs énigmes ont la meme position -> meme groupe d'énigmes
      $http({
        method: 'GET',
        url: $scope.serverAddress+'enigmas',
        headers: { 'Content-type': 'application/json' }
      }).then(function successCallback(response) {
        $scope.enigmes = response.data;
        if(!currentEnigmaFactory.isSet()) {
          currentEnigmaFactory.set($scope.enigmes[0]);
        }
        $scope.currentEnigma = currentEnigmaFactory.get();
        for (var enigme in $scope.enigmes) {
          var a = $scope.enigmes[enigme].coo;
          var b = $scope.position;
          var distance =  posFactory.getDistanceFromLatLonInKm(a.lat,a.lng,b.x,b.y);
          // console.log("Enigme parcouru ("+ $scope.enigmes[enigme].id+") :"+  JSON.stringify($scope.enigmes[enigme].coo));
          if (distance<=0.150 && !$scope.isInScopeForCurrent) {   //Si on arrive dans une zone d'énigme
            if ($scope.enigmes[enigme].id == $scope.currentEnigma.id) { //Si on arrive dans la portée de la bonne enigme
              $scope.enigmes[enigme].isAvailable = true;
              var alertGoodPopup = $ionicPopup.alert({
                title: 'Zone d\'énigme',
                template: 'Vous venez d\'entrer dans la zone de l\'énigme \'' + $scope.enigmes[enigme].titre + '\'. \nAllez dans \'Enigmes\' pour la lire et la résoudre.',
                okText: 'Continuer'
              });
              $scope.isInScopeForCurrent = true;
            } else { //Si on arrive dans la portée d'une énigme avant d'avoir fait celles d'avant
              var alertGoodPopup = $ionicPopup.alert({
                title: 'Zone d\'énigme',
                template: 'Vous venez d\'entrer dans la zone de l\'énigme \'' + $scope.enigmes[enigme].titre + '\'. \nVous devez résoudre celles d\'avant pour faire celle-ci.',
                okText: 'Continuer'
              });
            }
          } else if  (distance <= 0.150 && $scope.isInScopeForCurrent && $scope.enigmes[enigme].id == $scope.currentEnigma.id )
          //Si on était déjà dans la zone pour l'énigme courrante
            $scope.enigmes[enigme].isAvailable = true;
          else {  //Si on est pas dans une zone énigme
            $scope.enigmes[enigme].isAvailable = false;
            if ($scope.enigmes[enigme].id == $scope.currentEnigma.id) //si on sort de la zone énigme pour l'énigme courrante
              $scope.isInScopeForCurrent = false;
          }
        }
      }, function errorCallback(response) {
        console.log("Couldn't get enigma.");
      });
    };

    $scope.$on('$ionicView.enter', function() {
      $scope.refresh();
    });

    $scope.refresh = function () {
      $scope.position = {x : 0, y : 0};
      $scope.currentEnigma = currentEnigmaFactory.get();
      $scope.setPosition();
    }
  })



  .controller('EnigmeCtrl', function($scope, $stateParams, $http, $ionicPopup, socket, loginFactory, currentEnigmaFactory) {
    $scope.selectedEnigme;
    $scope.answToSend = {
      "enigmaID": $stateParams.enigmeId,
      "teamID" : loginFactory.get().groupe_id,
      "answer" : ""
    };

    var nextEnigma;

    //plusieurs énigmes ont la meme position -> meme groupe d'énigmes
    $http({
      method: 'GET',
      url: $scope.serverAddress+'enigmas',
      headers: { 'Content-type': 'application/json' }
    }).then(function successCallback(response) {
      var enigmes = response.data;
      for (var i= 0 ;  i<enigmes.length ; i++) {
        if(enigmes[i].id == $stateParams.enigmeId) {
          $scope.selectedEnigme = enigmes[i];
          var imgToShow = $scope.selectedEnigme.image;
          console.log($scope.serverAddress+"uploads/"+imgToShow);
          document.getElementById("enigma-img").setAttribute("src", $scope.serverAddress+"uploads/"+imgToShow);
        }
        if(enigmes[i].id == currentEnigmaFactory.get().id) {
          nextEnigma = enigmes[i + 1];
        }
      }
    }, function errorCallback(response) {
      console.log("Couldn't get enigma.");
    });

    $scope.uploadImage = function(files) {

      var xhr = new XMLHttpRequest();
      xhr.open('POST', $scope.serverAddress + 'upload');

      var form = new FormData();
      for (var i = 0; i < files.length; i++) {
        form.append('file', files[i]);
        $scope.answToSend.answer = "IMG" + files[i].name;
      }
      xhr.send(form);
    };

    $scope.sendAnswer = function (){
      if (loginFactory.get().groupe_id!='' && loginFactory.get().groupe_id!='undefined') {
        socket.emit("addvalidation", $scope.answToSend);
      }
      else
        alert('Veuillez vous connecter d\'abord');
    };

    //Envoyé lorsque la réponse a bien été reçue par le serveur
    socket.on('sentvalidation',function(data){
      var alertFailPopup = $ionicPopup.alert({
        title: 'Réponse envoyée',
        template: 'Un administrateur va vérifier votre réponse.',
        okText: 'Continuer'
      });
    });

    //Envoyé lorsqu'un administrateur a vérifié la réponse
    socket.on('isvalidated',function(isCorrect){
      if (isCorrect === 'ok'){
        document.getElementById("answer-input").className += " true-cadre";
        var alertGoodPopup = $ionicPopup.alert({
          title: 'Réponse corrigée',
          template: 'Votre réponse a été validée par un administrateur! Vous pouvez passer à l\'énigme suivante!',
          okText: 'Continuer'
        });
        currentEnigmaFactory.set(nextEnigma);
        $scope.isInScopeForCurrent = false;
      }
      else if (isCorrect === 'nok'){
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
