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

    var cityCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: {lat: 43.6210156491945, lng: 7.066354751586914},
      radius: 200
    });

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
});
