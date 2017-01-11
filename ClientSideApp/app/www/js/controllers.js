angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // Form data for the login modal
  $scope.loginData = {'groupe_name' : '', 'mdp' : ''};
  $scope.connected = false;

  // Open the login modal
  $scope.login = function() {
    console.log(JSON.stringify($scope.loginData));
    $scope.connected= true;
  };

})

.controller('CarteCtrl', function($scope) {
  $scope.position = {x : 0, y : 0};
  $scope.rois = [{lat: 43.6210156491945, lng: 7.066354751586914}, { lat: 43.61910809278851 , lng: 7.0741868019104},
    { lat: 43.61879740985583, lng: 7.062127590179443}, { lat: 43.62497969832218 , lng: 7.073543071746826}]

  var centerpos = new google.maps.LatLng(48.579400,7.7519);
  var optionsGmaps = {
    center:centerpos,
    navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 15
  };
  var map = new google.maps.Map(document.getElementById("map"), optionsGmaps);

  $scope.showPosition = function (position){
    $scope.position.x = position.coords.latitude;
    $scope.position.y = position.coords.longitude;

    var latlng = new google.maps.LatLng(position.coords.latitude,
      position.coords.longitude);

    // Add a marker at position
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title:"You are here"
    });

    for (var roi in $scope.rois) {
      console.log(roi);
      var roiCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: $scope.rois[roi],
        radius: 150
      });
    }

    // center map on longitude and latitude
    map.panTo(latlng);
  };

  $scope.showError = function (error){
    console.log("Coudln't find position");
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition($scope.showPosition,$scope.showError);
  } else{
    $scope.position="Geolocation is not supported by this browser.";
  }
})

.controller('EnigmesCtrl', function($scope, $stateParams) {
  $scope.enigmes = [{title:"Quatre cartes et lettres", content: " Quatres cartes vous sont présentées. Elles contiennent toutes une lettre de l'alphabet sur chacune de leur faces."},
    {title : "Pas jumeaux ?", content :"Nous sommes nés de la même mère, la même année, le même mois, le même jour et à la même heure. Pourtant nous ne sommes pas jumeaux, ni même jumelles. Pourquoi ? "},
    {title : "Le chauffeur de taxi", content : "Un chauffeur de taxi s'engage, un peu pressé, dans une ruelle en sens interdit. Il regarde sans broncher le panneau rouge et continue."}];


  $http({
    method: 'GET',
    url: '/someUrl'
  }).then(function successCallback(response) {
    // this callback will be called asynchronously
    // when the response is available
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });


});
