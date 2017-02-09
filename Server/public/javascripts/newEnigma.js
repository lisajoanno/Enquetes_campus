
var xhr = new XMLHttpRequest;

var url = 'https://web-map-project-si5.herokuapp.com';
//var url = 'http://localhost:8888';



var post = function () {

    var enigma = {
        "titre" : "",
        "coo" : {
            lat: 0,
            lng: 0
        },
        "image": "",
        "point" : 0,
        "contenu" : ""
    };

    enigma.titre = document.getElementById("titre").value;
    enigma.coo.lat = document.getElementById("lat").value;
    enigma.coo.lng = document.getElementById("lng").value;
    enigma.point = parseInt(document.getElementById("points").value);
    enigma.contenu = document.getElementById("contenu").value;
    console.log(JSON.stringify(enigma));
    xhr.open("POST", url + "/enigmas/new", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(enigma));
    alert("Enigme envoyée");

};


